const db = require("../db/");

module.exports = {
  // Inscription d'un utilisateur
  registerUser: (req, res) => {
    const { username, hash, sel } = req.body;

    // Vérifier si les champs sont bien remplis
    if (!username || !hash || !sel) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    // Insérer l'utilisateur dans la base de données
    const sql = "INSERT INTO t_users (username, hash, sel) VALUES (?, ?, ?)";
    db.query(sql, [username, hash, sel], (err, result) => {
      if (err) {
        console.error("❌ Erreur d'inscription :", err);
        return res.status(500).json({ message: "Erreur serveur" });
      }
      res.status(201).json({ message: "Utilisateur enregistré avec succès !" });
    });
  },
};
