const authController = require("../controllers/authController");
const express = require("express");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/signin", authController.signin)

module.exports = router;

