const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "db_container",
  user: "root",
  password: "root",
  port: 3306,
  database: "db_webshop",
});

connection.connect((err) => {
  if (err) {
    console.error("Erreur de connexion à MySQL :", err.stack);
    return;
  }
  console.log(
    "Connecté à la base de données MySQL ! -> Pret pour les requetes"
  );
});

module.exports = connection;
