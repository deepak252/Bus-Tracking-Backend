const {PORT} = require("./config");

const express = require("express");
const routes = require("./routes");
const socketIO = require("socket.io");
const cors = require('cors');
const {
    connectUser,
    connectBus
} = require("./services/socket/index.js");

require("./config/db").connect();

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api", routes);
app.get("/",(req,res)=>res.json("Bus Tracking App"));

const httpServer = require("http").createServer(app);
//Socket Connection
const io = socketIO(httpServer);



connectUser(io);
connectBus(io);

httpServer.listen(PORT,()=>{
    console.log(`Server is running on PORT : ${PORT}`);
});

