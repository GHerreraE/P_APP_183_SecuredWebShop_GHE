const mysql = require("mysql2");
const crypto = require("crypto");

// Connexion à la base de données
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
    return;
  }
  console.log("Connecté à la base de données pour l'authentification !");
});

// Fonction pour enregistrer un utilisateur
function registerUser(username, salt, hash, callback) {
  const sql = "INSERT INTO t_users (username, sel, hash) VALUES (?, ?, ?)";

  dbConnection.query(sql, [username, salt, hash], (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(null, result.insertId);
  });
}

module.exports = { registerUser };
