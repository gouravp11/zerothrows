import { useState, useEffect } from "react";
import Button from "../components/Button";
import ProfileIcon from "../components/ProfileIcon";
import Modal from "../components/Modal";
import CreateRoomForm from "../components/CreateRoomForm";
import RoomCard from "../components/RoomCard";
import ChatInterface from "../components/ChatInterface";
import socket from "../utils/socket";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const HomePage = ({ onLogout }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [regionFilter, setRegionFilter] = useState("ALL");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeRoom, setActiveRoom] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    onLogout();
  };

  const handleCreateRoom = (roomData) => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    // console.log("Room created:", roomData);
    setShowCreateForm(false);
    fetchRooms();
    socket.emit("joinRoom", roomData._id);
    socket.emit("chatMessage", {
      roomId: roomData._id,
      sender: "System",
      message: `${currentUser.riotId.gameName} joined the room`,
    });
  };

  const handleDeleteRoom = async (roomId) => {
    try {
      const currentUser = JSON.parse(localStorage.getItem("user"));
      socket.emit("requestLeaveRoom", roomId);

      const res = await fetch(`${backendUrl}/api/rooms/delete/${roomId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          createdBy: {
            gameName: currentUser.riotId.gameName,
            tagLine: currentUser.riotId.tagLine,
            puuid: currentUser.puuid,
          },
        }),
      });

      if (res.ok) {
        // console.log("Room deleted:", roomId);
        fetchRooms();
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Failed to delete room");
      }
    } catch (error) {
      console.error("Failed to delete room:", error);
    }
  };

  const handleJoinRoom = async (roomId) => {
    try {
      const currentUser = JSON.parse(localStorage.getItem("user"));

      if (!currentUser) {
        alert("You must be logged in to join a room.");
        return;
      }

      const res = await fetch(`${backendUrl}/api/rooms/join/${roomId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          participant: {
            gameName: currentUser.riotId.gameName,
            tagLine: currentUser.riotId.tagLine,
            puuid: currentUser.puuid,
          },
        }),
      });

      if (res.ok) {
        const updatedRoom = await res.json();
        // console.log("Joined room successfully:", updatedRoom);
        fetchRooms();
        socket.emit("joinRoom", roomId);
        socket.emit("chatMessage", {
          roomId,
          sender: "System",
          message: `${currentUser.riotId.gameName} joined the room`,
        });
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Failed to join room");
      }
    } catch (error) {
      console.error("Error joining room:", error);
    }
  };

  const handleGoChat = (roomId) => {
    const selectedRoom = rooms.find((r) => r._id === roomId);
    setActiveRoom(selectedRoom);
    setIsChatOpen(true);
  };

  const currentUserPuuid = JSON.parse(localStorage.getItem("user")).puuid;
  const isInAnyRoom = rooms.some((room) =>
    room.participants?.some((p) => p.puuid === currentUserPuuid)
  );

  const fetchRoomsAndJoin = async () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem("user"));

      if (!currentUser) {
        console.error("User not logged in");
        return;
      }

      const res = await fetch(`${backendUrl}/api/rooms`, {
        headers: {
          "X-User-Puuid": currentUser.puuid,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setRooms(data);

        const joinedRoom = data.find((room) =>
          room.participants?.some((p) => p.puuid === currentUser.puuid)
        );

        if (joinedRoom) {
          socket.emit("joinRoom", joinedRoom._id);
        }
      } else {
        const errorData = await res.json();
        console.error(errorData.error || "Failed to fetch rooms");
      }
    } catch (error) {
      console.error("Failed to fetch rooms:", error);
    }
  };

  const fetchRooms = async () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem("user"));

      if (!currentUser) {
        console.error("User not logged in");
        return;
      }

      const res = await fetch(`${backendUrl}/api/rooms`, {
        headers: {
          "X-User-Puuid": currentUser.puuid,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setRooms(data);
      } else {
        const errorData = await res.json();
        console.error(errorData.error || "Failed to fetch rooms");
      }
    } catch (error) {
      console.error("Failed to fetch rooms:", error);
    }
  };

  const handleLeaveRoom = async (roomId) => {
    const currentUser = JSON.parse(localStorage.getItem("user"));

    try {
      const res = await fetch(`${backendUrl}/api/rooms/leave/${roomId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ puuid: currentUser.puuid }),
      });

      if (res.ok) {
        setIsChatOpen(false);
        fetchRooms();
        socket.emit("chatMessage", {
          roomId,
          sender: "System",
          message: `${currentUser.riotId.gameName} left the room`,
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

  useEffect(() => {
    fetchRoomsAndJoin();
    socket.on("roomUpdated", () => {
      fetchRooms();
    });

    return () => {
      socket.off("roomUpdated");
    };
  }, []);

  const myRoom = rooms.filter(
    (room) => room.createdBy?.puuid === user.puuid
  )[0];

  const joinedRoom = rooms.find(
    (room) =>
      room.createdBy?.puuid !== user.puuid &&
      room.participants?.some((p) => p.puuid === user.puuid)
  );

  const otherRooms = rooms.filter(
    (room) =>
      room._id !== joinedRoom?._id &&
      room.createdBy?.puuid !== user.puuid &&
      (regionFilter === "ALL" || room.region === regionFilter)
  );

  return (
    <>
      <div className="flex items-center justify-between bg-white shadow-md px-6 py-4">
        <h1 className="text-2xl font-extrabold text-green-600">ZeroThrows</h1>
        <div className="flex items-center gap-4">
          <Button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 transition text-white px-4 py-2 rounded-md cursor-pointer"
          >
            Logout
          </Button>
          <ProfileIcon player={user} />
        </div>
      </div>

      <div className="px-4 py-6 max-w-4xl mx-auto space-y-12">
        <div className="flex justify-center">
          <Button
            onClick={() => setShowCreateForm(true)}
            className="text-xl font-medium bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded shadow cursor-pointer"
          >
            + Create Room
          </Button>
        </div>

        {showCreateForm && (
          <Modal onClose={() => setShowCreateForm(false)}>
            <CreateRoomForm onCreate={handleCreateRoom} />
          </Modal>
        )}

        <section>
          <h2 className="text-2xl font-semibold mb-2">My Room</h2>
          {myRoom ? (
            <RoomCard
              key={myRoom._id}
              room={myRoom}
              isOwnRoom={true}
              onDelete={handleDeleteRoom}
              onJoin={handleJoinRoom}
              onGoChat={handleGoChat}
              isInAnyRoom={isInAnyRoom}
              currentUserPuuid={currentUserPuuid}
            />
          ) : (
            <p className="text-gray-500">You haven’t created any rooms yet.</p>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">Joined Room</h2>
          {joinedRoom ? (
            <RoomCard
              room={joinedRoom}
              isOwnRoom={false}
              onLeave={handleLeaveRoom}
              onGoChat={handleGoChat}
              isInAnyRoom={isInAnyRoom}
              onForceClose={() => setIsChatOpen(false)}
              currentUserPuuid={currentUserPuuid}
            />
          ) : (
            <p className="text-gray-500">You haven’t joined any room yet.</p>
          )}
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Browse Rooms</h2>
            <select
              className="px-3 py-2 border border-gray-300 rounded-md"
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
            >
              <option value="ALL">All Regions</option>
              <option value="NA">NA</option>
              <option value="EMEA">EMEA</option>
              <option value="APAC">APAC</option>
              <option value="CN">CN</option>
            </select>
          </div>
          {otherRooms.length > 0 ? (
            otherRooms.map((room) => (
              <RoomCard
                key={room._id}
                room={room}
                isOwnRoom={false}
                onJoin={handleJoinRoom}
                onLeave={handleLeaveRoom}
                onGoChat={handleGoChat}
                isInAnyRoom={isInAnyRoom}
                onForceClose={() => setIsChatOpen(false)}
                currentUserPuuid={currentUserPuuid}
              />
            ))
          ) : (
            <p className="text-gray-500">No rooms found in this region.</p>
          )}
        </section>

        {isChatOpen && activeRoom && (
          <Modal onClose={() => setIsChatOpen(false)}>
            <ChatInterface room={activeRoom} onLeaveRoom={handleLeaveRoom} />
          </Modal>
        )}
      </div>
    </>
  );
};

export default HomePage;
