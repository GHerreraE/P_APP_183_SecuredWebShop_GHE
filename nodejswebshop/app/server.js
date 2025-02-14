const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/User");
require("./db/createTable");

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

// charge uniquement userRoutes sous "/"
app.use("/", userRoutes);

app.listen(8080, () => {
  console.log("Server running on port 8080");
});
