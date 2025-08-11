import { useState, useRef, useEffect } from "react";
import ProfileCard from "./ProfileCard";
import Button from "./Button";

const ProfileIcon = ({ player }) => {
  const [showProfile, setShowProfile] = useState(false);
  const wrapperRef = useRef(null);

  const toggleProfile = () => setShowProfile((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={wrapperRef}>
      <Button
        onClick={toggleProfile}
        className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold cursor-pointer"
        title="View Profile"
      >
        {player.riotId?.gameName?.[0] || "U"}
      </Button>

      {showProfile && (
        <div className="absolute top-12 right-0 z-50 w-72">
          <ProfileCard player={player} />
        </div>
      )}
    </div>
  );
};

export default ProfileIcon;
