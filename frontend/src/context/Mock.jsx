import { createContext, useState } from "react";
import { getMockUser } from "../api/mock";

export const MockContext = createContext(null);

export const MockProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("user"));

    const users = ["demo", "alt", "bot", "alpha", "bravo", "charlie", "barley"];
    const currentUser = isLoggedIn ? JSON.parse(localStorage.getItem("user")) : null;

    const handleLogin = async (selectedUser) => {
        const res = await getMockUser(selectedUser);
        const user = await res.json();
        localStorage.setItem("user", JSON.stringify(user));
        setIsLoggedIn(true);
    };
    const handleLogout = () => {
        localStorage.removeItem("user");
        setIsLoggedIn(false);
    };

    console.log(isLoggedIn, currentUser);
    const value = {
        users,
        isLoggedIn,
        currentUser,
        handleLogin,
        handleLogout
    };
    return <MockContext.Provider value={value}>{children}</MockContext.Provider>;
};
