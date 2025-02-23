const {signupSchema, signinSchema} = require("../middlewares/validator")
const User = require("../models/userModel");
const {dohash} = require("../utils/hashing");

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


exports.signin = (req, res) => {
    const {email, password} = req.body;

    try {
        const {error, value} = signinSchema.validate({email, password})
                if (error) {
            return res.status(401).json({success: false, message: error.details[0].message})
        }

        const existingUser = await User.findOne({email})

        if (!existingUser) {
            return res.status(401).json({success: false, message: "Invalid credentials"})
        }
        
        const hashedPassword = await dohash(password, 12);

         const  newUser = await new User({
            email,
            password: hashedPassword,
        })

        const result = await newUser.save();
        result.password = undefined;
        res.status(201).json({success: true, message: "Your Account has been created successfuly", result})
 
    } catch (err) {
        console.error(err)
    }
}
