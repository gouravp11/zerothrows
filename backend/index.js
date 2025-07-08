const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./db");
const authRoutes = require("./routes/auth");
const roomRoutes = require("./routes/room");

dotenv.config();

const app = express();
const server = http.createServer(app); // Create HTTP server for Socket.io

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"], // Frontend origin
    methods: ["GET", "POST"],
  },
});
app.set("io", io);

const corsOptions = {
  origin: ["http://localhost:5173"],
};
app.use(cors(corsOptions));
app.use(express.json());

connectDB();

app.use("/auth", authRoutes);
app.use("/api/rooms", roomRoutes);

// Minimal Socket.io connection
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  io.emit("roomUpdated");

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined chat room ${roomId}`);
  });

  socket.on("leaveRoom", (roomId) => {
    socket.leave(roomId);
    console.log(`User ${socket.id} left chat room ${roomId}`);
  });

  socket.on("chatMessage", ({ roomId, sender, message }) => {
    io.to(roomId).emit("chatMessage", {
      sender,
      message,
      time: new Date().toISOString(),
    });
  });
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log("Server is listening on port", PORT);
});
