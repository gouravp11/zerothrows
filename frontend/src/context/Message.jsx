import { createContext, useContext, useState } from "react";
import { RoomContext } from "./Room";
import { getRoomMessages } from "../api/room";
import { emitChatMessage } from "../sockets/room.emits";
import { MockContext } from "./Mock";

export const MessageContext = createContext(null);

export const MessageProvider = ({ children }) => {
    const { currentUser } = useContext(MockContext);
    const { activeRoom } = useContext(RoomContext);
    const [messages, setMessages] = useState([]);

    const senderName = currentUser?.riotId?.gameName || "Unknown";
    const isOwner = currentUser?.puuid === activeRoom.createdBy?.puuid;

    const fetchMessages = async () => {
        try {
            const res = await getRoomMessages(activeRoom._id);
            const data = await res.json();
            if (data.success && Array.isArray(data.messages)) {
                setMessages(data.messages);
            }
        } catch (err) {
            console.error("Failed to load messages:", err);
        }
    };
    const handleChatMessage = (msg) => {
        setMessages((prev) => [...prev, msg]);
    };
    const handleSendMessage = (msg) => {
        if (!msg.trim()) return;

        emitChatMessage(activeRoom._id, senderName, msg);
    };
    const value = {
        messages,
        senderName,
        isOwner,
        fetchMessages,
        handleChatMessage,
        handleSendMessage
    };
    return <MessageContext.Provider value={value}> {children} </MessageContext.Provider>;
};
