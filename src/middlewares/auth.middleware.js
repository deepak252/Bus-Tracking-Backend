const { errorMessage } = require("../utils/responseUtil");
const jwt = require("jsonwebtoken");
const {User, Driver} = require('../models');
const {JWT_SECRET} = require("../config/environment");
const { verifyToken } = require("../helper/authHelper");

/**
 *  Verify User token
 * */ 
module.exports.userAuth = async(req,res,next)=>{
    try{
        const token = req.headers.authorization;
        req.user = await verifyToken(token);
        next();
    }catch(err){
        return res.status(400).json(errorMessage("Authentication Error : "+err.message || err))
    }
}