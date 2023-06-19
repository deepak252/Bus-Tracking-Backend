

module.exports.validateLatLng = (lat,lng)=>{
    if(!lat||!lng){
        throw new Error("lat & lng are required!");
    }
    if(isNaN(lat) || isNaN(lng)){
        throw new Error( "Invalid lat or lng");
    }
}
