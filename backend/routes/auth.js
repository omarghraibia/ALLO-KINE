const express = require('express');
const router = express.Router();

router.post('/login', async (req, res) => {
    res.json({ msg: "Route login prête" });
});

module.exports = router;
