const mongoose = require("mongoose");

const stopSchema = new mongoose.Schema({
    stopId : {
        type : String, 
        required : [true,"Bus Stop Id is required"],
        unique : true
    },
    name : {
        type : String,
        required : [true,"Bus Stop name is required"],
    },
    rating : {
        type : Number,
        default : 0
    },
    routes : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "BusRoute"
        }
    ],
    location : {
        latitue : Number,
        longitude : Number,
        address : String
    }
},{
    timestamps : true
});

module.exports = mongoose.model("BusStop", stopSchema);