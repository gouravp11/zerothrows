const RoomCard = ({
  room,
  isOwnRoom,
  onDelete,
  onJoin,
  onLeave,
  onGoChat,
  currentUserPuuid,
  isInAnyRoom,
}) => {
  const isParticipant = room.participants?.some(
    (p) => p.puuid === currentUserPuuid
  );

  return (
    <div className="bg-white shadow rounded p-4 mb-4">
      <h3 className="text-lg font-semibold">{room.roomName}</h3>
      <p className="text-gray-500 text-sm">Region: {room.region}</p>
      <p className="text-gray-500 text-sm mb-2">
        Created by: {room.createdBy?.gameName}#{room.createdBy?.tagLine}
      </p>
      <p className="text-gray-600 text-sm mb-2">
        {room.description || "No description provided."}
      </p>
      <p className="text-gray-500 text-xs mb-1">
        Requirements: Rank {room.requirements?.minRank || "N/A"} / Peak Rank{" "}
        {room.requirements?.minPeakRank || "N/A"}
      </p>
      <p className="text-gray-500 text-xs mb-2">
        Participants: {room.participants?.length || 0} / 5
      </p>

      {isOwnRoom ? (
        <div className="flex gap-3">
          <button
            onClick={() => onDelete(room._id)}
            className="mt-2 bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
          >
            Delete Room
          </button>
          <button
            onClick={() => onGoChat(room._id)}
            className="mt-2 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
          >
            Go to Chat
          </button>
        </div>
      ) : isParticipant ? (
        <div className="flex gap-3">
          <button
            onClick={() => onGoChat(room._id)}
            className="mt-2 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
          >
            Go to Chat
          </button>
          <button
            onClick={() => onLeave(room._id)}
            className="mt-2 bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
          >
            Leave Room
          </button>
        </div>
      ) : room.participants?.length >= 5 ? (
        <button
          disabled
          className="mt-2 bg-gray-400 text-white px-4 py-1 rounded cursor-not-allowed"
        >
          Room Full
        </button>
      ) : isInAnyRoom ? (
        <button
          disabled
          className="mt-2 bg-gray-400 text-white px-4 py-1 rounded cursor-not-allowed"
        >
          Already in Room
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
};

export default RoomCard;
