const express = require("express");
const controller = require("../controllers/loginController");

const router = express.Router();

router.get("/login", controller.get);
router.post("/login", controller.checkLogin);
module.exports = router;
