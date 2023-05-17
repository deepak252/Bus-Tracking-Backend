const mongoose = require("mongoose");
const { days } = require("../config/constants");

const routeSchema = new mongoose.Schema({
    routeId : {  //eg. 901_UP, 901_DOWN
        type : String, 
        required : [true,"Bus Route Id is required"],
        unique : true
    },
    name : {
        type : String, // eg. Uttam Nagar Terminal
        required : [true,"Bus Route name is required"],
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
                    match : [/^(?:[01]\d|2[0-3]):[0-5]\d$/, "Time must be in 24-hour clock format"]
                }
            ]
        }
    ],

    rating : Number,

},{
    timestamps : true
});

module.exports = mongoose.model("BusRoute", routeSchema);