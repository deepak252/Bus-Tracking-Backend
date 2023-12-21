

let liveRoutes = {
    // "ROUTE_NO1" : [
    //     {
    //         "vehNo" : "VEH_NO",
    //         "location" : {
    //         }
    //     }
    // ],
};

const addLiveBusToRoute = (routeNo, bus)=>{
    if(!routeNo || !bus){
        throw new Error("Invalid routeNo / bus");
    }
    let res = checkBusLive(bus.vehNo);
    if(res){
        throw new Error(`Bus vehNo : ${bus.vehNo} already in route : ${res} `);
    }
    if(liveRoutes[routeNo]){
        // let i = getLiveBusIndex(routeNo, bus.vehNo);
        liveRoutes[routeNo].push(bus);

    }else{
        liveRoutes[routeNo] = [bus];
    }
    return getLiveRoute(routeNo);
}


const removeLiveBusFromRoute = (routeNo, vehNo)=>{
    if(!routeNo || !vehNo){
        throw new Error("Invalid routeNo / vehNo");
    }
    if(liveRoutes[routeNo]){
        liveRoutes[routeNo] = liveRoutes[routeNo]?.filter((e) => {
            return e.vehNo !== vehNo;
        });
    }
    return getLiveRoute(routeNo);
}

const updateLiveBusLocation = (routeNo, vehNo, lat, lng)=>{
    if(!routeNo || !vehNo){
        throw new Error("Invalid routeNo / vehNo");
    }
    
    let i  = liveRoutes[routeNo]?.findIndex((bus)=>bus.vehNo === vehNo);
    if(i>-1){
        liveRoutes[routeNo][i].location = {lat,lng};
        return liveRoutes[routeNo][i]; // return update bus
    }
    // Bus not in route
    throw new Error("Bus Not In Route!!")

}

const checkBusLive = (vehNo)=>{
    for(const key in liveRoutes){ // Key ~ routeNo
        let res  = liveRoutes[key].find((bus)=>bus.vehNo === vehNo);
        if(res){
            return key; // return routeNo
        }
    }
    return false;
}
const getAllLiveRoutes = ()=>{
    return liveRoutes;
}
const getLiveRoute = (routeNo)=>{
    return liveRoutes[routeNo] || [];
}

// const getLiveBusIndex = (routeNo, vehNo)=>{
//     return liveRoutes[routeNo].findIndex((bus)=>bus.vehNo === vehNo);
// }

const getLiveBus = (routeNo, vehNo)=>{
    return liveRoutes[routeNo]?.find((bus)=>bus.vehNo === vehNo);
}

module.exports = {
    addLiveBusToRoute,
    updateLiveBusLocation,
    getLiveRoute,
    getAllLiveRoutes,
    removeLiveBusFromRoute,
    getLiveBus
}
