// Importation des modules nécessaires
const crypto = require("crypto");
const db = require("../db/connectionDb");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Récupération de la clé secrète
const SECRET_KEY = process.env.SECRET_KEY;

module.exports = {
  // Fonction de connexion de l'utilisateur
  loginUser: (req, res) => {
    const { username, password } = req.body;

    // Vérifie que les champs sont bien renseignés
    if (!username || !password) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    // Récupère les infos de l'utilisateur en base
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

      // Hachage du mot de passe fourni en ajoutant le sel
      const hashedPassword = crypto
        .createHash("sha256")
        .update(password + sel)
        .digest("hex");

      // Vérifie si le mot de passe correspond
      if (hashedPassword !== hash) {
        return res.status(401).json({ message: "Mot de passe incorrect" });
      }

      // Création d'un token JWT qui expire en 2 heures
      const token = jwt.sign({ id, username, role }, SECRET_KEY, {
        expiresIn: "2h",
      });

      console.log("Token généré :", token);

      // Envoie le token dans un cookie sécurisé
      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        maxAge: 3600000,
      });

      // Redirection vers le dashboard
      res.redirect("/dashboard");
    });
  },
};
