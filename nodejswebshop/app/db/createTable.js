const mysql = require("mysql2");

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
  console.log("Connecté à la base de données MySQL !");
});

// Création de la table t_users si elle n'existe pas
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS t_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    hash VARCHAR(255) UNIQUE NOT NULL,
    sel VARCHAR(255) NOT NULL
  );`;

connection.query(createTableQuery, (err) => {
  if (err) {
    console.error("Erreur lors de la création de la table :", err);
  } else {
    console.log("Table 't_users' prête !");
  }
});

// Export de la connexion pour utilisation ailleurs
module.exports = connection;
