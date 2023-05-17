const mongoose = require("mongoose");
const { busStatuses, busTypes } = require("../config/constants");

const busSchema = new mongoose.Schema({
    vehNo : {
        type : String, 
        required : [true,"Vehicle number is required"],
        unique : true
    },
    info : {
        busType : {
            type : String,
            enum : busTypes,
            default: busStatuses[0]
        },
    },
    status : {
        type: String,
        enum: busStatuses,
        default: busStatuses[0]
    },
    route : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "BusRoute"
    },
    location : {
        latitue : Number,
        longitude : Number,
        address : String
    },
    rating : Number,
},{
    timestamps : true
});

module.exports = mongoose.model("Bus", busSchema);