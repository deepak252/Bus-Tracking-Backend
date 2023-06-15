const mongoose = require("mongoose");
const { days, regex } = require("../config/constants");

const busStopSchemaForRoute = mongoose.Schema({
    stop : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "BusStop"
    },
    duration : {
        type : Number,
        required : [true, "Duration is required"]
    }  // Previous stop to current stop
});

const scheduleSchema = mongoose.Schema({
    day : {
        type: String,
        enum: days,
        default: days[0]
    },
    departureTime : [
        {
            type : String,
            match : [regex.militaryTime, "Time must be in 24-hour clock format"]
        }
    ]
});

const routeSchema = new mongoose.Schema({
    routeNo : {  //eg. 901_UP, 901_DOWN
        type : String, 
        required : [true,"Route number is required"],
        unique : true
    },
    name : {
        type : String, // eg. Uttam Nagar Terminal
        required : [true,"Route name is required"],
    },
    stops : [busStopSchemaForRoute],
    schedule : [scheduleSchema],
    rating : {
        type : Number,
        default : 0
    },
},{
    timestamps : true
});

module.exports = mongoose.model("BusRoute", routeSchema);