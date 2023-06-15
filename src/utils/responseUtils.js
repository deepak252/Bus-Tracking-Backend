exports.successMessage=({message, data})=>{
    return {
        success : true,
        message,
        data
    }
}

exports.errorMessage = ( message) => {
    return {
        success: false,
        message
    }
}