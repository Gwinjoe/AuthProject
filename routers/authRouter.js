const authController = require("../controllers/authController");
const express = require("express");

const router = express.Router();

router.post("/signup", authController.signup);

module.exports = router;

