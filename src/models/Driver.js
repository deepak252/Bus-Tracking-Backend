const mongoose = require("mongoose");
const { regex } = require("../config/constants");

const driverSchema = new mongoose.Schema({
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
},{
    timestamps : true
});

module.exports = mongoose.model("Driver", driverSchema);