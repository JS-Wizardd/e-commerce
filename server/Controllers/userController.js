import asyncHandler from 'express-async-handler'
import dotenv from 'dotenv'
dotenv.config()
import User from '../Models/userModel.js'
import Address from '../Models/addressModel.js'
import Cart from '../Models/cartModel.js'
import Wallet from '../Models/walletModel.js'
import { generateToken } from '../Utils/generateToken.js'
import twilio from 'twilio'
import bcrypt from 'bcrypt'
import { generateRandomString } from '../Helpers/resetPasswordString.js'
import { passwordResetTokenMail } from '../Utils/nodemailer.js'

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
  {
    lazyLoading: true,
  }
)

//@desc Send OTP before registering
//@route POST/api/v1/users/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, mobile } = req.body

  if (!name || !email || !password || !mobile) {
    res
      .status(400)
      .json({ message: 'All fields are mandatory', success: false })
  }

  const existingUser = await User.findOne({ email })
  if (existingUser) {
    res.status(400).json({ message: 'Email already in use', success: false })
  }

  try {
    const otpResponse = await client.verify.v2
      .services(process.env.TWILIO_SERVICE_SID)
      .verifications.create({
        to: `+91${mobile}`,
        channel: 'sms',
      })
    res.status(200).json({
      message: `OTP send successfully to ${mobile}`,
      success: true,
    })
  } catch (error) {
    res.status(error?.status || 400).json({
      message: error?.message || 'something went wrong in sending otp!',
      success: false,
    })
  }
})

//@desc Verify user's OTP and register
//@route POST//api/v1/users/verify-otp
//@access public
const verifyOTP = asyncHandler(async (req, res) => {
  try {
    const { name, email, password, mobile, otp } = req.body
    if (!name || !email || !password || !mobile || !otp) {
      res.status(400).json({
        errorType: 'MissingFields',
        message: 'All fields are mandatory',
        success: false,
      })
    }

    const verifiedResponse = await client.verify.v2
      .services(process.env.TWILIO_SERVICE_SID)
      .verificationChecks.create({
        to: `+91${mobile}`,
        code: otp,
      })
    if (verifiedResponse.status === 'approved') {
      const salt = await bcrypt.genSalt(10)
      const encryptedPassword = await bcrypt.hash(password, salt)
      const user = await User.create({
        name,
        email,
        password: encryptedPassword,
        mobile,
      })

      await Cart.create({ user: user._id, products: [] })

      if (user) {
        const token = generateToken(user._id)
        res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== 'development',
          sameSite: 'strict',
          maxAge: 3 * 24 * 60 * 60 * 1000,
        })

        const userWithoutPassword = {
          id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
        }

        res.status(201).json({
          message: `OTP verified and User registered successfully`,
          success: true,
          user: userWithoutPassword,
        })
      }
    } else if (verifiedResponse.status === 'expired') {
      return res.status(400).json({
        errorType: 'ExpiredOTP',
        message: 'OTP expired',
        success: false,
      })
    } else {
      return res.status(400).json({
        errorType: 'OTPVerificationFailed',
        message: 'OTP verification failed',
        success: false,
      })
    }
  } catch (error) {
    res.status(error?.status || 400).json({
      message: error?.message || 'Something went wrong',
      success: false,
    })
  }
})

//@desc Login user
//@route POST/api/v1/users/Login
//@access public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    res
      .status(400)
      .json({ message: 'All fields are mandatory', success: false })
  }
  try {
    const user = await User.findOne({ email }).select('+password')

    // console.log(user, email, password)
    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id)
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 3 * 24 * 60 * 60 * 1000,
      })

      const userWithoutPassword = {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      }

      res.status(201).json({
        message: 'user logged in successfully',
        success: true,
        user: userWithoutPassword,
      })
    } else {
      res.status(401).json({
        errorType: 'InvalidCredentials',
        message: 'Invalid email or password!',
        success: false,
      })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: 'Login failed',
    })
  }
})

// @desc   Logout user
// route   POST/api/v1/users/logout
// @access Private
const logout = asyncHandler(async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  })

  res.status(200).json({ success: true, message: 'Log out successful' })
})

//@desc Get wallet and its history
//@route GET/api/v1/users/wallet
//@access Private
const getWallet = asyncHandler(async (req, res) => {
  const userId = req.user.id

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'User not authorized',
    })
  }

  try {
    let wallet = await Wallet.findOne({ userId })
      .populate('history.orderDetails')
      .sort({ createdAt: -1 })
    if (!wallet) {
      wallet = await Wallet.create({ userId })
    }

    if (wallet.history.length > 1) {
      wallet.history.sort((a, b) => new Date(b.date) - new Date(a.date))
    }

    return res.status(200).json({
      success: true,
      message: 'wallet fetched successfully',
      wallet,
    })
  } catch (error) {
    console.error('Error fetching/creating wallet:', error)
    res
      .status(500)
      .json({ success: false, message: 'Server error while fetching wallet' })
  }
})

//@desc Get user profile
//@route GET/api/v1/users/profile
//@access Private
const getProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id

  try {
    const user = await User.findById(userId)
    return res.status(200).json({
      success: true,
      message: 'Profile fetched successfully',
      user,
    })
  } catch (error) {
    console.error('Error fetching  profile:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user profile',
    })
  }
})

//@desc Forgot password
//@route POST/api/v1/users/forgot-password
//@access Private
const forgotPassword = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res
        .status(404)
        .json({ message: 'email not found', success: false })
    }

    const resetToken = generateRandomString()
    user.resetToken = resetToken
    user.resetTokenExp = Date.now() + 1000 * 6 * 10

    await user.save()
    await passwordResetTokenMail(resetToken, email)
    res
      .status(200)
      .json({ resetToken, message: 'Password reset token sent', success: true })
  } catch (error) {
    console.error('Error generating reset token', error)
    res.status(500).json({
      message: 'Internal server error',
      success: false,
    })
  }
})

//@desc Verify token and Reset Password
//@route POST/api/v1/users/reset-password
//@access Private
const resetPassword = asyncHandler(async (req, res) => {
  try {
    const { newPassword, resetToken } = req.body

    // console.log(newPassword, resetToken)

    const user = await User.findOne({
      resetToken,
      resetTokenExp: { $gt: Date.now() },
    })
    if (!user) {
      return res
        .status(401)
        .json({ message: 'Invalid or expired reset token', success: false })
    }
    const salt = await bcrypt.genSalt(10)
    const encryptedPassword = await bcrypt.hash(newPassword, salt)

    user.password = encryptedPassword
    user.resetToken = null
    user.resetTokenExp = null
    await user.save()

    // console.log(user)

    res
      .status(200)
      .json({ success: true, message: 'password reset successfully' })
  } catch (error) {
    console.error('error resetting password', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    })
  }
})

export {
  registerUser,
  verifyOTP,
  login,
  logout,
  getWallet,
  getProfile,
  forgotPassword,
  resetPassword,
}
