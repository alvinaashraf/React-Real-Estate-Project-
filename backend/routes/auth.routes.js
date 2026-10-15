import express from 'express'
import { register, login, verifyEmail, getProfile, forgotPassword, resetPassword } from '../controllers/auth.controller.js'
import { protect } from '../middlewares/auth.middleware.js'


const authRouter = express.Router() 
authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.post('/verify-email', verifyEmail)   

authRouter.get("/me", protect , getProfile)

authRouter.post("/forgot-password", forgotPassword)
authRouter.post("/reset-password/:token ", resetPassword)

export default authRouter