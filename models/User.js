const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    // username: {
    //     type: String,
    //     required: true
    // },
    email: {
        type: String,
        required: true,
        index: true, 
        unique: true
    },
    // password: {
    //     type: String,
    //     required: true
    // },
    // profilepic: {
    //     type: String,
    //     default: ''
    // },
    // posts: {
    //     type: Array,
    //     default: []
    // }
})

// userSchema.pre('sa')

mongoose.model("User", userSchema);