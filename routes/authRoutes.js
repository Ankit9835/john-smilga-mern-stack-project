import express from 'express'

const app = express()
const router = express.Router()

import { registeruser,loginUser,updateUser } from '../controllers/authController.js'

router.route('/register').post(registeruser)
router.route('/login').post(loginUser)
router.route('/updateUser').patch(updateUser)

export default router