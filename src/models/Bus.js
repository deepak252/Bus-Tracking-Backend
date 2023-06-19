const mongoose = require("mongoose");
const { busStatuses, busTypes } = require("../config/constants");
const { isMongoId } = require("../utils/mongoUtil");
const locationSchema = require("./locationSchema");

const busInfoSchema = new mongoose.Schema({
    busType : {
        type : String,
        enum : busTypes,
        default: busTypes[0]
    }
})

const busSchema = new mongoose.Schema({
    vehNo : {
        type : String, 
        required : [true,"Vehicle number is required"],
        unique : true
    },
    info : {
        type : busInfoSchema,
        required : true
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
    driver : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Driver"
    },
    location : {
        type : locationSchema,
    }
},{
    timestamps : true
});

module.exports = mongoose.model("Bus", busSchema);