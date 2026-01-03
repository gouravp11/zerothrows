import { useState, useEffect } from "react";
import socket from "../utils/socket";
import Navbar from "../sections/Navbar";
import CreateRoom from "../sections/CreateRoom";
import MyRoom from "../sections/MyRoom";
import JoinedRoom from "../sections/JoinedRoom";
import BrowseRooms from "../sections/BrowseRooms";
import Chat from "../overlays/Chat";
import { fetchAllRooms, joinRoom, leaveRoom } from "../api/room";

const HomePage = ({ onLogout }) => {
    const currentUser = JSON.parse(localStorage.getItem("user"));

    const [rooms, setRooms] = useState([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [regionFilter, setRegionFilter] = useState("ALL");
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [activeRoom, setActiveRoom] = useState(null);

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
                // console.log("Joined room successfully:", updatedRoom);
                await fetchRooms();
                socket.emit("joinRoom", roomId);
                socket.emit("chatMessage", {
                    roomId,
                    sender: "System",
                    message: `${currentUser.riotId.gameName} joined the room`
                });
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
                setIsChatOpen(false);
                await fetchRooms();
                socket.emit("chatMessage", {
                    roomId,
                    sender: "System",
                    message: `${currentUser.riotId.gameName} left the room`
                });
                socket.emit("leaveRoom", roomId);
            } else {
                const err = await res.json();
                alert(err.error || "Failed to leave room");
            }
        } catch (err) {
            console.error("Error leaving room:", err);
        }
    };

    const handleGoChat = (roomId) => {
        const selectedRoom = rooms.find((r) => r._id === roomId);
        setActiveRoom(selectedRoom);
        setIsChatOpen(true);
    };

    const fetchRooms = async () => {
        try {
            if (!currentUser) {
                console.error("User not logged in");
                return [];
            }

            const res = await fetchAllRooms(currentUser.puuid);
            if (res.ok) {
                const data = await res.json();
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

    const fetchRoomsAndJoin = async () => {
        const rooms = await fetchRooms();
        console.log(rooms);

        if (!rooms.length) return;

        const joinedRoom = rooms.find((room) =>
            room.participants?.some((p) => p.puuid === currentUser?.puuid)
        );

        if (joinedRoom) {
            socket.emit("joinRoom", joinedRoom._id);
        }
    };

    const isInAnyRoom = rooms.some((room) =>
        room.participants?.some((p) => p.puuid === currentUser.puuid)
    );

    const myRoom = rooms.filter((room) => room.createdBy?.puuid === currentUser.puuid)[0];

    const joinedRoom = rooms.find(
        (room) =>
            room.createdBy?.puuid !== currentUser.puuid &&
            room.participants?.some((p) => p.puuid === currentUser.puuid)
    );

    const otherRooms = rooms.filter(
        (room) =>
            room.createdBy?.puuid !== currentUser.puuid &&
            room._id !== joinedRoom?._id &&
            (regionFilter === "ALL" || room.region === regionFilter)
    );

    useEffect(() => {
        fetchRoomsAndJoin();
        socket.on("roomUpdated", () => {
            fetchRooms();
            // the re-render due to fetchRooms-->state change, WON'T do nothing to socket connection
            // therefore all joins of the rooms remain same, Even on "roomUpdated" event
        });

        return () => {
            socket.off("roomUpdated");
            // runs when homepage unmounts, reloads etc (Basically focused out)
        };
    }, []);

    return (
        <>
            <Navbar onLogout={onLogout} user={currentUser} />

            <div className="px-4 py-6 max-w-4xl mx-auto space-y-12">
                <CreateRoom
                    showCreateForm={showCreateForm}
                    setShowCreateForm={setShowCreateForm}
                    fetchRooms={fetchRooms}
                />

                <MyRoom
                    myRoom={myRoom}
                    handleJoinRoom={handleJoinRoom}
                    handleGoChat={handleGoChat}
                    isInAnyRoom={isInAnyRoom}
                    currentUser={currentUser}
                />

                <JoinedRoom
                    joinedRoom={joinedRoom}
                    handleGoChat={handleGoChat}
                    handleLeaveRoom={handleLeaveRoom}
                    isInAnyRoom={isInAnyRoom}
                    setIsChatOpen={setIsChatOpen}
                    currentUser={currentUser}
                />

                <BrowseRooms
                    otherRooms={otherRooms}
                    regionFilter={regionFilter}
                    setRegionFilter={setRegionFilter}
                    handleJoinRoom={handleJoinRoom}
                    handleGoChat={handleGoChat}
                    isInAnyRoom={isInAnyRoom}
                    setIsChatOpen={setIsChatOpen}
                    currentUser={currentUser}
                />

                <Chat
                    isChatOpen={isChatOpen}
                    activeRoom={activeRoom}
                    setIsChatOpen={setIsChatOpen}
                    handleLeaveRoom={handleLeaveRoom}
                />
            </div>
        </>
    );
};

export default HomePage;
