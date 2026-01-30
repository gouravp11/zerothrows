import { createContext, useContext, useState } from "react";
import { createRoom, deleteRoom, fetchAllRooms, joinRoom, leaveRoom } from "../api/room";
import { MockContext } from "./Mock";
import {
    emitChatMessage,
    emitJoinRoom,
    emitLeaveRoom,
    emitRequestLeaveRoom
} from "../sockets/room.emits";

export const RoomContext = createContext(null);

export const RoomProvider = ({ children }) => {
    const { currentUser } = useContext(MockContext);
    const [rooms, setRooms] = useState([]);
    const [activeRoom, setActiveRoom] = useState({});
    // const [regionFilter, setRegionFilter] = useState("ALL");
    const handleGoChat = (room) => {
        // const selectedRoom = rooms.find((r) => r._id === roomId);
        setActiveRoom(room);
        // setIsChatOpen(true);
    };
    const myRoom = currentUser
        ? rooms.filter((room) => room.createdBy?.puuid === currentUser.puuid)[0]
        : null;

    const joinedRoom = currentUser
        ? rooms.find(
              (room) =>
                  room.createdBy?.puuid !== currentUser.puuid &&
                  room.participants?.some((p) => p.puuid === currentUser.puuid)
          )
        : null;
    console.log("This is my Room", myRoom);
    console.log("This is joined Room", joinedRoom);

    // const otherRooms = rooms.filter(
    //     (room) =>
    //         room.createdBy?.puuid !== currentUser.puuid &&
    //         room._id !== joinedRoom?._id &&
    //         (regionFilter === "ALL" || room.region === regionFilter)
    // );

    const fetchRooms = async () => {
        try {
            if (!currentUser) {
                console.error("User not logged in");
                return [];
            }

            const res = await fetchAllRooms(currentUser.puuid);
            if (res.ok) {
                const data = await res.json();
                console.log(data);
                setRooms(data);
                return data;
            } else {
                const errorData = await res.json();
                console.error(errorData.error || "Failed to fetch rooms");
                return [];
            }
        } catch (error) {
            console.error("Failed to fetch rooms:", error);
            return [];
        }
    };

    const handleJoinRoom = async (roomId) => {
        try {
            if (!currentUser) {
                alert("You must be logged in to join a room.");
                return;
            }
            const participant = {
                gameName: currentUser.riotId.gameName,
                tagLine: currentUser.tagLine,
                puuid: currentUser.puuid
            };
            const res = await joinRoom(roomId, participant);
            if (res.ok) {
                const updatedRoom = await res.json();
                console.log("Joined room successfully:", updatedRoom);
                await fetchRooms();
                emitJoinRoom(roomId);
                emitChatMessage(roomId, "System", `${currentUser.riotId.gameName} joined the room`);
            } else {
                const errorData = await res.json();
                alert(errorData.error || "Failed to join room");
            }
        } catch (error) {
            console.error("Error joining room:", error);
        }
    };

    const handleLeaveRoom = async (roomId) => {
        try {
            const res = await leaveRoom(roomId, currentUser.puuid);
            if (res.ok) {
                // setIsChatOpen(false);
                await fetchRooms();
                emitChatMessage(roomId, "System", `${currentUser.riotId.gameName} left the room`);
                emitLeaveRoom(roomId);
            } else {
                const err = await res.json();
                alert(err.error || "Failed to leave room");
            }
        } catch (err) {
            console.error("Error leaving room:", err);
        }
    };

    const handleCreateRoom = async (newRoom) => {
        try {
            if (!currentUser) {
                console.error("You must be logged in to create a room.");
                return;
            }
            const payload = {
                ...newRoom,
                createdBy: {
                    gameName: currentUser.riotId.gameName,
                    tagLine: currentUser.riotId.tagLine,
                    puuid: currentUser.puuid
                }
            };

            const res = await createRoom(payload);
            if (!res.ok) {
                const errorData = await res.json();
                console.error(errorData.error || "Failed to create room");
                return null;
            }

            const savedRoom = await res.json();

            emitJoinRoom(savedRoom._id);
            emitChatMessage(
                savedRoom._id,
                "System",
                `${currentUser.riotId.gameName} joined the room`
            );

            return savedRoom;
        } catch (error) {
            console.error("Error creating room:", error);
            return null;
        }
    };

    const handleDeleteRoom = async (roomId) => {
        try {
            emitRequestLeaveRoom(roomId);

            const createdBy = {
                gameName: currentUser.riotId.gameName,
                tagLine: currentUser.tagLine,
                puuid: currentUser.puuid
            };

            const res = await deleteRoom(createdBy, roomId);
            if (res.ok) {
                // console.log("Room deleted:", roomId);
                await fetchRooms();
            } else {
                const errorData = await res.json();
                alert(errorData.error || "Failed to delete room");
            }
        } catch (error) {
            console.error("Failed to delete room:", error);
        }
    };

    const handleLeaveRoomAll = (roomId) => {
        // joinedRoom won't exist in client's side if room is created by client itself
        if (roomId === joinedRoom?._id || roomId === myRoom?._id) {
            emitLeaveRoom(roomId);
        }
    };

    const fetchMessages = async () => {
        try {
            const res = await getRoomMessages(activeRoom._id);
            const data = await res.json();
            if (data.success && Array.isArray(data.messages)) {
                setMessages(data.messages);
            }
        } catch (err) {
            console.error("Failed to load messages:", err);
        }
    };

    const value = {
        rooms,
        myRoom,
        joinedRoom,
        activeRoom,
        fetchRooms,
        handleGoChat,
        handleJoinRoom,
        handleLeaveRoom,
        handleCreateRoom,
        handleDeleteRoom,
        handleLeaveRoomAll
    };
    return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
};
