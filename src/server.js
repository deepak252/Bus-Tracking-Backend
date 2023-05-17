const {PORT} = require("./config");

const express = require("express");
const routes = require("./routes");

require("./config/db").connect();

const app = express();


app.use(express.json());

app.use("/api", routes);

app.get("/",(req,res)=>res.json("Bus Tracking App"));

app.listen(PORT,()=>{
    console.log(`Server is running on PORT : ${PORT}`);
})

