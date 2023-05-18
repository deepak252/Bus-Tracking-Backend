const mongoose = require("mongoose");
const locationSchema = require("./locationSchema");

const stopSchema = new mongoose.Schema({
    stopNo : {
        type : String, 
        required : [true,"Stop number is required"],
        unique : true
    },
    name : {
        type : String,
        required : [true,"Stop name is required"],
    },
    routes : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "BusRoute"
        }
    ],
    location : {
        type : locationSchema,
        required : [true, "Stop location is required"]
    }
},{
    timestamps : true
});

module.exports = mongoose.model("BusStop", stopSchema);