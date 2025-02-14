const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const userController = require("../controllers/UserController");
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

/*********************** ROUTES POST ***********************/

// Route POST pour l'inscription
router.post("/register", userController.registerUser);

module.exports = router;
