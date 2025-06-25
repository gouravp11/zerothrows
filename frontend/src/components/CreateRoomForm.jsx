import { useState } from "react";

const CreateRoomForm = ({ onCreate }) => {
    const [roomName, setRoomName] = useState("");
    const [region, setRegion] = useState("NA");
    const [minRank, setMinRank] = useState("");
    const [minPeakRank, setMinPeakRank] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        const newRoom = {
            roomName,
            region,
            requirements: {
                minRank: minRank || null,
                minPeakRank: minPeakRank || null,
                description: description || null
            },
            createdAt: new Date(),
        };

        onCreate(newRoom); // Send data to parent or API
        setRoomName("");
        setMinRank("");
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white shadow-md rounded-lg p-4 max-w-md mx-auto"
        >
            <h2 className="text-lg font-semibold mb-2">Create a Room</h2>
            <input
                className="w-full mb-2 px-3 py-2 border rounded"
                placeholder="Room Name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                required
            />
            <select
                className="w-full mb-2 px-3 py-2 border rounded"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
            >
                <option value="NA">NA</option>
                <option value="EMEA">EMEA</option>
                <option value="APAC">APAC</option>
                <option value="CN">CN</option>
            </select>
            <input
                className="w-full mb-3 px-3 py-2 border rounded"
                placeholder="Minimum Rank (optional)"
                value={minRank}
                onChange={(e) => setMinRank(e.target.value)}
            />
            <input
                className="w-full mb-3 px-3 py-2 border rounded"
                placeholder="Minimum Peak Rank (optional)"
                value={minPeakRank}
                onChange={(e) => setMinPeakRank(e.target.value)}
            />
            <textarea
                className="w-full mb-3 px-3 py-2 border rounded"
                placeholder="Room Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
            />
            <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
                Create
            </button>
        </form>
    );
};

export default CreateRoomForm;
