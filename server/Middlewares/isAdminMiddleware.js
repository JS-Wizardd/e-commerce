import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../Models/userModel.js'

const isAdmin = asyncHandler(async (req, res, next) => {
  let token

  token = req.cookies.adminToken

  // console.log(token)
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.TOKEN_KEY)

      req.user = await User.findById(decoded.id)
      if (req.user.isAdmin) {
        next()
      } else {
        return res
          .status(403)
          .json({ message: 'User is not an admin!', success: false })
      }
    } catch (error) {
      return res
        .status(401)
        .json({ message: 'Token not valid', success: false })
    }
  } else {
    return res
      .status(401)
      .json({ message: 'Not authorized, no token', success: false })
  }
})

export { isAdmin }
