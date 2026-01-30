import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import { useContext } from "react";
import { MockContext } from "./context/Mock";

const App = () => {
    const {isLoggedIn}= useContext(MockContext);
    
    return (
        <Routes key={isLoggedIn}>
            <Route
                path="/"
                element={ isLoggedIn ? <HomePage /> : <Navigate to="/login" /> }
            />
            <Route
                path="/login"
                element={ !isLoggedIn ? <LoginPage /> : <Navigate to="/" /> }
            />
        </Routes>
    );
};

export default App;
