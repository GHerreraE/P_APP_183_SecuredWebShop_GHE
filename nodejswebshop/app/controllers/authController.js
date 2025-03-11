const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;

module.exports = {
  generateToken: (id, username, role) => {
    return jwt.sign({ id, username, role }, SECRET_KEY, { expiresIn: "1h" });
  },

  verifyToken: (token) => {
    try {
      return jwt.verify(token, SECRET_KEY);
    } catch (err) {
      return null;
    }
  },
};
