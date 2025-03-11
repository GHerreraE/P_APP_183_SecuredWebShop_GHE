const jwt = require("jsonwebtoken");
const connection = require("../db/connectionDb");
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;

module.exports = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    console.log("Aucun token trouvé dans les cookies.");
    return res.status(401).json({ message: "Accès interdit. Token manquant." });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    console.log("Token décodé :", decoded);

    const userId = parseInt(decoded.id, 10);
    if (isNaN(userId)) {
      console.log("ID utilisateur invalide dans le token.");
      return res.status(401).json({ message: "Token invalide. ID incorrect." });
    }

    const query = "SELECT id, username, role FROM t_users WHERE id = ?";
    connection.query(query, [userId], (err, results) => {
      if (err) {
        console.error("Erreur MySQL :", err);
        return res.status(500).json({ message: "Erreur serveur." });
      }
      if (results.length === 0) {
        console.log("Utilisateur non trouvé dans la base de données.");
        return res.status(401).json({ message: "Utilisateur introuvable." });
      }

      req.user = results[0];

      console.log("Utilisateur authentifié :", req.user);

      if (req.path.startsWith("/admin") && req.user.role !== "admin") {
        console.log("Accès refusé : utilisateur non admin.");
        return res.status(403).json({ message: "Accès refusé. Admin requis." });
      }

      next();
    });
  } catch (err) {
    console.log("Erreur lors de la vérification du token :", err.message);
    return res.status(401).json({ message: "Token invalide." });
  }
};
