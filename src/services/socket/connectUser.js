module.exports = (io)=>{
    const userNamespace = io.of("/user");
    const busNamespace = io.of("/bus"); // Send live users count to busNamespace

    userNamespace.use((socket,next)=>{
        const { userId } = socket.handshake.query;
        if (!userId) {
            next(new Error("userId is required"))
        }else{
            next();
        }
    });

    userNamespace.on("connect",(socket)=>{

        const { userId } = socket.handshake.query;
        console.log(`User Connected(${socket.id}) : ${userId}`);

        // socket.on("joinBus",({busNo})=>{
        //     if(!busNo){
        //         socket.emit("error",errorMessage("busNo is required"));
        //         return;
        //     }
        //     console.log(`User(${userId}) joinBus(${busNo})`);
        //     socket.join(busNo);
        // });

        socket.on("user:joinRoute",({routeNo})=>{
            if(!routeNo){
                socket.emit("error",errorMessage("routeNo is required"));
                return;
            }
            console.log(`User(${userId}) joinRoute(${routeNo})`);
            socket.join(routeNo);
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