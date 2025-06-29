const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./db");
const authRoutes = require('./routes/auth');
const roomRoutes = require("./routes/room");

dotenv.config();

const corsOptions = {
    origin: ["http://localhost:5173"],
}
app.use(cors(corsOptions));
app.use(express.json());

connectDB();

app.use('/auth', authRoutes);
app.use("/api/rooms", roomRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log("Server is listening to port", PORT);
})