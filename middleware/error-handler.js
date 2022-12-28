import { StatusCodes } from 'http-status-codes'

const errorHandler = (error,req,res,next) => {
    console.log(error)
    const defaultError = {
        statusCode: error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg: error.message || 'Something went wrong, try again later'
    }
    if(error.name === 'ValidationError'){
        defaultError.statusCode = StatusCodes.BAD_REQUEST
        defaultError.msg = Object.values(error.errors).map((item) => item.message).join('')
    }
    if(error.code && error.code === 11000){
        defaultError.statusCode = StatusCodes.BAD_REQUEST
        defaultError.msg = `${Object.keys(error.keyValue)} has to be unique`
    }
     res.status(defaultError.statusCode).json({msg: defaultError.msg})
    // res.status(defaultError.statusCode).json({msg: error})
}

export default errorHandler