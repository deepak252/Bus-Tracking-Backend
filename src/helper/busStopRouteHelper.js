const { Bus, BusRoute, BusStop } = require("../models");

const getBusByVehNo = async (vehNo, {populate = false})=>{
    if(!vehNo){
        throw new Error("vehNo is required");
    }
    const result = populate 
        ?  await Bus.findOne({vehNo}).populate("route")
        :  await Bus.findOne({vehNo});

    if(!result){
        throw new Error("No Bus found with given vehNo");
    }
    return result;
}

const getRouteByRouteNo = async (routeNo, {populate = false})=>{
    if(!routeNo){
        throw new Error("routeNo is required");
    }
    const result = populate 
        ?  await BusRoute.findOne({routeNo}).populate("stops")
        :  await BusRoute.findOne({routeNo});

    if(!result){
        throw new Error("No Bus Route found with given routeNo");
    }
    return result;
}

const getStopByStopNo = async (stopNo, {populate = false})=>{
    if(!stopNo){
        throw new Error("stopNo is required");
    }
    const result = populate 
        ?  await BusStop.findOne({stopNo}).populate("routes")
        :  await BusStop.findOne({stopNo});
    if(!result){
        throw new Error("No Bus Stop found with given stopNo");
    }
    return result;
}

// index starting from 0
const addStopToRoute = async (routeNo, stopNo, index) => {
    if (!routeNo || !stopNo) {
        throw new Error("routeNo and stopNo is required");
    }
    let route = await getRouteByRouteNo(routeNo);
    let stop = await getStopByStopNo(stopNo);
    if(route.stops?.includes(stop._id)){
        throw new Error("Stop is already exists in route, please remove that first");
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
            !route.stops.includes(stop._id) && route.stops.push(stop._id)
            // route.stops.push(stop._id);
        }else{
            route.stops = [stop._id];
        }
    }else{
        if(index<0 || index > (route.stops?.length || 0)){
            throw new Error("Index out of range");
        }
        if(route.stops){
            route.stops.splice(index,0,stop._id);
        }else{
            route.stops = [stop._id];
        }
    }
    route = await route.save();
    stop = await stop.save();
    return {route,stop}
};

const removeStopFromRoute = async (routeNo, stopNo) => {
    if (!routeNo || !stopNo) {
        throw new Error("routeNo and stopNo is required");
    }
    let route = await getRouteByRouteNo(routeNo);
    let stop = await getStopByStopNo(stopNo);
    // Remove Route from Stop
    if(stop.routes){
        let i = stop.routes.indexOf(route._id);
        stop.routes.splice(i,1)
    }
    // Remove Stop from From
    if(route.stops){
        let i = route.stops.indexOf(stop._id);
        route.stops.splice(i,1)
    }
    route = await route.save();
    stop = await stop.save();
    return {route,stop}
};

const getAllBusesForRoute = async (routeNo) => {
    if (!routeNo) {
        throw new Error("routeNo is required");
    }
    let route = await getRouteByRouteNo(routeNo);
    const result = await Bus.find({
        route : route._id
    });
    return result;
};


const getAllBusesForStop = async (stopNo) => {
    if (!stopNo) {
        throw new Error("stopNo is required");
    }
    let stop = await getStopByStopNo(stopNo);
    
    const result = await Bus.find({
        route : {
            "$in" : stop.routes || []
        }
    }).populate('route');
    return result;
};

module.exports = {
    getBusByVehNo,
    getRouteByRouteNo,
    getStopByStopNo,
    addStopToRoute,
    removeStopFromRoute,
    getAllBusesForRoute,
    getAllBusesForStop

}