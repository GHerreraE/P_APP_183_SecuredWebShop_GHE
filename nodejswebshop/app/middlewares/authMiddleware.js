const jwt = require("jsonwebtoken");
require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY;
module.exports = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Accès interdit. Token manquant." });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalide." });
  }
};
