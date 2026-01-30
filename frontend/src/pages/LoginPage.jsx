import { useContext, useState } from "react";
import Button from "../components/Button";
import { MockContext } from "../context/Mock";

const LoginPage = () => {
    const { users, handleLogin } = useContext(MockContext);
    const [selectedUser, setSelectedUser] = useState("demo");
    const [loading, setLoading] = useState(false);

    const onLogin = async () => {
        try {
            setLoading(true);
            handleLogin(selectedUser);
        } catch (err) {
            console.error("Login failed:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
            <h1 className="text-3xl font-bold mb-6">Welcome to ZeroThrows</h1>

            <label htmlFor="user">Select mock user: (Mock Riot Sign In)</label>
            <select
                name="user"
                onChange={(e) => setSelectedUser(e.target.value)}
                className="mb-4 px-4 py-2 rounded border border-gray-300"
                disabled={loading}
            >
                {users.map((u) => (
                    <option key={u} value={u}>
                        {u}
                    </option>
                ))}
            </select>

            <Button onClick={onLogin} className="bg-indigo-600 hover:bg-indigo-700 cursor-pointer">
                Sign in with Riot (Mock)
            </Button>
        </div>
    );
};

export default LoginPage;
