import asyncHandler from 'express-async-handler'
import dotenv from 'dotenv'
dotenv.config()
import { generateToken } from '../../Utils/generateToken.js'
import User from '../../Models/userModel.js'

//@desc Admin Login
//@route POST/api/v1/admin/Login
//@access public
const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    res.status(400).json({
      errorType: 'MissingFields',
      message: 'All fields are mandatory',
      success: false,
    })
  }
  // console.log(email, password)

  const user = await User.findOne({ email }).select('+password')

  if (!user || !(await user.matchPassword(password))) {
    res.status(401).json({
      errorType: 'InvalidCredentials',
      message: 'Invalid email or password!',
      success: false,
    })
  }

  if (!user.isAdmin) {
    res.status(401).json({
      errorType: 'NotAuthorized',
      message: 'user is not an admin!',
      success: false,
    })
  }

  // console.log(user, email, password)
  if (user.isAdmin && (await user.matchPassword(password))) {
    const token = generateToken(user._id)
    res.cookie('adminToken', token, {
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
      message: 'admin logged in successfully',
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
})

// @desc   Logout Admin
// route   POST/api/v1/admin/logout
// @access Public
const adminLogout = asyncHandler(async (req, res) => {
  res.cookie('adminToken', '', {
    httpOnly: true,
    expires: new Date(0),
  })

  res.status(200).json({ success: true, message: 'Log out successful' })
})

//@desc View all Users
//@route POST/api/v1/admin/view-all-users
//@access private
const viewAllUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 8 //

  try {
    const totalUsers = await User.countDocuments() // Count total number of products

    const users = await User.find()
      .sort({ createdAt: -1 })
      .limit(limit) // Limit the number of products per page
      .skip((page - 1) * limit) // Skip products based on the current page and limit

    res.status(200).json({
      message: 'Users fetched successfully',
      success: true,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
      users,
    })
  } catch (error) {
    res.status(500).json({
      status: false,
      error: 'Could not fetch Users: ' + error,
    })
  }
})

//@desc View admins
//@route GET /api/v1/admin/admins
//@access Private
const fetchAdmins = asyncHandler(async (req, res) => {
  try {
    const admins = await User.find({ isAdmin: true })
    res
      .status(200)
      .json({ message: 'Admins fetched successfully', success: true, admins })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: 'Internal server error while fetching admins',
      success: false,
    })
  }
})
//@desc Update admin status
//@route PUT /api/v1/admin/update-status/:id
//@access private
const updateStatus = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params

    const admins = await User.find({ isAdmin: true })

    const user = await User.findById(id)
    if (admins.length <= 1 && user.isAdmin) {
      return res
        .status(400)
        .json({ message: 'at least one admin is required', success: false })
    }

    user.isAdmin = !user.isAdmin
    await user.save()
    res.status(200).json({
      message: "User's admin status updated successfully",
      success: true,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: 'Internal server error while updating  admin status',
      success: false,
    })
  }
})

//@desc Update user status
//@route PATCH /api/v1/admin/update-user-status/:id
//@access private
const updateUserStatus = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { isBlocked, isAdmin } = req.body

  if (!id) {
    res.status(404).json({
      success: false,
      message: 'User ID required!',
    })
    return
  }

  try {
    const user = await User.findById(id)

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      })
      return
    }

    if (isBlocked !== undefined) {
      user.isBlocked = isBlocked
    }
    if (isAdmin !== undefined) {
      user.isAdmin = isAdmin
    }

    await user.save()

    res.status(200).json({
      success: true,
      message: 'User status updated successfully',
      user,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Could not update user status: ' + error,
    })
  }
})

//@desc Admin Search User
//@route GET/api/v1/admin/search-user
//@access private
const searchUser = asyncHandler(async (req, res) => {
  const { query } = req.query

  if (!query) {
    res.status(400).json({
      success: false,
      message: 'Search query required!',
    })
    return
  }

  try {
    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { mobile: { $regex: query, $options: 'i' } },
      ],
    })

    res.status(200).json({
      success: true,
      message: 'Users fetched successfully',
      users,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Could not fetch users:' + error,
    })
  }
})

//@desc Product Search Suggestion
//@route GET/api/v1/admin/search-suggestion/?searchTerm=""
//@access public
const searchSuggestion = asyncHandler(async (req, res) => {
  const { searchTerm } = req.query

  if (!searchTerm) {
    res.status(400).json({
      success: false,
      message: 'Search query required!',
    })
    return
  }

  try {
    const suggestions = await User.find(
      {
        email: { $regex: '^' + searchTerm, $options: 'i' },
        isBlocked: false,
      },
      { email: 1, _id: 0 }
    ).limit(10)

    res.status(200).json({
      success: true,
      message: 'User suggestion fetched successfully',
      suggestions,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Could not fetch user suggestion:' + error,
    })
  }
})

export {
  adminLogin,
  adminLogout,
  updateUserStatus,
  viewAllUsers,
  fetchAdmins,
  updateStatus,
  searchUser,
  searchSuggestion,
}
