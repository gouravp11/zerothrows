import { useEffect, useState, useRef } from "react";
import socket from "../utils/socket";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const ChatInterface = ({ room, onLeaveRoom }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const senderName = currentUser?.riotId?.gameName || "Unknown";
  const isOwner = currentUser?.puuid === room.createdBy?.puuid;

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `${backendUrl}/api/rooms/${room._id}/messages`
        );
        const data = await res.json();
        if (data.success && Array.isArray(data.messages)) {
          setMessages(data.messages);
        }
      } catch (err) {
        console.error("Failed to load messages:", err);
      }
    };

    fetchMessages();

    const handleMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("chatMessage", handleMessage);
    return () => {
      socket.off("chatMessage", handleMessage);
    };
  }, [room._id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;

    socket.emit("chatMessage", {
      roomId: room._id,
      sender: senderName,
      message: input,
    });

    setInput("");
  };

  return (
    <div className="flex flex-col max-w-full h-[600px] max-h-[90vh] bg-white rounded-xl overflow-hidden">
      <div className="flex items-center justify-between bg-indigo-600 text-white px-5 py-3">
        <h2 className="text-lg font-semibold">
          Chat - {room.roomName} ({room.region})
        </h2>
        {!isOwner && (
          <button
            onClick={() => onLeaveRoom(room._id)}
            className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-3 py-1 rounded cursor-pointer"
          >
            Leave Room
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 bg-gray-50 space-y-2 text-sm">
        {messages.length === 0 && (
          <>
            <div className="text-gray-500 italic">
              System: Welcome to the chat!
            </div>
            <div className="text-gray-500 italic">
              {room.createdBy?.gameName}: Let’s get ready!
            </div>
          </>
        )}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-[80%] px-4 py-2 rounded-lg ${
              msg.sender === "System"
                ? "mx-auto text-center bg-gray-200 text-gray-600 text-xs italic"
                : msg.sender === senderName
                ? "ml-auto bg-indigo-100 text-indigo-800"
                : "mr-auto bg-white border text-gray-800"
            }`}
          >
            {msg.sender !== "System" && (
              <div className="font-semibold text-xs mb-1">{msg.sender}</div>
            )}
            {msg.message}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex border-t px-4 py-3 bg-white">
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 border border-gray-300 px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-r-md cursor-pointer"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;
