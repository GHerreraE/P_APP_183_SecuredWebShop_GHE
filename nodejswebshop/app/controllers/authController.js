const jwt = require("jsonwebtoken");

const SECRET_KEY = "ETML1234";

module.exports = {
  // Générer un token JWT après connexion
  generateToken: (username) => {
    return jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
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
