const createJob = (req,res) => {
    res.send('create job')
}

const getAllJob = (req,res) => {
    res.send('get all jobs')
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