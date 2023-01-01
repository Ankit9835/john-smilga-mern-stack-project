import Job from '../models/Job.js'
import {StatusCodes} from 'http-status-codes'
import {BadRequest, UnAuthenticated} from '../errors/index.js'

const createJob = async (req,res) => {
   const {position, company} = req.body
   if(!position || !company){
      throw new BadRequest('please provide all values')
   }
   req.body.createdBy = req.user.userId
   const job = await Job.create(req.body)
    res.status(StatusCodes.CREATED).json({job})
}

const getAllJob = async (req,res) => {
   const jobs= await Job.find({createdBy:req.user.userId})
   res.status(StatusCodes.OK).json({jobs,totalJobs:jobs.length,numOfPages:1})
}

 const updateJob = (req,res) => {
    res.send('update job')
 }

 const showStats = (req,res) => {
    res.send('show stats')
 }

 const deleteJob = (req,res) => {
    res.send('delete hob')
 }

 export {createJob,getAllJob,updateJob,showStats,deleteJob}