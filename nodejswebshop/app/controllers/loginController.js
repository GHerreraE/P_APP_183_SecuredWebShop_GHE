const crypto = require("crypto");
const db = require("../db/connectionDb");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;

module.exports = {
  loginUser: (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    const sql = "SELECT id, role, hash, sel FROM t_users WHERE username = ?";
    db.query(sql, [username], (err, results) => {
      if (err) {
        console.error("Erreur SQL :", err);
        return res.status(500).json({ message: "Erreur serveur" });
      }

      if (results.length === 0) {
        return res.status(401).json({ message: "Utilisateur non trouvé" });
      }

      const { id, role, hash, sel } = results[0];

      const hashedPassword = crypto
        .createHash("sha256")
        .update(password + sel)
        .digest("hex");
      if (hashedPassword !== hash) {
        return res.status(401).json({ message: "Mot de passe incorrect" });
      }

      const token = jwt.sign({ id: id, username, role }, SECRET_KEY, {
        expiresIn: "2h",
      });

      console.log("Token généré :", token);

      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        maxAge: 3600000,
      });

      res.redirect("/dashboard");
    });
  },
};
