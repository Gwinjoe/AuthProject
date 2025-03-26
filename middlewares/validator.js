const Joi = require("joi");

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d@$!%*?&]{8,}$/

exports.signupSchema = Joi.object({
  email: Joi.string().min(6).max(60).required().email({ tlds: ["com", "net"] }),
  password: Joi.string().required().pattern(new RegExp(passwordRegex)),
})

exports.signinSchema = Joi.object({
  email: Joi.string().min(6).max(60).required().email({ tlds: ["com", "net"] }),
  password: Joi.string().required().pattern(new RegExp(passwordRegex)),
})

exports.emailSchema = Joi.object({
  email: Joi.string().min(6).max(60).required().email({ tlds: ["com", "net"] })
});
