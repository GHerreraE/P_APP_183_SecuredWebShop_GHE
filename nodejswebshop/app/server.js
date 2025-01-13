const express = require("express");

const app = express();

const userRoute = require("./routes/User");
const homeRoute = require("./routes/accueil");

app.use("/user", userRoute);
app.use("/accueil", homeRoute);

// Démarrage du serveur
app.listen(8080, () => {
  console.log("Server running on port 8080");
});
