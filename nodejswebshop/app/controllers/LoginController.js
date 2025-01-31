module.exports = {
  checkLogin: (req, res) => {
    console.log("Utilisateur identifié");
  },
  get: (req, res) => {
    res.render("login", { name: "Gonzalo" });
  },
};
