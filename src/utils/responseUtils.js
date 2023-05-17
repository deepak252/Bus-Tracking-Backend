exports.successMessage=(data)=>{
    return {
        success : true,
        data
    }
}

exports.errorMessage = ( error) => {
    return {
        success: false,
        error
    }
}