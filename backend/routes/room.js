const express = require("express");
const router = express.Router();
const Room = require("../models/RoomModel");

// POST /api/rooms/create
router.post("/create", async (req, res) => {
  try {
    const roomData = req.body;

    const room = new Room(roomData);
    await room.save();

    res.status(201).json(room); // return the created room
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(500).json({ error: "Failed to create room" });
  }
});

module.exports = router;
