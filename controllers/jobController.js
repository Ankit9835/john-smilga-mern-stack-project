import Job from '../models/Job.js'
import {StatusCodes} from 'http-status-codes'
import {BadRequest, NotFound, UnAuthenticated} from '../errors/index.js'
import checkPermission from '../utils/checkPermission.js'
import mongoose from 'mongoose'
import moment from 'moment';

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
   const { search, status, jobType, sort } = req.query;
   const queryObject = {
      createdBy:req.user.userId
   }
   if (status && status !== 'all') {
      queryObject.status = status;
    }
    if (jobType && jobType !== 'all') {
      queryObject.jobType = jobType;
    }
    if (search && search) {
      queryObject.position = { $regex: search, $options: 'i' };
    }
    console.log(queryObject)
   let result =  Job.find(queryObject)
   if (sort === 'latest') {
      result = result.sort('-createdAt');
    }
    if (sort === 'oldest') {
      result = result.sort('createdAt');
    }
    if (sort === 'a-z') {
      result = result.sort('position');
    }
    if (sort === 'z-a') {
      result = result.sort('-position');
    }
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page - 1) * limit
    result.skip(skip).limit(limit)
   const jobs= await result

   const totalJobs = await Job.countDocuments(queryObject)
   const numOfPages = Math.ceil(totalJobs / limit)

   res.status(StatusCodes.OK).json({jobs,totalJobs,numOfPages})
}

 const updateJob = async (req,res) => {
   const {id:jobId} = req.params
   const {company,position,status} = req.body
   if(!company || !position){
      throw new BadRequest('please provide all values')
   }
    const job = await Job.findOne({_id:jobId})
    if(!job){
      throw new NotFound(`No Jobs found for this id: ${jobId}`)
    }
    checkPermission(req.user,job.createdBy)
    const updatedJob = await Job.findOneAndUpdate({ _id: jobId }, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(StatusCodes.OK).json({job})
 }

 const showStats = async (req,res) => {
   let stats = await Job.aggregate([
      {$match: {createdBy: mongoose.Types.ObjectId(req.user.userId)}},
      {$group: {_id: '$status', count: {$sum: 1}}},
   ])
   stats = stats.reduce((acc,curr) => {
      const {_id:title, count} = curr;
      acc[title] = count;
      return acc;
   },{});
   const defaultStats = {
      pending: stats.pending || 0,
      interview: stats.interview || 0,
      declined: stats.declined || 0,
    };
    
    let monthlyApplications = await Job.aggregate([
      {$match: { createdBy : mongoose.Types.ObjectId(req.user.userId) } },
      {$group: {
         _id:{
            year:{
               $year:'$createdAt'
            },
            month:{
               $month:'$createdAt'
            }
         },
         count: {$sum:1}
      }},
      {$sort: {'_id.year':-1, '_id.month':-1}},
      { $limit:6 }
    ])

    monthlyApplications = monthlyApplications.map((item,index) => {
      const {_id:{year,month}, count} = item
      const date = moment().month(month - 1).year(year).format('MMM Y')
      return {date, count}
    }).reverse()
  
    res.status(StatusCodes.OK).json({defaultStats,monthlyApplications})
 }

 const deleteJob = async (req,res) => {
   const {id:jobId} = req.params
   const job = await Job.findOne({_id:jobId})
   if(!job){
      throw new NotFound(`No job  found with the given id: ${jobId}`)
   }
   checkPermission(req.user, job.createdBy)
   await job.remove()
   res.status(StatusCodes.OK).json({msg: 'Success! Jobs Removed'})
 }

 export {createJob,getAllJob,updateJob,showStats,deleteJob}