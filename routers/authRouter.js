const {signup, signin, signout}= require("../controllers/authController");
const express = require("express");

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/signout", signout);

module.exports = router;

