const { errorMessage } = require("../utils/responseUtil");
const jwt = require("jsonwebtoken");
const {User} = require('../models');
const {JWT_SECRET} = require("../config/environment")

/**
 *  Verify User token
 * */ 
const verifyToken = async (token)=>{
    if(!token){
        throw new Error("token is required");
    }
    let {user} = jwt.verify(token, JWT_SECRET);
    user = await User.findById(user._id);
    if (!user) {
        throw new Error("User does not exist");
    }
    return user;
}

module.exports = {
    verifyToken,
}
