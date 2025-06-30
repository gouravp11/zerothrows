import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ProfileIcon from "../components/ProfileIcon";
import Modal from "../components/Modal";
import CreateRoomForm from "../components/CreateRoomForm";
import RoomCard from "../components/RoomCard";

const HomePage = () => {
  const navigate = useNavigate();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [regionFilter, setRegionFilter] = useState("ALL");

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
    window.location.reload();
  };

  const handleCreateRoom = (roomData) => {
    console.log("Room created:", roomData);
    setShowCreateForm(false);
    fetchRooms(); // refresh rooms after creating a new one
  };

  const handleDeleteRoom = async (roomId) => {
    try {
      await fetch(`http://localhost:8080/api/rooms/delete/${roomId}`, {
        method: "DELETE",
      });
      console.log("Room deleted:", roomId);
      fetchRooms(); // refresh list after deleting
    } catch (error) {
      console.error("Failed to delete room:", error);
    }
  };

  const handleJoinRoom = (roomId) => {
    console.log(`Joining room: ${roomId}`);
    // Add real join API call here later
  };
  const fetchRooms = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/rooms");
      const data = await res.json();
      setRooms(data);
    } catch (error) {
      console.error("Failed to fetch rooms:", error);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const myRooms = rooms.filter((room) => room.createdBy?.puuid === user.puuid);

  const otherRooms = rooms.filter(
    (room) =>
      room.createdBy?.puuid !== user.puuid &&
      (regionFilter === "ALL" || room.region === regionFilter)
  );

  return (
    <>
      <div className="p-4 bg-gray-100 flex items-center justify-between">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer"
        >
          Logout
        </button>

        <div>
          <ProfileIcon player={user} />
        </div>
      </div>

      <div className="p-4 space-y-8">
        <button
          onClick={() => setShowCreateForm(true)}
          className="text-4xl my-5 border-2 border-gray-200 rounded p-2 cursor-pointer"
        >
          + Create Room
        </button>

        {showCreateForm && (
          <Modal onClose={() => setShowCreateForm(false)}>
            <CreateRoomForm onCreate={handleCreateRoom} />
          </Modal>
        )}

        <section>
          <h2 className="text-2xl font-bold mb-4">My Rooms</h2>
          {myRooms.length > 0 ? (
            myRooms.map((room) => (
              <RoomCard
                key={room._id}
                room={room}
                isOwnRoom={true}
                onDelete={handleDeleteRoom}
              />
            ))
          ) : (
            <p className="text-gray-600">You haven’t created any rooms yet.</p>
          )}
        </section>

        <section>
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-2xl font-bold">Browse Rooms</h2>
            <select
              className="px-3 py-2 border rounded"
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
              />
            ))
          ) : (
            <p className="text-gray-600">No rooms found in this region.</p>
          )}
        </section>
      </div>
    </>
  );
};

export default HomePage;
