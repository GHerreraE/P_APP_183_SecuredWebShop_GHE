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

  connection.query("CREATE DATABASE IF NOT EXISTS db_webshop", (err) => {
    if (err) {
      console.error(
        "Erreur lors de la création de la base de données :",
        err.message
      );
      connection.end();
      return;
    }
    console.log(
      "Base de données 'db_webshop' créée avec succès (ou déjà existante) !"
    );

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

      dbConnection.query(createTableQuery, (err) => {
        if (err) {
          console.error(
            "Erreur lors de la création de la table t_users :",
            err.message
          );
          dbConnection.end();
          return;
        }
        console.log("Table 't_users' créée avec succès (ou déjà existante) !");

        // Fermeture de la connexion
        dbConnection.end(() => console.log("Connexion fermée."));
      });
    });
  });
});
