import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../Models/userModel.js'

const validateToken = asyncHandler(async (req, res, next) => {
  let token

  token = req.cookies.token
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.TOKEN_KEY)

      req.user = await User.findById(decoded.id)

      // Check if the user is blocked
      if (req.user.isBlocked) {
        res.status(401)
        throw new Error('User is blocked')
      }

      next()
    } catch (error) {
      res.status(401).json({ message: 'Token not valid', success: false })
    }
  } else {
    res.status(401)
    throw new Error('Not authorized, no token')
  }
})

export default validateToken
