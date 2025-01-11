import express from "express"
import { login, register, logout, sendVerifyOtp, verifyUserOtp, isAuthencticated, sendResetotp, resetPassword } from "../controllers/authController.js"
import userAuth from "../middleware/userAuth.js"

const authRouter = express.Router()

authRouter.post('/login', login)
authRouter.post('/register', register)
authRouter.post('/logout', logout)
authRouter.post('/send-verify-otp', userAuth, sendVerifyOtp)
authRouter.post('/verify-account', userAuth, verifyUserOtp)
authRouter.get('/is-auth', userAuth, isAuthencticated)
authRouter.post('/send-reset-otp', sendResetotp)
authRouter.post('/reset-password', resetPassword)


export default authRouter
