const express = require("express");
const router = express.Router();
const registerController = require("../controllers/registerController");
const loginController = require("../controllers/loginController");
/* const db = require(".db/connectionDb");*/

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

// Route GET pour afficher la page de connexion réussie
router.get("/postLogin", (req, res) => {
  res.render("postLogin", { username: "Utilisateur" }); // Valeur par défaut si l'accès est direct
});
/*********************** ROUTES POST ***********************/

// Route POST pour l'inscription
router.post("/register", registerController.registerUser);

// Route POST pour la connexion
router.post("/login", loginController.loginUser);

module.exports = router;
