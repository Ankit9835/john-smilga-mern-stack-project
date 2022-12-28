import User from "../models/User.js"
import { StatusCodes } from "http-status-codes"
import {CustomError,BadRequest,NotFound,UnAuthenticated} from '../errors/index.js'



const registeruser = async (req,res) => {
    const {name,email,password} = req.body
    if(!name || !email || !password){
        throw new BadRequest('please provide all values')
    }
    const userEmailAlreadyExists = await User.findOne({email})
    if(userEmailAlreadyExists){
        throw new BadRequest('User email already exists')
    }
    const user = await User.create(req.body)
    const token = user.createJWT()
    res.status(StatusCodes.OK).json({user:{
        email:user.email,
        lastName:user.lastName,
        location:user.location,
        name:user.name
    }, location: user.location, token})
}

const loginUser = async (req,res) => {
    const {email,password} = req.body
    if(!email || !password){
        throw new BadRequest('please provide all values')
    }
    const user = await User.findOne({email}).select('+password')
    if(!user){
        throw new UnAuthenticated('Email not found for this user')
    }
    const isPasswordCorrect = await user.comparePassword(password)
    if(!isPasswordCorrect){
        throw new UnAuthenticated('password not matched')
    }
    user.password = undefined
    const token = user.createJWT()
    res.status(StatusCodes.OK).json({user,token,location:user.location})
}

const updateUser = (req,res) => {
    res.send('update user')
}

export {registeruser,loginUser,updateUser}