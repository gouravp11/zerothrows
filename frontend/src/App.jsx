import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import { useState } from "react";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("user"));
  return (
      <Routes>
        <Route
          path="/"
          element={isLoggedIn ? <HomePage onLogout={()=>setIsLoggedIn(false)}/> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!isLoggedIn ? <LoginPage onLogin={()=>setIsLoggedIn(true)}/> : <Navigate to="/" />}
        />
      </Routes>
  );
};

export default App;
