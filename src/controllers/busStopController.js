const { getStopByStopNo, removeStopFromAllRoutes, removeRouteFromAllStops } = require("../helper/busStopRouteHelper");
const { BusStop } = require("../models");
const { errorMessage, successMessage } = require("../utils/responseUtils");

module.exports.createBusStop = async(req,res) =>{
    try{
        const {stopNo, name,  location} = req.body;
        let busStop = new BusStop({
            stopNo,
            name,
            location
        });
        let error = busStop.validateSync();
        if(error){
            throw error;
        }
        busStop = await busStop.save();
        return res.json(successMessage({
            message : "Bus Stop created successfully",
            data : busStop
        }));
    }catch(e){
        console.error("createBusStop Error : ", e);
        if(e.code===11000){
            //duplicate key error, unique value
            return res.status(400).json(errorMessage("Bus Stop already exists with given stopNo"));
        }
        return res.status(400).json(errorMessage(e.message || e));
    }
}


module.exports.getBusStop = async(req,res) =>{
    try{
        const {stopNo} = req.query;
        let result = await getStopByStopNo(stopNo, true)
        return res.json(successMessage({data : result}));
    }catch(e){
        console.error("getBusStop Error : ", e);
        return res.json(errorMessage(e.message || e));
    }
}

module.exports.getAllBusStops = async(req,res) =>{
    try{
        let result = await BusStop.find().populate("routes");
        return res.json(successMessage({data : result}));
    }catch(e){
        console.error("getAllBusStops Error : ", e);
        return res.json(errorMessage(e.message || e));
    }
}

// Get all bus stops in the radius of 2 km
module.exports.getNearbyBusStops = async(req,res) =>{
    try{
        const {lat, lng} = req.query;
        if(!lat||!lng){
            throw "lat & lng are required!"
        }
        if(isNaN(lat) || isNaN(lng)){
            throw "Invalid lat or lng"
        }
        const result = await BusStop.find({
            location: {
                $geoWithin: {
                    $centerSphere: [[lat, lng], 5 / 6378.1], // Convert radius to radians (Earth's radius in kilometers is approximately 6378.1)
                },
            },
        }).populate("routes");
        return res.json(successMessage({data : result}));
    }catch(e){
        console.error("getNearbyBusStops Error : ", e);
        return res.json(errorMessage(e.message || e));
    }
}

module.exports.updateBusStop = async(req,res) =>{
    try{
        const {stopNo, name, location} = req.body;
        if(!stopNo){
            throw new Error("Stop number is required");
        }
        console.log({
            stopNo,
            name,
            location
        });
        let result = await BusStop.findOneAndUpdate({stopNo},{
            stopNo,
            name,
            location
        },{runValidators : true, new : true});
        if(!result){
            throw new Error(`No Bus Stop found with stopNo : ${stopNo}`);
        }
        return res.json(successMessage({
            message : "Bus Stop updated successfully",
            data : result
        }));
    }catch(e){
        console.error("updateBusStop Error : ", e);
        if(e.code===11000){
            //duplicate key error, unique value
            return res.status(400).json(errorMessage("Bus Stop already exists with given stopNo"));
        }
        return res.json(errorMessage(e.message || e));
    }
}


module.exports.deleteBusStop = async(req,res) =>{
    try{
        const {stopNo} = req.query;
        let result  = await removeStopFromAllRoutes(stopNo, true);

        return res.json(successMessage({
            message : "Bus Stop deleted successfully",
            data : result
        }));
    }catch(e){
        console.error("deleteBusStop Error : ", e);
        return res.json(errorMessage(e.message || e));
    }
}

module.exports.removeBusRouteFromAllStops = async(req,res) =>{
    try{
        const {routeNo} = req.body;
        let result = await removeRouteFromAllStops(routeNo);
        return res.json(successMessage({data : result}));
    }catch(e){
        console.error("removeBusStopFromRoute Error : ", e);
        return res.json(errorMessage(e.message || e));
    }
}