const { getRouteByRouteNo, addStopToRoute, removeStopFromRoute, removeStopFromAllRoutes, removeRouteFromAllStops } = require("../helper/busStopRouteHelper");
const {  BusRoute } = require("../models");
const { errorMessage, successMessage } = require("../utils/responseUtil");

module.exports.createBusRoute = async(req,res) =>{
    try{
        const {routeNo, name, schedule} = req.body;
        let busRoute = new BusRoute({
            routeNo,  //eg. 901_UP, 901_DOWN
            name,
            schedule
        });
        let error = busRoute.validateSync();
        if(error){
            throw error;
        }
        busRoute = await busRoute.save();
        return res.json(successMessage({
            message : "Bus Route created successfully",
            data : busRoute
        }));
    }catch(e){
        console.error("createBusRoute Error : ", e);
        if(e.code===11000){
            //duplicate key error, unique value
            return res.status(400).json(errorMessage("Bus Route already exists with given routeNo"));
        }
        return res.status(400).json(errorMessage(e.message || e));
    }
}


module.exports.getBusRoute = async(req,res) =>{
    try{
        const {routeNo} = req.query;
        let result = await getRouteByRouteNo(routeNo, true);
        return res.json(successMessage({data : result}));
    }catch(e){
        console.error("getBusRoute Error : ", e);
        return res.json(errorMessage(e.message || e));
    }
}

module.exports.getAllBusRoutes = async(req,res) =>{
    try{
        let result = await BusRoute.find().populate("stops.stop");
        return res.json(successMessage({data : result}));
    }catch(e){
        console.error("getAllBusRoutes Error : ", e);
        return res.json(errorMessage(e.message || e));
    }
}

module.exports.updateBusRoute = async(req,res) =>{
    try{
        const {routeNo, name, schedule} = req.body;
        if(!routeNo){
            throw new Error("Route number is required");
        }
        let result = await BusRoute.findOneAndUpdate({routeNo},{
            routeNo,
            name,
            schedule
        },{runValidators : true, new : true});
        if(!result){
            throw new Error(`No Bus Route found with routeNo : ${routeNo}`);
        }
        return res.json(successMessage({
            message : "Bus Route updated successfully",
            data : result
        }));
    }catch(e){
        console.error("updateBusRoute Error : ", e);
        if(e.code===11000){
            //duplicate key error, unique value
            return res.status(400).json(errorMessage("Bus Route already exists with given rouetNo"));
        }
        return res.json(errorMessage(e.message || e));
    }
}


module.exports.deleteBusRoute = async(req,res) =>{
    try{
        const {routeNo} = req.query;
        let result = await removeRouteFromAllStops(routeNo, true);
        
        return res.json(successMessage({
            message : "Bus Route deleted successfully",
            data : result
        }));
    }catch(e){
        console.error("deleteBusRoute Error : ", e);
        return res.json(errorMessage(e.message || e));
    }
}

module.exports.addBusStopToRoute = async(req,res) =>{
    try{
        const {routeNo, stopNo, index, duration} = req.body;
        let result = await addStopToRoute(routeNo, stopNo, index, duration)
        return res.json(successMessage({data : result}));
    }catch(e){
        console.error("addBusStopToRoute Error : ", e);
        return res.json(errorMessage(e.message || e));
    }
}

module.exports.removeBusStopFromRoute = async(req,res) =>{
    try{
        const {routeNo, stopNo} = req.body;
        let result = await removeStopFromRoute(routeNo,stopNo)
        return res.json(successMessage({data : result}));
    }catch(e){
        console.error("removeBusStopFromRoute Error : ", e);
        return res.json(errorMessage(e.message || e));
    }
}

module.exports.removeBusStopFromAllRoutes = async(req,res) =>{
    try{
        const {stopNo} = req.body;
        let result = await removeStopFromAllRoutes(stopNo);
        return res.json(successMessage({data : result}));
    }catch(e){
        console.error("removeBusStopFromRoute Error : ", e);
        return res.json(errorMessage(e.message || e));
    }
}