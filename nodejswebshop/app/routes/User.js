const express = require("express");
const router = express.Router();
const registerController = require("../controllers/registerController");
const loginController = require("../controllers/loginController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminController = require("../controllers/adminController");
const connection = require("../db/connectionDb");

// cookie-parser => packet npm

/*********************** ROUTES GET ***********************/

// route GET pour renvoyer au login
router.get("/", (req, res) => {
  res.redirect("/login");
});

// route GET pour afficher le login
router.get("/login", (req, res) => {
  res.render("login");
});

// route GET pour afficher le register
router.get("/register", (req, res) => {
  res.render("register");
});

// route GET pour afficher la page de confirmation
router.get("/postRegister", (req, res) => {
  res.render("postRegister");
});

// Route protégée : Affiche le dashboard uniquement si l'utilisateur est connecté
router.get("/dashboard", authMiddleware, (req, res) => {
  res.render("dashboard", { user: req.user });
});

router.get("/logout", (req, res) => {
  res.clearCookie("cookies");
  res.clearCookie("token");
  res.redirect("/login");
});

// Route protégée : Affiche les détails de l'utilisateur connecté
router.get("/users", authMiddleware, (req, res) => {
  res.redirect(`/users/${req.user.username}`);
});

// Route protégée : Affiche le profil de l'utilisateur connecté
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

router.get("/admin", authMiddleware, adminController.adminPage);

/*********************** ROUTES POST ***********************/

// Route POST pour l'inscription
router.post("/register", registerController.registerUser);

// Route POST pour la connexion
router.post("/login", loginController.loginUser);

// Route POST pour l'admin page
router.post("/admin", authMiddleware, adminController.searchUsers);
module.exports = router;
