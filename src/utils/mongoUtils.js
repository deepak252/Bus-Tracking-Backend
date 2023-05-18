const mongoose = require("mongoose");

module.exports.isMongoId = (val) =>{
    return val && mongoose.Types.ObjectId.isValid(val)
}