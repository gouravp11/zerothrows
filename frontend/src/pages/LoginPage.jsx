import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  const users = ["demo", "alt", "bot", "alpha", "bravo", "charlie", "barley"];
  const [selected, setSelected] = useState("demo");

  const handleLogin = async () => {
    const res = await fetch(`http://localhost:8080/auth/mock-login/${selected}`);
    const user = await res.json();
    localStorage.setItem("user", JSON.stringify(user));
    navigate("/");
    window.location.reload();
  };


  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Welcome to FiveStack</h1>

      <label htmlFor="user">Select mock user: </label>
      <select
        name="user"
        onChange={(e) => setSelected(e.target.value)}
        className="mb-4 px-4 py-2 rounded border border-gray-300"
      >
        {users.map((u) => (
          <option key={u} value={u}>
            {u}
          </option>
        ))}
      </select>

      <button
        onClick={handleLogin}
        className="bg-indigo-600 text-white px-6 py-3 rounded hover:bg-indigo-700 cursor-pointer"
      >
        Sign in with Riot (Mock)
      </button>
    </div>
  );
};

export default LoginPage;
