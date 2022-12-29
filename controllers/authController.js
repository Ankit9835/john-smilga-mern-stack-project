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

const updateUser = async (req,res) => {
    const {name,email,lastName,location} = req.body
    if(!name || !email || !lastName || !location){
        throw new BadRequest('Please fill all the values')
    }
    const user = await User.findOne({_id:req.user.userId})
    if(!user){
        throw new BadRequest('Invalid ID')
    }
    user.name = name
    user.email = email
    user.location = location
    user.lastName = lastName

    const token = user.createJWT()
    await user.save()
    res.status(StatusCodes.OK).json({user,token,location:user.location})
}

export {registeruser,loginUser,updateUser}