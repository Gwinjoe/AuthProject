const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, "A title for the post is required"],
        trim: true,
    },
   description: {
        type: String,
        required: [true, "A description for the post is required"],
        trim: true,
    }, 
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }, 


}, {
        timestamps: true,
    })

module.exports = mongoose.model("Posts", postSchema)
