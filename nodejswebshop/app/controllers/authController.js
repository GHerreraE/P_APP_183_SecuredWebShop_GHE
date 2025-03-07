const jwt = require("jsonwebtoken");
require("dotenv").config();

// Récupère la clé secrète depuis le fichier .env
const SECRET_KEY = process.env.SECRET_KEY;

module.exports = {
  // Générer un token JWT après connexion
  generateToken: (username, role) => {
    return jwt.sign({ username, role }, SECRET_KEY, { expiresIn: "1h" });
  },

  // Vérifier un token JWT
  verifyToken: (token) => {
    try {
      return jwt.verify(token, SECRET_KEY); // Vérifie et décode le token
    } catch (err) {
      return null; // Token invalide
    }
  },
};
