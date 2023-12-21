const { getBusByVehNo, getRouteByRouteNo } = require("../../helper/busStopRouteHelper");
const { errorMessage, successMessage } = require("../../utils/responseUtil");
const { validateLatLng } = require("../../utils/validator");
const { addLiveBusToRoute, updateLiveBusLocation, removeLiveBusFromRoute} = require("../../helper/liveRouteHelper");
const { BusRoute } = require("../../models");

module.exports = (io)=>{
    const busNamespace = io.of("/bus");
    const userNamespace = io.of("/user");

    busNamespace.use(async(socket,next)=>{
        const { vehNo } = socket.handshake.query;
        try{
            const bus = await getBusByVehNo(vehNo, false);
            socket.bus = bus;
            next();
        }catch(e){
            next(new Error(`Error : ${e.message || e}`))
        }
    });

    busNamespace.on("connect",(socket)=>{
        const bus = socket.bus;
        const { vehNo } = bus;
        console.log(`Bus Connected(${socket.id}) : ${vehNo}`);
       
        // socket.join(vehNo);

        // Bus Join Route
        socket.on("bus:joinRoute",async ({routeNo})=>{
            try{
                console.log(`Bus(${vehNo}) joinRoute(${routeNo})`);
                const route = await getRouteByRouteNo(routeNo, false); // Check route exists
                socket.routeNo = routeNo;
                const liveRoute = addLiveBusToRoute(routeNo, bus);
                socket.join(routeNo);
                busNamespace.to(routeNo).emit("bus:routeUpdated",liveRoute); // emit all buses in route to buses
                userNamespace.to(routeNo).emit("bus:routeUpdated",liveRoute); // emit all buses in route to users
                userNamespace.to(`${routeNo}/${vehNo}`).emit("bus:routeJoined",bus); // emit specific bus info to users

            }catch(e){
                socket.emit("error",errorMessage(e.message || e));
            }
            
        });
        // Update Bus Location
        socket.on("bus:updateLocation",({lat, lng})=>{
            try{
                console.log(`Bus(${vehNo}), updateLocation(${lat},${lng})`);
                validateLatLng(lat,lng);
                let routeNo = socket.routeNo;
                const liveBus = updateLiveBusLocation(routeNo,vehNo,lat,lng);
                busNamespace.to(routeNo).emit("bus:locationUpdated", liveBus);
                userNamespace.to(routeNo).emit("bus:locationUpdated", liveBus);
                userNamespace.to(`${routeNo}/${vehNo}`).emit("bus:locationUpdated",liveBus);
            }catch(e){
                socket.emit("error",errorMessage(e.message || e));
            }
        });
        // Bus Route Updated
        socket.on("bus:routeUpdated",(data)=>{
            // On location change for buses in current route
            console.log(`Bus(${vehNo}) locationUpdated(${data})`);
        });
        
        socket.on("bus:leaveRoute",()=>{
            try{
                console.log(`Bus(${vehNo}) leaveRoute(${socket.routeNo})`);
                const routeNo = socket.routeNo;
                
                const liveRoute = removeLiveBusFromRoute(routeNo,vehNo)
                busNamespace.to(routeNo).emit("bus:routeUpdated",liveRoute);
                userNamespace.to(routeNo).emit("bus:routeUpdated",liveRoute);
                socket.leave(routeNo);
                socket.leave(`${routeNo}/${vehNo}`);
            }catch(e){
                socket.emit("error",errorMessage(e.message || e));
            }
        });

        socket.on("disconnect",()=>{
            try{
                console.log(`Bus Disconnected(${socket.id}) `, vehNo);
                const routeNo = socket.routeNo;
                const liveRoute = removeLiveBusFromRoute(routeNo,vehNo)
                busNamespace.to(routeNo).emit("bus:routeUpdated",liveRoute);
                userNamespace.to(routeNo).emit("bus:routeUpdated",liveRoute);
                socket.leave(routeNo);
                socket.leave(`${routeNo}/${vehNo}`);
            }catch(e){
                socket.emit("error",errorMessage(e.message || e));
            }
        });
    });


}