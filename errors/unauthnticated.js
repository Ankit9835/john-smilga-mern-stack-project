import { StatusCodes } from 'http-status-codes'
import CustomError from './custom-api.js'

class UnAuthenticated extends CustomError{
    constructor(message){
        super(message)
        this.statusCode = StatusCodes.UNAUTHORIZED
    }
}

export default UnAuthenticated