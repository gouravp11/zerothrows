const RoomCard = ({ room, isOwnRoom, onDelete, onJoin }) => (
  <div className="bg-white shadow rounded p-4 mb-4">
    <h3 className="text-lg font-semibold">{room.roomName}</h3>
    <p className="text-gray-500 text-sm">Region: {room.region}</p>
    <p className="text-gray-500 text-sm mb-2">
      Created by: {room.createdBy?.gameName}#{room.createdBy?.tagLine}
    </p>
    <p className="text-gray-600 text-sm mb-2">
      {room.description || "No description provided."}
    </p>
    <p className="text-gray-500 text-xs">
      Requirements: Rank {room.requirements?.minRank || "N/A"} / Peak Rank{" "}
      {room.requirements?.minPeakRank || "N/A"}
    </p>
    {isOwnRoom ? (
      <button
        onClick={() => onDelete(room._id)}
        className="mt-2 bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
      >
        Delete Room
      </button>
    ) : (
      <button
        onClick={() => onJoin(room._id)}
        className="mt-2 bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
      >
        Join Room
      </button>
    )}
  </div>
);

export default RoomCard;
