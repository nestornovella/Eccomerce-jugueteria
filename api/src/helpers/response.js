


module.exports = {
    responseHelper:(res, response, status = 200)=>{
        res.status(status).json({status:status, response})
    },
    rejectHelper:(messaje)=>{
        throw new Error(messaje)
    }
}