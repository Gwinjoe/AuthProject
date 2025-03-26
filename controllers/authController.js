const { signupSchema, signinSchema, emailSchema } = require("../middlewares/validator")
const User = require("../models/userModel");
const { dohash, dohashValidation, hmacProcess } = require("../utils/hashing");
const jwt = require("jsonwebtoken")
const { transport } = require("../middlewares/sendmail")

exports.signup = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { error, value } = signupSchema.validate({ email, password });

    if (error) {
      return res.status(401).json({ success: false, message: error.details[0].message })
    }

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(401).json({ success: false, message: "User already exists!" })
    }

    const hashedPassword = await dohash(password, 12);

    const newUser = await new User({
      email,
      password: hashedPassword,
    })

    const result = await newUser.save();
    result.password = undefined;
    res.status(201).json({ success: true, message: "Your Account has been created successfuly", result })
  } catch (error) {
    console.log(error)
  }
}


exports.signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { result, error } = signinSchema.validate({ email, password });
    if (error) {
      return res.status(401).json({
        success: false,
        message: error.details[0].message,
      })
    }

    const existingUser = await User.findOne({ email }).select("+password");

    if (!existingUser) {
      return res.status(401).json({
        success: false,
        message: "User does not exist!"
      })
    }

    // just checking the value of existingUser and seeing what and what are selected by default.
    console.log(existingUser);
    const validPassword = await dohashValidation(password, existingUser.password);

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      })
    }

    const token = jwt.sign({
      id: existingUser._id,
      email: existingUser.email,
      verified: existingUser.verified,

    }, process.env.JWT_SECRET, { expiresIn: '8h' });

    res.cookie('Authorization', 'Bearer ' + token, { expires: new Date(Date.now() + 8 * 3600000), httpOnly: process.env.NODE_ENV === "production", secure: process.env.NODE_ENV === "production" }).json({
      success: true,
      token,
      message: "signin success!"
    });
  } catch (error) {
    console.log(error)
  }
}


exports.signout = async (req, res) => {
  res.clearCookie("Authorization").status(200).json({
    success: true,
    message: "Sign out Successful!"
  })
}


exports.sendVerificationCode = async (req, res) => {
  const { email } = req.body;
  try {
    const { error, value } = emailSchema.validate(email);

    if (error) {
      return res.status(401).json({
        success: false,
        message: error.details[0].message
      })
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(401).json({
        success: false,
        message: "user does not exist!",
      })
    }

    const codeValue = Math.floor(Math.random() * 100000).toString();

    const info = await transport.sendMail({
      from: process.env.NODEMAILER_CODE_SENDING_EMAIL_ADDRESS,
      to: existingUser.email,
      subject: "Email Verification Code",
      html: `<div style="background-color: black; width: 100%; max-width: 300px;>
          <div style="background-color: purple; height: 50px; width: 100%; display: flex; justify-content: center; align-items: center;">
            <p style="color: white;">Powered by Gwin Mail</p>
          </div>
          <div>
            <div style="padding: 10px; border-radius: 5px; background-color: white; opacity: 0.7; border: none;"><h3>${codeValue}</h3></div>
            <div style="color: white;"><p>This is your verification code. Do not share with any other person!</p></div>
          </div>
        </div>`
    })

    if (info.accepted[0] === existingUser.email) {
      const hashedCodeValue = hmacProcess(codeValue, process.env.HMACPROCESSKEY);
      existingUser.verificationCode = hashedCodeValue;
      existingUser.verificationCodeValidation = Date.now();
      await existingUser.save();
      return res.status(200).json({
        success: true,
        message: "Code Sent",
      })
    }
    return res.status(400).json({
      success: false,
      message: "Code not sent, something went wrong!"
    })
  } catch (err) {
    console.error(err)
  }
}
