const crypto = require("crypto");
const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "db_container",
  user: "root",
  password: "root",
  port: 3306,
});

connection.connect((err) => {
  if (err) {
    console.error("Erreur de connexion à MySQL:", err.stack);
    return;
  }
  console.log("Connecté à MySQL -> Vérification de la base de données...");

  connection.query("CREATE DATABASE IF NOT EXISTS db_webshop", (err) => {
    if (err) {
      console.error("Erreur lors de la création de la base de données:", err);
      return;
    }
    console.log("Base de données 'db_webshop' prête");

    const dbConnection = mysql.createConnection({
      host: "db_container",
      user: "root",
      password: "root",
      port: 3306,
      database: "db_webshop",
    });

    dbConnection.connect((err) => {
      if (err) {
        console.error("Erreur de connexion à MySQL (avec la DB) :", err.stack);
        return;
      }
      console.log(
        "Connecté à 'db_webshop' -> Prêt à créer la table et utilisateurs"
      );

      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS t_users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(255) UNIQUE NOT NULL,
          role VARCHAR(10) NOT NULL,
          hash VARCHAR(255) UNIQUE NOT NULL,
          sel VARCHAR(255) NOT NULL
        );
      `;

      dbConnection.query(createTableQuery, (err) => {
        if (err) {
          console.error("Erreur lors de la création de la table :", err);
        } else {
          console.log("Table 't_users' prête");

          const createUserIfNotExists = (username, role, password) => {
            const checkUserQuery = "SELECT * FROM t_users WHERE username = ?";

            dbConnection.query(checkUserQuery, [username], (err, results) => {
              if (err) {
                console.error(
                  `Erreur lors de la vérification de l'utilisateur ${username} :`,
                  err
                );
                return;
              }

              if (results.length > 0) {
                console.log(`L'utilisateur '${username}' existe déjà.`);
                return;
              }

              const salt = crypto.randomBytes(8).toString("hex");
              const hash = crypto
                .createHash("sha256")
                .update(password + salt)
                .digest("hex");

              const insertQuery = `INSERT INTO t_users (username, role, hash, sel) VALUES (?, ?, ?, ?)`;
              dbConnection.query(
                insertQuery,
                [username, role, hash, salt],
                (err) => {
                  if (err) {
                    console.error(
                      `Erreur lors de l'insertion de l'utilisateur ${username} :`,
                      err
                    );
                  } else {
                    console.log(`Utilisateur '${username}' créé avec succès.`);
                  }
                }
              );
            });
          };

          createUserIfNotExists("admin", "admin", "admin");
          createUserIfNotExists("user", "user", "user");
        }
      });
    });
  });
});
