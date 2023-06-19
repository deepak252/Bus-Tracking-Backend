const { verifyToken } = require("../../helper/authHelper");
const { errorMessage } = require("../../utils/responseUtil");
const { getLiveRoute } = require("../../helper/liveRouteHelper");
const { getRouteByRouteNo } = require("../../helper/busStopRouteHelper");


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

        // socket.on("joinBus",({busNo})=>{
        //     if(!busNo){
        //         socket.emit("error",errorMessage("busNo is required"));
        //         return;
        //     }
        //     console.log(`User(${userId}) joinBus(${busNo})`);
        //     socket.join(busNo);
        // });

        socket.on("user:joinRoute",async ({routeNo})=>{
            try{
                console.log(`User(${userId}) joinRoute(routeNo = ${routeNo})`);
                // if(!routeNo){
                //     throw new Error("routeNo is required");
                // }
                const route = await getRouteByRouteNo(routeNo, false);
                socket.join(routeNo);
                // socket.to(routeNo).emit("user:routeJoined", getLiveRoute(routeNo));
                socket.emit("user:routeJoined", getLiveRoute(routeNo));
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
        });

    })


}