const ProfileCard = ({ player }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto mt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            {player.riotId.gameName}#{player.riotId.tagLine}
          </h2>
          <p className="text-gray-500">Region: {player.region}</p>
          <p className="text-gray-500">PUUID: {player.puuid}</p>
        </div>
        <div>
          <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
            {player.stats.rank || "Unranked"}
          </span>
        </div>
      </div>
      <p className="mt-2 text-sm text-gray-600">Account Level: {player.stats.level}</p>
    </div>
  );
};

export default ProfileCard;
