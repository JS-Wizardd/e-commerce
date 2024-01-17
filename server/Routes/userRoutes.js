import express from 'express'
const router = express.Router()

import validateToken from '../Middlewares/authMiddleware.js'

import {
  registerUser,
  verifyOTP,
  login,
  logout,
  getWallet,
  getProfile,
  forgotPassword,
  resetPassword,
} from '../Controllers/userController.js'

router.post('/register', registerUser)
router.post('/verify-otp', verifyOTP)
router.post('/login', login)
router.post('/logout', logout)
router.get('/wallet', validateToken, getWallet)
router.get('/profile', validateToken, getProfile)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)

export { router as userRouter }
