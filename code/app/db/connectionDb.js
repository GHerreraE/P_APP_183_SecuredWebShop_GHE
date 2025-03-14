const mysql = require("mysql2");

// Crée une connexion à la base de données avec les informations de configuration
const connection = mysql.createConnection({
  host: "db_container",
  user: "root",
  password: "root",
  port: 3306,
  database: "db_webshop",
});

// Tente de se connecter à MySQL
connection.connect((err) => {
  if (err) {
    console.error("Erreur de connexion à MySQL :", err.stack);
    return;
  }
  console.log(
    "Connecté à la base de données MySQL ! -> Prêt pour les requêtes"
  );
});

// Exportation de la connexion pour l'utiliser dans d'autres fichiers
module.exports = connection;
