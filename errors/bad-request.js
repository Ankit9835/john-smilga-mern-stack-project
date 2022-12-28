import { StatusCodes } from 'http-status-codes'
import CustomError from './custom-api.js'

class BadRequest extends CustomError{
    constructor(message){
        super(message)
        this.statusCode = StatusCodes.BAD_REQUEST
    }
}

export default BadRequest