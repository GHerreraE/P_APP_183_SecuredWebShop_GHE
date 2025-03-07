const crypto = require("crypto");
const db = require("../db/connectionDb");
const authController = require("./authController");
require("dotenv").config();
module.exports = {
  loginUser: (req, res) => {
    // Récupérer l'username et le password depuis le formulaire
    const { username, password } = req.body;

    // Vérifier que tous les champs sont renseignés
    if (!username || !password) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    // Requête pour récupérer le hash et le salt associés à l'utilisateur
    const sql = "SELECT role, hash, sel FROM t_users WHERE username = ?";
    db.query(sql, [username], (err, results) => {
      if (err) {
        console.error("Erreur lors de la recherche de l'utilisateur :", err);
        return res.status(500).json({ message: "Erreur serveur" });
      }

      // Si aucun utilisateur n'est trouvé, renvoyer une erreur
      if (results.length === 0) {
        return res.status(401).json({ message: "Utilisateur non trouvé" });
      }

      // Récupérer le hash et le sel stockés en base de données
      const { role, hash, sel } = results[0];

      // Recalculer le hash avec le mot de passe fourni et le salt stocké
      const hashedPassword = crypto
        .createHash("sha256")
        .update(password + sel)
        .digest("hex");

      // Comparer le hash recalculé avec celui en base de données
      if (hashedPassword !== hash) {
        return res.status(401).json({ message: "Mot de passe incorrect" });
      }

      // Générer un token JWT
      const token = authController.generateToken({ username, role });

      // Définir le cookie avec le token (exemple : cookie httpOnly avec expiration 1h)
      res.cookie("cookies", token, { httpOnly: true, maxAge: 3600000 });

      // Authentification réussie : rediriger vers le dashboard et transmettre le token si nécessaire
      res.render("dashboard", { username, role, token });
    });
  },
};
