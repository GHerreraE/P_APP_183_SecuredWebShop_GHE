// Importation de la connexion à la BDD
const connection = require("../db/connectionDb");

// Affichage de la page admin
exports.adminPage = (req, res) => {
  // Vérifie que l'utilisateur est admin
  if (req.user.role !== "admin") {
    return res.status(403).send("Accès refusé");
  }

  // Requête pour récupérer tous les utilisateurs
  const query = "SELECT id, username, role FROM t_users";
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération des utilisateurs:", err);
      return res.status(500).send("Erreur serveur");
    }

    console.log("Utilisateur connecté :", req.user);
    console.log("Utilisateurs récupérés :", results);

    // Affiche la vue admin avec les données récupérées
    res.render("admin", { user: req.user, users: results });
  });
};

// Recherche d'utilisateurs selon le critère du username
exports.searchUsers = (req, res) => {
  // Vérifie que l'utilisateur est admin
  if (req.user.role !== "admin") {
    return res.status(403).send("Accès refusé");
  }

  // Récupère la recherche saisie par l'utilisateur
  const searchQuery = req.body.search.trim();
  const query = "SELECT id, username, role FROM t_users WHERE username LIKE ?";

  connection.query(query, [`%${searchQuery}%`], (err, results) => {
    if (err) {
      console.error("Erreur lors de la recherche:", err);
      return res.status(500).send("Erreur serveur");
    }

    // Affiche la vue admin avec les résultats de recherche
    res.render("admin", { user: req.user, users: results });
  });
};
