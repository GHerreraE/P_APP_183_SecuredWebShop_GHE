const mysql = require("mysql2");
const crypto = require("crypto");

// Création de la connexion à MySQL
const connection = mysql.createConnection({
  host: "db_container",
  user: "root",
  password: "root",
  port: 3306,
  database: "db_webshop",
});

// Connexion à la base de données
connection.connect((err) => {
  if (err) {
    console.error("Erreur de connexion à MySQL:", err.stack);
    return;
  }
  console.log("Connecté à la base de données MySQL");
});

// Création de la table t_users si elle n'existe pas
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS t_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(10) NOT NULL,
    hash VARCHAR(255) UNIQUE NOT NULL,
    sel VARCHAR(255) NOT NULL
  );
`;

connection.query(createTableQuery, (err) => {
  if (err) {
    console.error("Erreur lors de la création de la table :", err);
  } else {
    console.log("Table 't_users' prête");

    // Utilisation de l'encryptage du contrôleur registerUser
    const adminPassword = "admin";
    // Générer un sel aléatoire de 8 octets (16 caractères hexadécimaux)
    const salt = crypto.randomBytes(8).toString("hex");
    // Hacher le mot de passe avec SHA-256 en ajoutant le sel
    const hash = crypto
      .createHash("sha256")
      .update(adminPassword + salt)
      .digest("hex");

    // Insertion de l'utilisateur admin
    const insertQuery = `
      INSERT INTO t_users (username, role, hash, sel)
      VALUES (?, ?, ?, ?)
    `;
    connection.query(insertQuery, ["admin", "admin", hash, salt], (err) => {
      if (err) {
        console.error(
          "Erreur lors de l'insertion de l'utilisateur admin :",
          err
        );
      } else {
        console.log("Utilisateur admin créé avec succès.");
      }
    });
  }
});

// Export de la connexion pour utilisation ailleurs (optionnel)
module.exports = connection;
