const { errorMessage } = require("../utils/responseUtils");
const jwt = require("jsonwebtoken");
const {User, Driver} = require('../models');
const {JWT_SECRET} = require("../config/environment")

/**
 *  Verify User token
 * */ 
module.exports.userAuth = async(req,res,next)=>{
    try{
        const token = req.headers.authorization;
        if(!token){
            throw new Error("token is required");
        }
        let {user} = jwt.verify(token, JWT_SECRET);
        user = await User.findById(user._id);
		if (!user) {
			throw new Error("User does not exist");
		}
        // token verified successfully
        req.user = user;
        next();
    }catch(err){
        return res.status(400).json(errorMessage("Authentication Error : "+err.message || err))
    }
}