const express = require("express");
const router = express.Router();


router.get("/mock-login", (req, res)=>{
    const mockUser = {
    riotId: { gameName: "DemoPlayer", tagLine: "1234" },
    puuid: "mock-puuid-1234",
    region: "NA",
    stats: {
      level: 50,
      rank: "Gold II"
    },
    isPublic: true
  };

  res.json(mockUser);
})

module.exports = router;