import React from "react";
import Button from "../components/Button";
import ProfileIcon from "../components/ProfileIcon";

const Navbar = ({ onLogout, user }) => {
    const handleLogout = () => {
        localStorage.removeItem("user");
        onLogout();
    };
    return (
        <div className="flex items-center justify-between bg-white shadow-md px-6 py-4">
            <h1 className="text-2xl font-extrabold text-green-600">ZeroThrows</h1>
            <div className="flex items-center gap-4">
                <Button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 transition text-white px-4 py-2 rounded-md cursor-pointer"
                >
                    Logout
                </Button>
                <ProfileIcon player={user} />
            </div>
        </div>
    );
};

export default Navbar;
