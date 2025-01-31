const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");
app.use(bodyParser.json());

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

//////////////////////////////////////////////// DATABASE CONNECTION  ////////////////////////////////////////////
const mysql = require("mysql2");

// Création de la connexion à MySQL
const connection = mysql.createConnection({
  host: "db",
  port: 3306,
  user: "root",
  password: "root",
});

connection.connect((err) => {
  if (err) {
    console.error("Erreur de connexion à MySQL:", err.message);
    return;
  }
  console.log("Connecté à MySQL !");

  // Connexion à la base de données créée
  const dbConnection = mysql.createConnection({
    host: "db",
    port: 3306,
    user: "root",
    password: "root",
    database: "db_webshop",
  });

  dbConnection.connect((err) => {
    if (err) {
      console.error("Erreur de connexion à la base de données:", err.message);
      dbConnection.end();
      return;
    }
    console.log("Connecté à la base de données 'db_webshop' !");

    /*
      // Création de la table t_users
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS t_users (
          id INT NOT NULL AUTO_INCREMENT,
          username VARCHAR(50) NOT NULL,
          sel VARCHAR(20) NOT NULL,
          hash VARCHAR(255) NOT NULL,
          PRIMARY KEY (id),
          UNIQUE KEY username (username)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
      `;
      */

    /*dbConnection.query(createTableQuery, (err) => {
      if (err) {
        console.error(
          "Erreur lors de la création de la table t_users :",
          err.message
        );
        dbConnection.end();
        return;
      }
      console.log("Table 't_users' créée avec succès (ou déjà existante) !");
      */
    // Fermeture de la connexion

    // Route pour enregistrer un utilisateur
    app.post("/register", (req, res) => {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: "Tous les champs sont requis" });
      }

      const sql = "INSERT INTO users (username, password) VALUES (?, ?)";
      db.query(sql, [username, password], (err, result) => {
        if (err) {
          console.error("Erreur lors de l'insertion: " + err.message);
          return res.status(500).json({ error: "Erreur serveur" });
        }
        res.status(201).json({
          message: "Utilisateur enregistré avec succès",
          userId: result.insertId,
        });
      });
    });

    // Lancer le serveur
    const PORT = 3000;
    app.listen(PORT, () => {
      console.log(`Serveur démarré sur http://localhost:${PORT}`);
    });
  });
});
