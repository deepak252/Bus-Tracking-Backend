const {PORT} = require("./config/environment");
const express = require("express");
const routes = require("./routes");

require("./config/db").connect();

const app = express();


app.use(express.json());

app.use("/api", routes);


app.listen(PORT,()=>{
    console.log(`Server is running on PORT : ${PORT}`);
})

