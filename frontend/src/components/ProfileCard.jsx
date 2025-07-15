const ProfileCard = ({ player }) => {
  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 max-w-md mx-auto mt-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            {player.riotId.gameName}
            <span className="text-gray-400 font-medium">#{player.riotId.tagLine}</span>
          </h2>
          <p className="text-sm text-gray-600 mt-1">🌍 Region: {player.region}</p>
          <p className="text-sm text-gray-600">🆔 PUUID: {player.puuid}</p>
        </div>
        <div>
          <span className="inline-block bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold">
            {player.stats.rank || "Unranked"}
          </span>
        </div>
      </div>
      <p className="mt-4 text-sm text-gray-700">
        🎮 Account Level: <span className="font-medium">{player.stats.level}</span>
      </p>
    </div>
  );
};

export default ProfileCard;
