const { signup, signin, signout, sendVerificationCode } = require("../controllers/authController");
const express = require("express");

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/signout", signout);
router.patch("/send-verification-code", sendVerificationCode);

module.exports = router;

