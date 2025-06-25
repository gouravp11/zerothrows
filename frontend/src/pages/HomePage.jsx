import { useNavigate } from "react-router-dom";
import ProfileIcon from "../components/ProfileIcon";
import Modal from "../components/Modal";
import CreateRoomForm from "../components/CreateRoomForm";
import { useState } from "react";

const HomePage = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/login");
        window.location.reload();
    };

    const [showCreateForm, setShowCreateForm] = useState(false);

    const handleCreateRoom = (roomData) => {
        console.log("Room created:", roomData);
        setShowCreateForm(false); // Close modal
    };
    const user = JSON.parse(localStorage.getItem("user"));

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

            <div>
                <button onClick={() => setShowCreateForm(true)} className="text-4xl my-5 border-2 border-gray-200 rounded p-2 cursor-pointer">+ Create Room</button>
                {showCreateForm && (
                    <Modal onClose={() => setShowCreateForm(false)}>
                        <CreateRoomForm onCreate={handleCreateRoom} />
                    </Modal>
                )}
            </div>
        </>

    );
};

export default HomePage;
