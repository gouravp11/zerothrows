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

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log("Server is listening on port", PORT);
});
