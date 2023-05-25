const { errorMessage, successMessage } = require("../../utils/responseUtils");

module.exports = (io)=>{
    const busNamespace = io.of("/bus");
    const userNamespace = io.of("/user");

    busNamespace.use((socket,next)=>{
        const { busNo } = socket.handshake.query;
        if (!busNo) {
            next(new Error("busNo is required"))
        }else{
            next();
        }
    });

    busNamespace.on("connect",(socket)=>{
        const { busNo } = socket.handshake.query;
        console.log(`Bus Connected(${socket.id}) : ${busNo}`);
       
        socket.join(busNo);

        socket.on("bus:joinRoute",({routeNo})=>{
            if(!routeNo){
                socket.emit("error",errorMessage("routeNo is required"));
                return;
            }
            console.log(`Bus(${busNo}) joinRoute(${routeNo})`);
            socket.routeNo = routeNo;
            socket.join(routeNo);
            
        });

        socket.on("bus:updateLocation",({lat, lng})=>{
            if(!lat || !lng){
                socket.emit("error",errorMessage("lat,lng are required"));
                return;
            }
            console.log(`Bus(${busNo}), updateLocation(${lat},${lng})`);
            let routeNo = socket.routeNo;
            if(!routeNo){
                socket.emit("error",errorMessage("Couldn't find route"));
                return;
            }
            const data = successMessage({
                data : {
                    busNo,
                    location: {lat,lng}
                }
            });
            busNamespace.to(routeNo).emit("bus:locationUpdated",data);
            userNamespace.to(routeNo).emit("bus:locationUpdated",data);
            // Get all active buses in route
            // track bus location
        });

        socket.on("bus:locationUpdated",(data)=>{
            // On location change for buses in current route
            console.log(`Bus(${busNo}) locationUpdated(${data})`);
        });

        socket.on("bus:leaveRoute",({routeNo})=>{
            console.log(`Bus(${busNo}) leaveRoute(${routeNo})`);
            const data = successMessage({
                data : {
                    busNo,
                    location: null
                }
            });
            busNamespace.to(routeNo).emit("bus:locationUpdated",data);
            userNamespace.to(routeNo).emit("bus:locationUpdated",data);
            socket.leave(routeNo);
        });

        socket.on("disconnect",()=>{
            console.log(`Bus Disconnected(${socket.id}) `, busNo);
        });
    })


}