const regex = Object.freeze({
    militaryTime : /^(?:[01]\d|2[0-3]):[0-5]\d$/,
    email : /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    phone : /^(\+\d{1,3}[- ]?)?\d{10}$/,
});

const Day = Object.freeze({
    sunday : 'sunday', 
    monday : 'monday',
    tuesday : 'tuesday',
    wednesday : 'wednesday',
    thursday : 'thursday',
    friday : 'friday',
    saturday : 'saturday',
});

const BusStatus = Object.freeze({
    na : "na",
    inTransit : "in_transit",
    delayed : "delayed",
    cancelled : "cancelled",
    breakDown : "break_down",
});

const BusType = Object.freeze({
    other : "other",
    red : "red",
    green : "green",
    orange : "orange",
    blue : "blue",
});


module.exports = {
    regex,
    Day,
    days : Object.values(Day),
    BusType,
    busTypes : Object.values(BusType),
    BusStatus,
    busStatuses : Object.values(BusStatus)
}

