const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;

module.exports = {
  // Génère un token JWT contenant id, username et role, qui expire au bout de 1h
  generateToken: (id, username, role) => {
    return jwt.sign({ id, username, role }, SECRET_KEY, { expiresIn: "1h" });
  },

  // Vérifie le token JWT et retourne ses données; retourne null si le token n'est pas valide
  verifyToken: (token) => {
    try {
      return jwt.verify(token, SECRET_KEY);
    } catch (err) {
      return null;
    }
  },
};
