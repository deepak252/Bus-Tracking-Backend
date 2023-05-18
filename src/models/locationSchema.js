const mongoose = require("mongoose");

const locationSchema = mongoose.Schema({
    latitude : {
        type : Number,
        required : [true,"Latitude is required"],
    },
    longitude : {
        type : Number,
        required : [true,"Longitude is required"],
    },
    address : String
})

module.exports = locationSchema;