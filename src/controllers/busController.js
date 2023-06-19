const { getBusByVehNo, getAllBusesForStop, getAllBusesForRoute } = require("../helper/busStopRouteHelper");
const { getAllLiveRoutes } = require("../helper/liveRouteHelper");
const { Bus, BusRoute } = require("../models");
const { calculateDistance } = require("../utils/locationUtil");
const { successMessage, errorMessage } = require("../utils/responseUtil");
const { validateLatLng } = require("../utils/validator");

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
        const liveBusRoutes = getAllLiveRoutes();
        let nearbyBuses = [];
        // const routeNumbers = Object.keys(liveBusRoutes);
        // console.log(routeNumbers)

        for(const key in liveBusRoutes){ // Key ~ routeNo
            const liveBuses = liveBusRoutes[key];
            for(let i=0;i<liveBuses.length;i++){
                const bus = liveBuses[i].toObject();
                if(bus.location){
                    const {lat : lat2,lng : lng2} = bus.location;
                    const distInMetres = calculateDistance(lat,lng, lat2,lng2);
                    console.log({distInMetres});
                    if(distInMetres<2000){
                        // Add all buses in the range of 2 km
                        nearbyBuses.push({
                            ...bus,
                            routeNo : key
                        });
                    }
                }
            }
        }
        let routeNumbers = nearbyBuses.map((e)=>e.routeNo);
        routeNumbers = [...new Set(routeNumbers)];
        const routes = await BusRoute.find({
            routeNo : {$in : routeNumbers}
        }).lean();

        let filteredNearbyBuses = [];
        for(let i=0;i<nearbyBuses.length;i++){
            let nearbyBus = nearbyBuses[i];
            let route = routes.find((e)=>e.routeNo==nearbyBus.routeNo);
            if(route){
                delete nearbyBus["routeNo"];
                filteredNearbyBuses.push({
                    ...nearbyBus,
                    route
                })
            }
        }
        return res.json(successMessage({data : filteredNearbyBuses}));

        // validateLatLng(lat,lng);
        // const result = await Bus.find({
        //     route : {$ne : null},
        //     location: {
        //         $geoWithin: {
        //             $centerSphere: [[lat, lng], 2 / 6378.1], // Convert radius to radians (Earth's radius in kilometers is approximately 6378.1)
        //         },
        //     },
        // }).populate('route');
        // return res.json(successMessage({data : result}));
    }catch(e){
        console.error("getNearbyBuses Error : ", e);
        return res.json(errorMessage(e.message || e));
    }
}


module.exports.getAllBusesForBusStop = async(req,res) =>{
    try{
        const {stopNo} = req.query;
        let result = await getAllBusesForStop(stopNo);
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

