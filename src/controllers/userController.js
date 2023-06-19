const { User } = require("../models");
const { isMongoId } = require("../utils/mongoUtil");
const { successMessage, errorMessage } = require("../utils/responseUtil");

/**
 *  Auth Token Required
 * */ 
module.exports.getUser = async(req,res)=>{
    try{
        const {_id : userId} = req.user;
        if(!userId){
            throw new Error("userId is required");
        }
        if(!isMongoId(userId)){
            throw new Error("Invalid userId");
        }
        let result = await User.findById(userId);
        if(!result){
            throw new Error("User does not exist");
        }
        return res.json(successMessage({data : result}));
    }catch(e){
        console.error("getUser Error : ", e);
        return res.status(400).json(errorMessage(e.message || e));
    }
}

module.exports.getUserById = async(req,res)=>{
    try{
        const {userId} = req.params;
        if(!userId){
            throw new Error("userId is required");
        }
        if(!isMongoId(userId)){
            throw new Error("Invalid userId");
        }
        let result = await User.findById(userId);
        if(!result){
            throw new Error("User does not exist");
        }
        return res.json(successMessage({data : result}));
    }catch(e){
        console.error("getUser Error : ", e);
        return res.status(400).json(errorMessage(e.message || e));
    }
}


module.exports.updateUser = async(req,res) =>{
    try{
        const {id, name, email, phone} = req.body;
        if(!id){
            throw new Error("userId is required");
        }
        if(!isMongoId(id)){
            throw new Error("Invalid userId");
        }let result = await User.findByIdAndUpdate(id,{
            name,
            email,
            phone
        },{runValidators : true, new : true});
        
        if(!result){
            throw new Error("User does not exist");
        }
        return res.json(successMessage({
            message : "User updated successfully",
            data : result
        }));
    }catch(e){
        console.error("updateUser Error : ", e);
        return res.json(errorMessage(e.message || e));
    }
}


module.exports.deleteUser = async(req,res) =>{
    try{
        const {userId} = req.params;
        if(!userId){
            throw new Error("userId is required");
        }
        if(!isMongoId(userId)){
            throw new Error("Invalid userId");
        }

        let result = await User.findByIdAndDelete(userId);
        if(!result){
            throw new Error("User does not exist");
        }

        return res.json(successMessage({
            message : "User deleted successfully",
            data : result
        }));
    }catch(e){
        console.error("deleteUser Error : ", e);
        return res.json(errorMessage(e.message || e));
    }
}