const express = require("express");
const router = express.Router();
const registerController = require("../controllers/registerController");
const loginController = require("../controllers/loginController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminController = require("../controllers/adminController");
const connection = require("../db/connectionDb");

// Redirige vers le login si on accède à la racine
router.get("/", (req, res) => {
  res.redirect("/login");
});

// Affiche la page de connexion
router.get("/login", (req, res) => {
  res.render("login");
});

// Affiche la page d'inscription
router.get("/register", (req, res) => {
  res.render("register");
});

// Affiche la page de confirmation après inscription
router.get("/postRegister", (req, res) => {
  res.render("postRegister");
});

// Dashboard accessible uniquement aux utilisateurs authentifiés
router.get("/dashboard", authMiddleware, (req, res) => {
  res.render("dashboard", { user: req.user });
});

// Déconnexion : efface les cookies et redirige vers le login
router.get("/logout", (req, res) => {
  res.clearCookie("cookies");
  res.clearCookie("token");
  res.redirect("/login");
});

// Redirige vers le profil de l'utilisateur connecté
router.get("/users", authMiddleware, (req, res) => {
  res.redirect(`/users/${req.user.username}`);
});

// Affiche le profil de l'utilisateur spécifié
router.get("/users/:username", authMiddleware, (req, res) => {
  const username = req.params.username;
  const query = "SELECT id, username, role FROM t_users WHERE username = ?";
  connection.query(query, [username], (err, results) => {
    if (err) {
      console.error("Erreur SQL :", err);
      return res.status(500).send("Erreur serveur");
    }
    if (results.length === 0) {
      return res.status(404).send("Utilisateur non trouvé");
    }
    res.render("users", { user: results[0] });
  });
});

// Page admin protégée
router.get("/admin", authMiddleware, adminController.adminPage);

/*********************** ROUTES POST ***********************/

// Inscription
router.post("/register", registerController.registerUser);

// Connexion
router.post("/login", loginController.loginUser);

// Recherche d'utilisateurs depuis la page admin
router.post("/admin", authMiddleware, adminController.searchUsers);

module.exports = router;
