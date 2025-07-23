import { useState } from "react";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const CreateRoomForm = ({ onCreate }) => {
  const [roomName, setRoomName] = useState("");
  const [region, setRegion] = useState("NA");
  const [minRank, setMinRank] = useState("");
  const [minPeakRank, setMinPeakRank] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const currentUser = JSON.parse(localStorage.getItem("user"));

    const newRoom = {
      roomName,
      region,
      description: description || null,
      requirements: {
        minRank: minRank || null,
        minPeakRank: minPeakRank || null,
      },
      createdBy: {
        gameName: currentUser.riotId.gameName,
        tagLine: currentUser.riotId.tagLine,
        puuid: currentUser.puuid,
      },
    };

    try {
      const res = await fetch(`${backendUrl}/api/rooms/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRoom),
      });

      if (res.ok) {
        const savedRoom = await res.json();
        // console.log("Room created:", savedRoom); 
        onCreate(savedRoom);
        setRoomName("");
        setRegion("NA");
        setMinRank("");
        setMinPeakRank("");
        setDescription("");
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Failed to create room");
      }
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-lg rounded-xl p-6 max-w-lg mx-auto border border-gray-200"
    >
      <h2 className="text-2xl font-bold text-indigo-700 mb-6 text-center">
        Create a New Room
      </h2>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Room Name *</label>
        <input
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          placeholder="Enter room name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Region</label>
        <select
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        >
          <option value="NA">NA</option>
          <option value="EMEA">EMEA</option>
          <option value="APAC">APAC</option>
          <option value="CN">CN</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Minimum Rank (optional)
        </label>
        <input
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          placeholder="e.g., Gold, Platinum"
          value={minRank}
          onChange={(e) => setMinRank(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Minimum Peak Rank (optional)
        </label>
        <input
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          placeholder="e.g., Diamond, Ascendant"
          value={minPeakRank}
          onChange={(e) => setMinPeakRank(e.target.value)}
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">
          Room Description (optional)
        </label>
        <textarea
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          placeholder="Add some context or rules for the room..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 rounded-md text-lg font-medium hover:bg-indigo-700 transition cursor-pointer"
      >
        Create Room
      </button>
    </form>
  );
};

export default CreateRoomForm;
