const { Bus, BusRoute, BusStop } = require("../models");

const getBusByVehNo = async (vehNo, populate)=>{
    if(!vehNo){
        throw new Error("vehNo is required");
    }
    const result = populate 
        ?  await Bus.findOne({vehNo})
            .populate({
                path: 'route',
                populate: {
                  path: 'stops.stop',
                },
            })
        :  await Bus.findOne({vehNo});
            // .populate({
            //     path: 'route',
            // });

    if(!result){
        throw new Error(`No Bus found with vehNo : ${vehNo}`);
    }
    return result;
}

const getRouteByRouteNo = async (routeNo, populate)=>{
    if(!routeNo){
        throw new Error("routeNo is required");
    }
    const result = populate 
        ?  await BusRoute.findOne({routeNo}).populate("stops.stop")
        :  await BusRoute.findOne({routeNo});

    if(!result){
        throw new Error(`No Bus Route found with routeNo : ${routeNo}`);
    }
    return result;
}

const getStopByStopNo = async (stopNo, populate)=>{
    if(!stopNo){
        throw new Error("stopNo is required");
    }
    const result = populate 
        ?  await BusStop.findOne({stopNo}).populate("routes")
        :  await BusStop.findOne({stopNo});
    if(!result){
        throw new Error(`No Bus Stop found with stopNo : ${stopNo}`);
    }
    return result;
}

const addBusStop = async(stopNo, name, location)=>{
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
    return busStop;
}

// index starting from 0
const addStopToRoute = async (routeNo, stopNo, index, duration) => {
    let route = await getRouteByRouteNo(routeNo);
    let stop = await getStopByStopNo(stopNo);
    let i = route.stops?.findIndex((e)=>{
        return stop._id.equals(e.stop);
    });
    if(i>=0){
        throw new Error("Stop is already exists in route, please remove that first");
    }
    let stopAndDuration = {
        stop : stop._id,
        duration
    }
    // Add Route in Stop
    if(stop.routes){
        stop.routes.push(route._id);
    }else{
        stop.routes = [route._id];
    }
    // Add Stop in Route
    if(!index){
        if(route.stops){
            route.stops.push(stopAndDuration);
        }else{
            route.stops = [stopAndDuration];
        }
    }else{
        if(index<0 || index > (route.stops?.length || 0)){
            throw new Error("Index out of range");
        }
        if(route.stops){
            route.stops.splice(index,0,stopAndDuration);
        }else{
            route.stops = [stopAndDuration];
        }
    }

    route = await route.save();
    stop = await stop.save();
    return {route,stop}
};

const removeStopFromRoute = async (routeNo, stopNo) => {
    let route = await getRouteByRouteNo(routeNo);
    let stop = await getStopByStopNo(stopNo);
    // Remove Route from Stop
    if(stop.routes){
        let i = stop.routes.indexOf(route._id);
        if(i>=0){
            stop.routes.splice(i,1);
        }
    }
    // Remove Stop from From
    if(route.stops){
        let i = route.stops.findIndex((e)=>{
            return stop._id.equals(e.stop);
        });
        if(i>=0){
            route.stops.splice(i,1);
        }
    }
    route = await route.save();
    stop = await stop.save();
    return {route,stop};
};

const getAllBusesForRoute = async (routeNo) => {
    
    let route = await getRouteByRouteNo(routeNo);
    const buses = await Bus.find({
        route : route._id
    }).populate('route');
    // return {route, buses};
    return buses;
};


const getAllBusesForStop = async (stopNo) => {
    
    let stop = await getStopByStopNo(stopNo);
    
    const buses = await Bus.find({
        route : {
            $in : stop.routes || []
        }
    }).populate('route');
    // .populate('route')
    // return {stop, buses};
    return buses;
};

/// Call on BusStop deletion
const removeStopFromAllRoutes = async (stopNo, deleteBusStop =false) => {
    
    let stop = await getStopByStopNo(stopNo);
    let result;
    // Remove Stop from All Routes
    if(stop.routes){
        result = await BusRoute.updateMany(
            {"stops.stop" : stop._id},
            {
                $pull : {
                    stops : {stop : stop._id}
                }
            }
        );
    }

    if(deleteBusStop){
        stop = await BusStop.findOneAndDelete({stopNo});
    }else{
        stop.routes = [];
        stop = await stop.save();
    }
    return {stop, result};
};

/// Call on BusRoute deletion
const removeRouteFromAllStops = async (routeNo, deleteBusRoute=false) => {
    
    let route = await getRouteByRouteNo(routeNo);
    let result;
    // Remove Route from All Stops
    if(route.stops){
        result = await BusStop.find(
            {"routes" : route._id}
        )
        result = await BusStop.updateMany(
            {"routes" : route._id},
            {
                $pull : {
                    routes : route._id
                }
            }
        );
        
    }
    if(deleteBusRoute){
        route = await BusRoute.findOneAndDelete({routeNo});
    }else{
        route.stops = [];
        route = await route.save();
    }
    return {route, result};
};

module.exports = {
    getBusByVehNo,
    getRouteByRouteNo,
    getStopByStopNo,
    addBusStop,
    addStopToRoute,
    removeStopFromRoute,
    getAllBusesForRoute,
    getAllBusesForStop,
    removeStopFromAllRoutes,
    removeRouteFromAllStops

}