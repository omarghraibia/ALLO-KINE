const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // Récupérer le token du header HTTP
    const token = req.header('x-auth-token');
    
    console.log("🔍 [DEBUG AUTH] Token reçu :", token ? "Oui" : "Non");
    console.log("🔍 [DEBUG AUTH] Clé secrète présente :", process.env.JWT_SECRET ? "Oui" : "Non");

    // Vérifier si le token est présent
    if (!token) {
        console.log("🚨 Rejeté : Aucun token fourni");
        return res.status(401).json({ msg: 'Pas de token, accès refusé' });
    }

    try {
        // Vérifier la signature du token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        console.log("✅ Accès autorisé pour l'utilisateur ID:", req.user.id);
        next();
    } catch (err) {
        console.log("🚨 Rejeté : Token invalide ou expiré ->", err.message);
        res.status(401).json({ msg: 'Session expirée ou invalide' });
    }
};