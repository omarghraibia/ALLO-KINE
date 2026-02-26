const express = require('express');
const router = express.Router();

router.post('/login', async (req, res) => {
    // On remplira la logique de sécurité après le test de démarrage
    res.json({ msg: "Route login prête" });
});

module.exports = router;