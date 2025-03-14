const crypto = require("crypto");
const db = require("../db/connectionDb");
require("dotenv").config();

module.exports = {
  registerUser: (req, res) => {
    // Récupère l'username et le password du formulaire
    const { username, password } = req.body;

    // Vérifie que les champs sont remplis
    if (!username || !password) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    // Génère un sel aléatoire de 16 caractères (8 octets en hexadécimal)
    const salt = crypto.randomBytes(8).toString("hex");

    // Hache le mot de passe en y ajoutant le sel, avec l'algorithme SHA-256
    const hash = crypto
      .createHash("sha256")
      .update(password + salt)
      .digest("hex");

    // Rôle par défaut de l'utilisateur
    const role = "user";

    // Prépare la requête SQL pour insérer l'utilisateur dans la base
    const sql =
      "INSERT INTO t_users (username, role, hash, sel) VALUES (?, ?, ?, ?)";
    db.query(sql, [username, role, hash, salt], (err) => {
      if (err) {
        console.error("Erreur d'inscription :", err);
        return res.status(500).json({ message: "Erreur serveur" });
      }
      // Redirige vers la page post-inscription
      res.redirect("/postRegister");
    });
  },
};
