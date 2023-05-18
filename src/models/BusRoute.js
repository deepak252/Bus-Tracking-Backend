const mongoose = require("mongoose");
const { days, regex } = require("../config/constants");

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
    stops : [
        {
            stop : {
                type : mongoose.Schema.Types.ObjectId,
                ref : "BusStop"
            },
            duration : Number  // Previous stop to current stop
        }
    ],
    timings : [
        {
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
        }
    ],
    rating : {
        type : Number,
        default : 0
    },
},{
    timestamps : true
});

module.exports = mongoose.model("BusRoute", routeSchema);