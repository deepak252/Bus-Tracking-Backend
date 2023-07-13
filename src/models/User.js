const mongoose = require("mongoose");
const { regex, userTypes } = require("../config/constants");

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        trim : true,
        required : [true,"Name is required"],
        maxLength : [50, "Password should not contain more than 50 characters"],
    },
    phone : {
        type : String,
        trim : true,
        required : [true,"Phone number is required"],
        match : [regex.phone, "Invalid phone number"],
        unique : true
    },
    email : {
        type : String,
        trim : true,
        lowercase : true,
        required : [true,"Email is required"],
        match: [regex.email, 'Invalid email'],
        unique : true
    },
    password : {
        type : String,
        trim : true,
        required : [true,"Password is required"]
    },
    userType : {
        type: String,
        enum: userTypes,
        default: userTypes[0]
    },
},{
    timestamps : true
});

module.exports = mongoose.model("User", userSchema);