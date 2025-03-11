const connection = require("../db/connectionDb");

exports.adminPage = (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).send("Accès refusé");
  }

  const query = "SELECT id, username, role FROM t_users";
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération des utilisateurs:", err);
      return res.status(500).send("Erreur serveur");
    }

    console.log("Utilisateur connecté :", req.user);
    console.log("Utilisateurs récupérés :", results);

    res.render("admin", { user: req.user, users: results });
  });
};

exports.searchUsers = (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).send("Accès refusé");
  }

  const searchQuery = req.body.search.trim();
  const query = "SELECT id, username, role FROM t_users WHERE username LIKE ?";

  connection.query(query, [`%${searchQuery}%`], (err, results) => {
    if (err) {
      console.error("Erreur lors de la recherche:", err);
      return res.status(500).send("Erreur serveur");
    }

    res.render("admin", { user: req.user, users: results });
  });
};
