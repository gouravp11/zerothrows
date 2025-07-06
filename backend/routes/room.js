const express = require("express");
const router = express.Router();
const Room = require("../models/RoomModel");

// GET /api/rooms/ -> fetch all rooms
router.get("/", async (req, res) => {
  try {
    const userPuuid = req.header("X-User-Puuid");

    if (!userPuuid) {
      return res.status(401).json({ error: "Unauthorized: User not logged in" });
    }

    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({ error: "Failed to fetch rooms" });
  }
});


// POST /api/rooms/create -> create a room
router.post("/create", async (req, res) => {
  try {
    const roomData = req.body;
    const { createdBy } = roomData;

    // Check if user logged in or not
    if (!createdBy || !createdBy.puuid) {
      return res.status(401).json({ error: "Unauthorized: User info missing" });
    }

    // Check if this user already has any room
    const existingRoom = await Room.findOne({
      "createdBy.puuid": createdBy.puuid,
    });

    if (existingRoom) {
      return res.status(400).json({
        error: "You already have a room. You cannot create multiple rooms at the same time.",
      });
    }

    // Add the creator to the participants list with full details
    roomData.participants = [
      {
        gameName: createdBy.gameName,
        tagLine: createdBy.tagLine,
        puuid: createdBy.puuid,
      },
    ];

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
    const { createdBy } = req.body;

    if (!createdBy || !createdBy.puuid) {
      return res.status(401).json({ error: "Unauthorized: User info missing" });
    }

    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    if (room.createdBy.puuid !== createdBy.puuid) {
      return res.status(403).json({ error: "Forbidden: You can only delete your own room" });
    }

    await room.deleteOne();

    res.json({ message: "Room deleted successfully", room });
  } catch (error) {
    console.error("Error deleting room:", error);
    res.status(500).json({ error: "Failed to delete room" });
  }
});

router.post("/join/:roomId", async (req, res) => {
  try {
    const { roomId } = req.params;
    const { participant } = req.body;

    if (!participant || !participant.puuid) {
      return res.status(400).json({ error: "Participant info missing" });
    }

    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Check if user is already a participant
    const alreadyParticipant = room.participants.some(
      (p) => p.puuid === participant.puuid
    );

    if (alreadyParticipant) {
      return res.status(400).json({ error: "You have already joined this room" });
    }

    // Check if max participants reached
    if (room.participants.length >= 5) {
      return res.status(400).json({ error: "Room is full. Max 5 participants allowed" });
    }

    room.participants.push(participant);
    await room.save();

    res.json(room);
  } catch (error) {
    console.error("Error joining room:", error);
    res.status(500).json({ error: "Failed to join room" });
  }
});



module.exports = router;
