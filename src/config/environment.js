require('dotenv').config();

module.exports = {
    NODE_ENV : process.env.NODE_ENV || "development",
    PORT : process.env.PORT || 3000,
    MONGO_URI : process.env.MONGO_URI || "",
    JWT_SECRET : process.env.JWT_SECRET || "JWT_SECRET",
}