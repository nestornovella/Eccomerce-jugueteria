


module.exports = {
    responseHelper:(res, response, header=[], status = 200)=>{
        if(!header.length || header === null)res.status(status).json({status:status, data: response})
        else{ 
            const [name, data]= header
            res.setHeader(name, data).status(status).json({status:status, data: response})
        }
    },
    rejectHelper:(messaje)=>{
        throw new Error(messaje)
    }
}