const errorHandler = (error,req,res,next) => {
    res.status(500).json({msg:'there was a error'})
}

export default errorHandler