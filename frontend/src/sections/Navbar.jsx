import { useContext } from "react";
import Button from "../components/Button";
import ProfileIcon from "../components/ProfileIcon";
import { MockContext } from "../context/Mock";

const Navbar = () => {
    const { currentUser, handleLogout } = useContext(MockContext);

    const onLogout = () => {
        handleLogout();
    };

    return (
        <div className="flex items-center justify-between bg-white shadow-md px-6 py-4">
            <h1 className="text-2xl font-extrabold text-green-600">ZeroThrows</h1>
            <div className="flex items-center gap-4">
                <Button
                    onClick={onLogout}
                    className="bg-red-500 hover:bg-red-600 transition text-white px-4 py-2 rounded-md cursor-pointer"
                >
                    Logout
                </Button>
                <ProfileIcon player={currentUser} />
            </div>
        </div>
    );
};

export default Navbar;
