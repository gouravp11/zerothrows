const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomName: {
    type: String,
    required: true,
  },
  region: {
    type: String,
    required: true,
  },
  description: String,
  requirements: {
    minRank: String,
    minPeakRank: String,
  },
  createdBy: {
    gameName: String,
    tagLine: String,
    puuid: String,
  },
  participants: [
    {
      gameName: String,
      tagLine: String,
      puuid: String,
    },
  ],
  messages: [
    {
      sender: String,
      message: String,
      time: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Room", roomSchema);
