const express = require("express");
const router = express.Router();
const registerController = require("../controllers/registerController");
const loginController = require("../controllers/loginController");
const authMiddleware = require("../middlewares/authMiddleware");

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
  res.render("dashboard", { username: req.user.username });
});
/*********************** ROUTES POST ***********************/

// Route POST pour l'inscription
router.post("/register", registerController.registerUser);

// Route POST pour la connexion
router.post("/login", loginController.loginUser);

module.exports = router;
