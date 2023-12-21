const { verifyToken } = require("../../helper/authHelper");
const { errorMessage } = require("../../utils/responseUtil");
const { getLiveRoute, getLiveBus } = require("../../helper/liveRouteHelper");
const { getRouteByRouteNo, getBusByVehNo } = require("../../helper/busStopRouteHelper");


module.exports = (io)=>{
    const userNamespace = io.of("/user");
    const busNamespace = io.of("/bus"); // Send live users count to busNamespace

    userNamespace.use(async (socket,next)=>{
        const { token } = socket.handshake.query;
        try{
            const user = await verifyToken(token);
            socket.user = user;
            next();
        }catch(e){
            next(new Error(`Authentication Error : ${e.message || e}`))
        }
        
    });

    userNamespace.on("connect",(socket)=>{

        const user = socket.user;
        const userId = user.id;
        console.log(`User Connected(${socket.id}) : ${userId}`);

        socket.on("user:joinRoute",async ({routeNo})=>{
            try{
                console.log(`User(${userId}) joinRoute(routeNo = ${routeNo})`);
                
                const route = await getRouteByRouteNo(routeNo, false);
                socket.join(routeNo);
                // socket.to(routeNo).emit("user:routeJoined", getLiveRoute(routeNo));
                socket.emit("user:routeJoined", getLiveRoute(routeNo));
            }catch(e){
                socket.emit("error",errorMessage(e.message || e));
            }
        });

        socket.on("user:joinBus",async ({routeNo, vehNo})=>{
            try{
                console.log(`User(${userId}) joinBus(routeNo = ${routeNo}, vehNo = ${vehNo})`);
                let bus = await getBusByVehNo(vehNo, false);
                const route = await getRouteByRouteNo(routeNo, false);

                bus = getLiveBus(routeNo, vehNo);
                if(!bus){
                    throw new Error("Bus not connected!");
                }
                socket.join(`${routeNo}/${vehNo}`);
                // socket.to(routeNo).emit("user:routeJoined", getLiveRoute(routeNo));
                socket.emit("user:busJoined", bus);
            }catch(e){
                socket.emit("error",errorMessage(e.message || e));
            }
        });

        socket.on("user:leaveRoute",({routeNo})=>{
            console.log(`User(${userId}) leaveRoute(${routeNo})`);
            socket.leave(routeNo);
        });


        socket.on("disconnect",()=>{
            console.log(`User Disconnected(${socket.id}) `, userId);
            // socket.leave(routeNo);
        });

    })


}