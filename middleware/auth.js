const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // Récupérer le token du header HTTP
    const token = req.header('x-auth-token');

    // Vérifier si le token est présent
    if (!token) {
        return res.status(401).json({ msg: 'Pas de token, accès refusé' });
    }

    try {
        // Vérifier la signature du token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Session expirée ou invalide' });
    }
};