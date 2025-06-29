const express = require("express");
const router = express.Router();


router.get("/mock-login/:user", (req, res) => {
  const users = {
    demo: {
      riotId: { gameName: "DemoPlayer", tagLine: "1234" },
      puuid: "mock-puuid-1234",
      region: "NA",
      stats: { level: 50, rank: "Gold II" },
      isPublic: true,
    },
    alt: {
      riotId: { gameName: "OtherPlayer", tagLine: "5678" },
      puuid: "mock-puuid-5678",
      region: "EMEA",
      stats: { level: 60, rank: "Platinum I" },
      isPublic: true,
    },
    bot: {
      riotId: { gameName: "BotLaneGod", tagLine: "9999" },
      puuid: "mock-puuid-9999",
      region: "APAC",
      stats: { level: 45, rank: "Silver IV" },
      isPublic: true,
    },
  };

  const userKey = req.params.user;
  const selectedUser = users[userKey];

  if (selectedUser) {
    res.json(selectedUser);
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

module.exports = router;