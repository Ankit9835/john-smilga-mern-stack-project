import { StatusCodes } from 'http-status-codes'
import CustomError from './custom-api.js'

class NotFound extends CustomError{
    constructor(message){
        super(message)
        this.statusCode = StatusCodes.BAD_REQUEST
    }
}

export default NotFound