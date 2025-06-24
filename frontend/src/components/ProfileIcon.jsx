import { useState } from "react";
import ProfileCard from "./ProfileCard";

const ProfileIcon = ({ player }) => {
  const [showProfile, setShowProfile] = useState(false);

  const toggleProfile = () => setShowProfile((prev) => !prev);

  return (
    <div className="relative">
      <button
        onClick={toggleProfile}
        className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold cursor-pointer"
        title="View Profile"
      >
        {player.riotId?.gameName?.[0] || "U"}
      </button>

      {showProfile && (
        <div className="absolute top-12 right-0 z-50 w-72">
          <ProfileCard player={player} />
        </div>
      )}
    </div>
  );
};

export default ProfileIcon;
