import asyncHandler from 'express-async-handler'
import Address from '../Models/addressModel.js'

//@desc Get user address
//@route GET/api/v1/address
//@access private
const fetchAddress = asyncHandler(async (req, res) => {
  const userId = req.user.id

  try {
    const address = await Address.findOne({ user: userId })
    if (address) {
      res.status(200).json({
        message: 'Address fetched successfully',
        success: true,
        address,
      })
    } else {
      res.status(200).json({
        message: 'no address found',
        success: false,
        address: [],
      })
    }
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch address',
      success: false,
      error: error.message,
    })
  }
})

//@desc Add Address
//route POST/api/v1/address/add
//@access Private
const addAddress = asyncHandler(async (req, res) => {
  const userId = req.user.id
  if (!userId) {
    res.status(400).json({
      message: 'User not authenticated',
      success: false,
    })
  }

  const { addressDetails } = req.body

  if (!addressDetails) {
    res.status(400).json({
      message: 'Address required',
      success: false,
    })
  }
  try {
    const address = await Address.create({
      user: userId,
      addressDetails,
    })

    res.status(201).json({
      message: 'Address added successfully',
      success: true,
      address,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Failed to add address',
      success: false,
      error: error.message,
    })
  }
})

//@desc Update user address
//@route PUT/api/v1/address/update
//@access private
const updateAddress = asyncHandler(async (req, res) => {
  const userId = req.user.id
  if (!userId) {
    res.status(400).json({
      message: 'User not authenticated',
      success: false,
    })
  }

  const { addressDetails } = req.body
  console.log('recieved new address' + addressDetails)

  if (!addressDetails) {
    res.status(400).json({
      message: 'address data is required',
      success: false,
    })
  }
  try {
    const address = await Address.findOne({ user: userId })
    if (!address) {
      res.status(404).json({
        message: 'Address not found',
        success: false,
      })
    } else {
      address.addressDetails = addressDetails
      const updatedAddress = await address.save()
      res.status(200).json({
        message: 'Address updated successfully',
        success: true,
        updatedAddress,
      })
    }
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update the address',
      success: false,
      error: error.message,
    })
  }
})

export { fetchAddress, addAddress, updateAddress }
