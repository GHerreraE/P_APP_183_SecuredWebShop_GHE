const express = require("express");
const app = express();
const path = require("path");

// dossier pour les fichiers statiques
app.use(express.static(path.join(__dirname, "public")));

// config du motoeur de template EJS
app.set("view engine", "ejs");

// routes principales
app.get("/login", (req, res) => {
  res.render("login", { name: "Gonzalo" });
});

app.post(".");
app.get("/register", (req, res) => {
  res.render("register");
});

// importation de routes
const userRoute = require("./routes/User");
const homeRoute = require("./routes/accueil");

// routes
app.use("/user", userRoute);
app.use("/accueil", homeRoute);

// Démarrage du serveur
app.listen(8080, () => {
  console.log("Server running on port 8080");
});
