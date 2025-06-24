import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = async () => {
    const res = await fetch("http://localhost:8080/auth/mock-login");
    const user = await res.json();

    // Store the user in localStorage or a global context
    localStorage.setItem("user", JSON.stringify(user));

    // Redirect to Home
    navigate("/");
    window.location.reload();
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Welcome to FiveStack</h1>
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
