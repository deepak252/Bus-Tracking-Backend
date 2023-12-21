const { Driver } = require("../models");
const { isMongoId } = require("../utils/mongoUtil");
const { successMessage, errorMessage } = require("../utils/responseUtil");

module.exports.getDriver = async(req,res)=>{
    try{
        const {driverId} = req.params;
        if(!driverId){
            throw new Error("driverId is required");
        }
        if(!isMongoId(driverId)){
            throw new Error("Invalid driverId");
        }
        let result = await Driver.findById(driverId);
        if(!result){
            throw new Error("Driver does not exist");
        }
        return res.json(successMessage({data : result}));
    }catch(e){
        console.error("getDriver Error : ", e);
        return res.status(400).json(errorMessage(e.message || e));
    }
}


module.exports.updateDriver = async(req,res) =>{
    try{
        const {id, name, email, phone} = req.body;
        if(!id){
            throw new Error("driverId is required");
        }
        if(!isMongoId(id)){
            throw new Error("Invalid driverId");
        }let result = await Driver.findByIdAndUpdate(id,{
            name,
            email,
            phone
        },{runValidators : true, new : true});
        
        if(!result){
            throw new Error("Driver does not exist");
        }
        return res.json(successMessage({
            message : "Driver updated successfully",
            data : result
        }));
    }catch(e){
        console.error("updateDriver Error : ", e);
        return res.json(errorMessage(e.message || e));
    }
}


module.exports.deleteDriver = async(req,res) =>{
    try{
        const {driverId} = req.params;
        if(!driverId){
            throw new Error("driverId is required");
        }
        if(!isMongoId(driverId)){
            throw new Error("Invalid driverId");
        }

        let result = await Driver.findByIdAndDelete(driverId);
        if(!result){
            throw new Error("Driver does not exist");
        }

        return res.json(successMessage({
            message : "Driver deleted successfully",
            data : result
        }));
    }catch(e){
        console.error("deleteDriver Error : ", e);
        return res.json(errorMessage(e.message || e));
    }
}