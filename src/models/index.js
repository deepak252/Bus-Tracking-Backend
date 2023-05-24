const User = require("./User");
const Driver = require("./Driver");
const Bus = require("./Bus");
const BusRoute = require("./BusRoute");
const BusStop = require("./BusStop");
const RouteFeedback = require("./Feedback");
const locationSchema = require("./locationSchema");

module.exports = {
    User,
    Driver,
    Bus,
    BusRoute,
    BusStop,
    RouteFeedback,
    locationSchema
}