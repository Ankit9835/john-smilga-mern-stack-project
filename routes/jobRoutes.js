import express from 'express'

const router = express.Router()

import { createJob,getAllJob,updateJob,showStats,deleteJob } from '../controllers/jobController.js'

router.route('/').get(getAllJob).post(createJob)
router.route('/showStats').get(showStats)
router.route('/:id').patch(updateJob).delete(deleteJob)

export default router