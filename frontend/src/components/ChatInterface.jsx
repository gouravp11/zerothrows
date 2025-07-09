import { useEffect, useState, useRef } from "react";
import socket from "../utils/socket";

const ChatInterface = ({ room, onLeaveRoom }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const senderName = currentUser?.riotId?.gameName || "Unknown";
  const isOwner = currentUser?.puuid === room.createdBy?.puuid;

  useEffect(() => {
  // Fetch existing messages from backend
  const fetchMessages = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/rooms/${room._id}/messages`);
      const data = await res.json();
      if (data.success && Array.isArray(data.messages)) {
        setMessages(data.messages);
      }
    } catch (err) {
      console.error("Failed to load messages:", err);
    }
  };

  fetchMessages(); // load old messages
  // Set up real-time listener
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
    <div className="flex flex-col w-[600px] max-w-full h-[600px] max-h-[90vh] p-6">
      <div className="flex items-center justify-between mb-2">
        {!isOwner && (
          <button
            onClick={() => {
              onLeaveRoom(room._id);
            }}
            className="text-sm font-semibold text-white px-3 py-2 bg-red-500 rounded"
          >
            Leave Room
          </button>
        )}
      </div>

      <h2 className="text-xl font-bold mb-2">
        Chat - {room.roomName} ({room.region})
      </h2>

      <div className="flex-1 overflow-y-auto border rounded p-2 mb-4 bg-gray-50">
        {messages.length === 0 && (
          <>
            <div className="mb-2 text-sm text-gray-800">
              <span className="font-semibold">System:</span> Welcome to the
              chat!
            </div>
            <div className="mb-2 text-sm text-gray-800">
              <span className="font-semibold">{room.createdBy?.gameName}:</span>{" "}
              Let’s get ready!
            </div>
          </>
        )}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 text-sm ${
              msg.sender === "System" ? "text-gray-500 italic" : "text-gray-800"
            }`}
          >
            {msg.sender !== "System" && (
              <span className="font-semibold">{msg.sender}:</span>
            )}{" "}
            {msg.message}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex">
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 border p-2 rounded-l focus:outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 rounded-r hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;
