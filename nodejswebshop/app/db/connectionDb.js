const mysql = require("mysql2");

// Configuration de la connexion MySQL
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
    console.error("Erreur de connexion à MySQL :", err.stack);
    return;
  }
  console.log("Connecté à la base de données MySQL !");
});

// Export de la connexion pour l’utiliser ailleurs
module.exports = connection;
