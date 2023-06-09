const { getBusByVehNo, getAllBusesForStop, getAllBusesForRoute } = require("../helper/busStopRouteHelper");
const { Bus } = require("../models");
const { successMessage, errorMessage } = require("../utils/responseUtils");

module.exports.createBus = async(req,res)=>{
    try{
        const {vehNo, info, route, status, location} = req.body;
        let bus = new Bus({
            vehNo,
            info,
            route, // Mongoose Object Id
            status,
            location
        });
        const error = bus.validateSync();
        if(error){
            throw error;
        }
        bus = await bus.save();
        return res.json(successMessage({
            message : "Bus created successfully",
            data : bus
        }));
    }catch(e){
        console.error("createBus Error : ", e);
        if(e.code===11000){
            //duplicate key error, unique value
            return res.status(400).json(errorMessage("Bus already exists with given vehNo"));
        }
        return res.status(400).json(errorMessage(e.message || e));
    }
}

module.exports.getBusByVehicleNo = async(req,res)=>{
    try{
        const {vehNo} = req.query;
        let result = await getBusByVehNo(vehNo,true);
        return res.json(successMessage({data : result}));
    }catch(e){
        console.error("getBusByVehicleNo Error : ", e);
        return res.status(400).json(errorMessage(e.message || e));
    }
}


module.exports.updateBus = async(req,res) =>{
    try{
        const {vehNo, info, route, status,location} = req.body;
        if(!vehNo){
            throw new Error("Vehicle number is required");
        }
        let result = await Bus.findOneAndUpdate({vehNo},{
            vehNo,
            info,
            route, // Mongoose Object Id
            status,
            location
        },{runValidators : true, new : true});
        if(!result){
            throw new Error("No Bus found with given vehNo");
        }
        return res.json(successMessage({
            message : "Bus updated successfully",
            data : result
        }));
    }catch(e){
        console.error("updateBus Error : ", e);
        if(e.code===11000){
            //duplicate key error, unique value
            return res.status(400).json(errorMessage("Bus already exists with given vehNo"));
        }
        return res.json(errorMessage(e.message || e));
    }
}

module.exports.deleteBus = async(req,res) =>{
    try{
        const {vehNo} = req.query;
        if(!vehNo){
            throw new Error("Vehicle number is required");
        }
        let result = await Bus.findOneAndDelete({vehNo});
        if(!result){
            throw new Error("No Bus found with given vehNo");
        }
        return res.json(successMessage({
            message : "Bus deleted successfully",
            data : result
        }));
    }catch(e){
        console.error("deleteBus Error : ", e);
        return res.json(errorMessage(e.message || e));
    }
}

module.exports.getAllBuses = async(req,res) =>{
    try{
        const result = await Bus.find().populate('route');
        return res.json(successMessage({data : result}));
    }catch(e){
        console.error("getAllBuses Error : ", e);
        return res.json(errorMessage(e.message || e));
    }
}


// Get all buses in the radius of 2 km
module.exports.getNearbyBuses = async(req,res) =>{
    try{
        const {lat, lng} = req.query;
        if(!lat||!lng){
            throw "lat & lng are required!"
        }
        if(isNaN(lat) || isNaN(lng)){
            throw "Invalid lat or lng"
        }
        const result = await Bus.find({
            route : {$ne : null},
            location: {
                $geoWithin: {
                    $centerSphere: [[lat, lng], 2 / 6378.1], // Convert radius to radians (Earth's radius in kilometers is approximately 6378.1)
                },
            },
        }).populate('route');
        return res.json(successMessage({data : result}));
    }catch(e){
        console.error("getNearbyBuses Error : ", e);
        return res.json(errorMessage(e.message || e));
    }
}


module.exports.getAllBusesForBusStop = async(req,res) =>{
    try{
        const {stopNo} = req.query;
        let result = await getAllBusesForStop(stopNo)
        return res.json(successMessage({data : result}));
    }catch(e){
        console.error("getAllBusesForBusStop Error : ", e);
        return res.json(errorMessage(e.message || e));
    }
}

module.exports.getAllBusesForBusRoute = async(req,res) =>{
    try{
        const {routeNo} = req.query;
        let result = await getAllBusesForRoute(routeNo)
        return res.json(successMessage({data : result}));
    }catch(e){
        console.error("getAllBusesForBusRoute Error : ", e);
        return res.json(errorMessage(e.message || e));
    }
}

