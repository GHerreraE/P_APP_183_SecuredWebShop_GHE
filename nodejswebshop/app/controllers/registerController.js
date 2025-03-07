const crypto = require("crypto");
const db = require("../db/connectionDb");
require("dotenv").config();

module.exports = {
  registerUser: (req, res) => {
    // recupère l'username et le password pour les traiter
    const { username, password } = req.body;

    // validatio pour reenvoyer un formulaire remplis
    if (!username || !password) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    // générer un sel aléatoire de 16 caractères
    const salt = crypto.randomBytes(8).toString("hex");

    // hacher le mot de passe avec SHA-256
    const hash = crypto
      // mode d'hachage
      .createHash("sha256")
      // ajoute le mot de passe au hachage
      .update(password + salt)
      // convertit le résultat en hexadécimal
      .digest("hex");

    // Définir le rôle par défaut
    const role = "user";

    // insérer dans la base de données
    // (?, ?, ?) = éviter les injections SQL
    const sql =
      "INSERT INTO t_users (username, role, hash, sel) VALUES (?, ?, ?, ?)";
    // query = execute une requete sql dans mysql avec "sql" qui a in insert into
    db.query(sql, [username, role, hash, salt], (err) => {
      if (err) {
        console.error("Erreur d'inscription :", err);
        return res.status(500).json({ message: "Erreur serveur" });
      }
      res.redirect("/postRegister");
    });
  },
};
