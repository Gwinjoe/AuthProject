const { signup, signin, signout, sendVerificationCode, verifyVerificationCode, verifyForgotPasswordcode, changePassword, sendForgotPasswordCode } = require("../controllers/authController");
const express = require("express");

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/signout", identifier, signout);
router.patch("/send-verification-code", identifier, sendVerificationCode);
router.patch("/verify-verification-code", identifier, verifyVerificationCode)
router.patch("/send-forgot-password-code", sendForgotPasswordCode)
router.patch("/verify-forgot-password-code", verifyForgotPasswordcode)
router.patch("/change-password", identifier, changePassword);

module.exports = router;

