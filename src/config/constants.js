module.exports = {
    regex : {
        militaryTime : /^(?:[01]\d|2[0-3]):[0-5]\d$/,
        email : /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        phone : /^(\+\d{1,3}[- ]?)?\d{10}$/,
    },
    days : ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday","saturday"],
    busStatuses : ["na", "in_transit", "delayed", "cancelled", "break_down"],
    busTypes : ["na","red", "green", "orange", "blue"]
}