import { useNavigate } from "react-router-dom";
import ProfileIcon from "../components/ProfileIcon";

const HomePage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
    window.location.reload();
  };

  const user = JSON.parse(localStorage.getItem("user"));

  return (
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
  );
};

export default HomePage;
