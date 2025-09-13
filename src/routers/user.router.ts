import express from 'express'
import {loginUser, registerUser} from '../controllers/user.controller'

const router = express.Router()


//Login & Signup
router.post('/login', loginUser)
router.post('/register', registerUser)


export default router