// Calculate distance in Metres
function calculateDistance(lat1, lng1, lat2, lng2) {
    try{
        const R = 6371; // Radius of the earth in kilometers
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lng2 - lng1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) *
                Math.cos(deg2rad(lat2)) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distance in kilometers
        return distance * 1000;
    }catch(e){
        console.log("ERROR : calculateDistance : ",e);
    }
    return Number.MAX_VALUE;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}
module.exports = {
    calculateDistance
}




