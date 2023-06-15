
const roomName = "room1";

module.exports = (io, socket) =>{
    const { user } = socket.handshake.query;

    if (!user) {
        socket.disconnect();
    }
    // socket.user = user;
    console.log(`Connected(${socket.id}) `, user);
    console.log(`Total Connected Clients : `, io.engine.clientsCount);

    socket.on("joinRoom", () => {
        console.log(`joinRoom(${user})`);

        // Adding sender to the room
        socket.join(roomName);

        // Sending only to the sender
        socket.emit("roomJoined", "You have joined the room");

        // Sending to all clients, except sender
        socket.broadcast.emit("roomJoined", `${user} has has joined the room`);
    });

    // Add listner as user has joined the room
    socket.on("message", (message) => {
        console.log(`message(${user}) : ${message}`);
        // Sending message to all users in Room, including sender
        io.to(roomName).emit("newMessage", `${user} : ${message}`);

        // Sending message to all users in Room, including sender
        // io.in(roomName).emit("newMessage", `${user} : ${message}`)
    });

    // // Sending to all clients, including sender
    // io.emit("userOnline",{"io.userOnline" : user});

    // Sending to all clients, except sender
    socket.broadcast.emit("userOnline", { "io.broadcast": user });

    socket.on("disconnect", () => {
        console.log(`Disconnected(${socket.id}) `, user);
    });
    
}