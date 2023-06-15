const mongoose = require("mongoose");

const locationSchema = mongoose.Schema({
    lat : {
        type : Number,
        required : [true,"Latitude is required"],
    },
    lng : {
        type : Number,
        required : [true,"Longitude is required"],
    },
    address : String
});

module.exports = locationSchema;