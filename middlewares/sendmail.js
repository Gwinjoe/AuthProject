const nodemailer = require("nodemailer");

exports.transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_CODE_SENDING_EMAIL_ADDRESS,
    pass: process.env.NODEMAILER_CODE_SENDING_PASSWORD,
  }
})
