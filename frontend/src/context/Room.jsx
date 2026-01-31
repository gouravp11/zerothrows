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

    const handleGoChat = (room) => {
        setActiveRoom(room);
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

    const handleRoomCreated = (room) => {
        if (room) {
            setRooms((prev) => [...prev, room]);
        }
    };
    const handleRoomDeleted = (room) => {
        if (room) {
            setRooms((prev) => {
                return prev.filter((r) => r._id != room._id);
            });
        }
    };
    const handleRoomJoined = (room) => {
        if (room) {
            setRooms((prev) => {
                return prev.map((r) => {
                    if (r._id == room._id) {
                        return room;
                    }
                });
            });
        }
    };
    const handleRoomLeft = (room) => {
        if (room) {
            setRooms((prev) => {
                return prev.map((r) => {
                    if (r._id == room._id) {
                        return room;
                    }
                });
            });
        }
    };

    const fetchRooms = async () => {
        try {
            if (!currentUser) {
                console.error("User not logged in");
                return;
            }

            const res = await fetchAllRooms(currentUser.puuid);
            if (!res.ok) {
                const errorData = await res.json();
                console.error(errorData.error || "Failed to fetch rooms");
                return;
            }

            const data = await res.json();
            const previouslyJoinedRoom = data.find((room) =>
                room.participants?.some((p) => p.puuid === currentUser?.puuid)
            );
            if (previouslyJoinedRoom) emitJoinRoom(previouslyJoinedRoom._id);
            setRooms(data);
        } catch (error) {
            console.error("Failed to fetch rooms:", error);
        }
    };

    const handleJoinRoom = async (roomId) => {
        try {
            if (!currentUser) {
                console.error("You must be logged in to join a room.");
                return;
            }

            const participant = {
                gameName: currentUser.riotId.gameName,
                tagLine: currentUser.tagLine,
                puuid: currentUser.puuid
            };
            const res = await joinRoom(roomId, participant);
            if (!res.ok) {
                const errorData = await res.json();
                console.error(errorData.error || "Failed to join room");
                return;
            }
            emitJoinRoom(roomId);
            emitChatMessage(roomId, "System", `${currentUser.riotId.gameName} joined the room`);
        } catch (error) {
            console.error("Error joining room:", error);
        }
    };

    const handleLeaveRoom = async (roomId) => {
        try {
            if (!currentUser) {
                console.error("You must be logged in to leave a room.");
                return;
            }
            const res = await leaveRoom(roomId, currentUser.puuid);
            if (!res.ok) {
                const err = await res.json();
                console.error(err.error || "Failed to leave room");
                return;
            }

            emitChatMessage(roomId, "System", `${currentUser.riotId.gameName} left the room`);
            emitLeaveRoom(roomId);
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
            if (!res.ok) {
                const errorData = await res.json();
                console.error(errorData.error || "Failed to delete room");
                return;
            }
        } catch (error) {
            console.error("Failed to delete room:", error);
        }
    };

    const handleLeaveRoomAll = (roomId) => {
        // joinedRoom won't exist in client's side if room is created by client itself
        if (roomId === joinedRoom?._id || roomId === myRoom?._id) {
            emitLeaveRoom(roomId);
        } else {
            console.error("Room deletion failed");
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
        handleLeaveRoomAll,
        handleRoomCreated,
        handleRoomDeleted,
        handleRoomJoined,
        handleRoomLeft
    };
    return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
};
