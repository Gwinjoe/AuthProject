const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
    email: {
        required: [true, "email is required"],
        type: String,
        trim: true,
        unique: [true, "email must be unique"],
        minLength: [5, "email must be more than 5 characters"],
        lowercase: true,
    },
    password: {
        required: [true, "Password is required"],
        select: false,
        trim: true,
        type: String,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    verificationCode: {
        type: String,
        select: false,
    },
    verificationCodeValidation: {
        type: Number,
        select: false,
    },
    forgotPasswordCode: {
        type: String,
        select: false,
    },
    forgotPasswordCodeValidation: {
        type: Number,
        select: false,
    }
}, {
        timestamps: true,
    })

module.exports = mongoose.model("User", userSchema);
