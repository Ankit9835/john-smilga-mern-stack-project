import express from 'express'
import authenticateUser from '../middleware/auth.js'
import rateLimiter from 'express-rate-limit';

const app = express()
const router = express.Router()

import { registeruser,loginUser,updateUser } from '../controllers/authController.js'

const apiLimiter = rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  });

router.route('/register').post(apiLimiter,registeruser)
router.route('/login').post(apiLimiter,loginUser)
router.route('/updateUser').patch(authenticateUser,updateUser)

export default router