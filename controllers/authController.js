const {signupSchema, signinSchema} = require("../middlewares/validator")
const User = require("../models/userModel");
const {dohash, dohashValidation} = require("../utils/hashing");
const jwt = require("jsonwebtoken")

exports.signup = async (req, res) => {
    const {email,password} = req.body;
       try {
        const {error, value} = signupSchema.validate({email, password});

        if (error) {
            return res.status(401).json({success: false, message: error.details[0].message})
        }

        const existingUser = await User.findOne({email})

        if (existingUser) {
            return res.status(401).json({success: false, message: "User already exists!"})
        }
        
        const hashedPassword = await dohash(password, 12);

         const  newUser = await new User({
            email,
            password: hashedPassword,
        })

        const result = await newUser.save();
        result.password = undefined;
        res.status(201).json({success: true, message: "Your Account has been created successfuly", result})
       } catch (error) {
         console.log(error)
       } 
}


exports.signin = async (req, res) => {
    const {email, password} = req.body;

    try {
        const {result, error} = signinSchema.validate({email, password});
        if (error) {
            return res.status(401).json({
                success: false,
                message: error.details[0].message,
            })
        }

        const existingUser = await User.findOne({email}).select("+password");

        if (!existingUser) {
            return res.status(401).json({
                success: false,
                message: "User does not exist!"
            })
        }

       const validPassword = await dohashValidation(password, existingUser.password);

        if (!validPassword) {
            return res.status(401).json({
                success:false,
                message: "Invalid credentials",
            })
        }

        const token = jwt.sign({
            id: existingUser._id,
            email: existingUser.email,
            verified: existingUser.verified,

        }, process.env.JWT_SECRET, {expiresIn: '8h'});

        res.cookie('Authorization', 'Bearer ' + token, {expires: new Date(Date.now() + 8 * 3600000), httpOnly: process.env.NODE_ENV === "production", secure: process.env.NODE_ENV === "production"}).json({
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
