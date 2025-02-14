const crypto = require("crypto");
const db = require("../db/connectionDb");

module.exports = {
  loginUser: (req, res) => {
    // recupère l'username et le password pour les traiter
    const { username, password } = req.body;

    // validatio pour reenvoyer un formulaire remplis
    if (!username || !password) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    // vérifier si l'utilisateur existe
    const sql = "SELECT hash, sel FROM t_users WHERE username = ?";

    // execute la requete en sql
    db.query(sql, [username], (err, results) => {
      // condition dans le cas le serveur ait un erreur
      if (err) {
        console.error("Erreur lors de la recherche de l'utilisateur :", err);
        return res.status(500).json({ message: "Erreur serveur" });
      }

      // validation si le nombre de resultats trouvés sont 0, alors on affiche rien et juste un message de "Utilisateur non trouvé"
      if (results.length === 0) {
        return res.status(401).json({ message: "Utilisateur non trouvé" });
      }

      // recupère l'hash et le sel du utilisateur
      const { hash, sel } = results[0];

      // recalculer le hash avec le sel stocké
      const hashedPassword = crypto
        .createHash("sha256")
        .update(password + sel)
        .digest("hex");

      // vérifier si le hash correspond db
      if (hashedPassword !== hash) {
        return res.status(401).json({ message: "Mot de passe incorrect" });
      }

      // authentification réussie
      res.render("postLogin", { username });
    });
  },
};
