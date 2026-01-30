import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { MockProvider } from "./context/Mock.jsx"
import { RoomProvider } from "./context/Room.jsx";
import { MessageProvider } from "./context/Message.jsx";

createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <MockProvider>
            <RoomProvider>
                <MessageProvider>
                    <App />
                </MessageProvider>
            </RoomProvider>
        </MockProvider>
    </BrowserRouter>
);
