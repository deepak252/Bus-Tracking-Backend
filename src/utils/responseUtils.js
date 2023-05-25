exports.successMessage=({message, data})=>{
    return {
        success : true,
        message,
        data
    }
}

exports.errorMessage = ( error) => {
    return {
        success: false,
        error
    }
}