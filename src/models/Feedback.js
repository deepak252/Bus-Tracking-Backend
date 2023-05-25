const mongoose = require("mongoose");

const routeFeedbackSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    route : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "BusRoute"
    },
    driver : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Driver"
    },
    rating : {
        type : Number,
        min : 1,
        max : 5,
        required : [true, "Rating value is required"]
    },
    text : {
        type : String,
        maxLength : 500
    }
},{
    timestamps : true
});

module.exports = mongoose.model("RouteFeedback", routeFeedbackSchema);