const mongoose = require("mongoose");
const {MONGO_URI} = require("./environment")

const connectToMongo = async () =>{
    try{
        await mongoose.connect(MONGO_URI);
        console.log("Successfully connected to database");
    }catch(e){
        console.error("Error connecting to database, ", e);
    }
}
module.exports = {
    connect : connectToMongo
};