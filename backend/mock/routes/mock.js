const express = require("express");
const router = express.Router();
const mockUsers = require("../data/mock-users.json");

router.get("/mock-login/:mockUser", (req, res) => {
    const userKey = req.params.mockUser;
    const selectedUser = mockUsers[userKey];

    if (selectedUser) {
        res.json(selectedUser);
    } else {
        res.status(404).json({ error: "Mock user not found" });
    }
});

module.exports = router;
