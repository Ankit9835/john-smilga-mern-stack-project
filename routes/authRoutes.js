import express from 'express'
import authenticateUser from '../middleware/auth.js'

const app = express()
const router = express.Router()

import { registeruser,loginUser,updateUser } from '../controllers/authController.js'

router.route('/register').post(registeruser)
router.route('/login').post(loginUser)
router.route('/updateUser').patch(authenticateUser,updateUser)

export default router