const mongoose = require("mongoose");

const DB_URI = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/zerothrows";
const connectDB = () => {
    mongoose
        .connect(DB_URI)
        .then(() => console.log("MongoDB connected"))
        .catch((err) => console.error("MongoDB connection error:", err));
};

module.exports = connectDB;
