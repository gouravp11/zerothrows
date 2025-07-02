const express = require("express");
const router = express.Router();
const Room = require("../models/RoomModel");

// GET /api/rooms/ -> fetch all rooms
router.get("/", async (req, res) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms); // return all rooms
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({ error: "Failed to fetch rooms" });
  }
});

// POST /api/rooms/create -> create a room
router.post("/create", async (req, res) => {
  try {
    const roomData = req.body;
    const { createdBy, region } = roomData;

    // Check if this user already has a room in the same region
    const existingRoom = await Room.findOne({
      "createdBy.puuid": createdBy.puuid,
      region: region,
    });

    if (existingRoom) {
      return res.status(400).json({
        error: "You already have a room in this region. You cannot create multiple rooms in the same region.",
      });
    }

    const room = new Room(roomData);
    await room.save();

    res.status(201).json(room);
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(500).json({ error: "Failed to create room" });
  }
});


// DELETE /api/rooms/:roomId -> delete a room by ID
router.delete("/delete/:roomId", async (req, res) => {
  try {
    const { roomId } = req.params;

    const deletedRoom = await Room.findByIdAndDelete(roomId);

    if (!deletedRoom) {
      return res.status(404).json({ error: "Room not found" });
    }

    res.json({ message: "Room deleted successfully", room: deletedRoom });
  } catch (error) {
    console.error("Error deleting room:", error);
    res.status(500).json({ error: "Failed to delete room" });
  }
});

module.exports = router;
