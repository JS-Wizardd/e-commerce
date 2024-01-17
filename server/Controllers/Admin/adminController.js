import asyncHandler from 'express-async-handler'
import {
  generateCategoryStats,
  generateIncomePerDayStats,
  generateSalesPerModelStats,
  newUsersPerDayStats,
} from '../../Helpers/dashboard.js'

//@desc Get Sales per Category stats
//@routes GET /api/v1/admin/stats/sales-per-category
//@access Private
const getCategoryStats = asyncHandler(async (req, res) => {
  try {
    const categoryStats = await generateCategoryStats()
    // console.log(categoryStats)
    res
      .status(200)
      .json({ message: 'category stats fetched', success: true, categoryStats })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error', success: false })
  }
})

//@desc Get Income per Day stats
//@routes GET /api/v1/admin/stats/income-per-day
//@access Private
const getIncomePerDayStats = asyncHandler(async (req, res) => {
  try {
    const incomeStats = await generateIncomePerDayStats()
    res.status(200).json({
      message: 'Income per day stats fetched',
      success: true,
      incomeStats,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error', success: false })
  }
})

//@desc Get Users per day stats
//@routes GET /api/v1/admin/stats/users-per-day
//@access Private
const getNewUsersPerDayStats = asyncHandler(async (req, res) => {
  try {
    const userStats = await newUsersPerDayStats()
    res.status(200).json({
      message: 'Users per day stats fetched',
      success: true,
      userStats,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error', success: false })
  }
})

//@desc Get sales per model(top 5)
//@routes GET /api/v1/admin/stats/users-per-day
//@access Private
const getSalesPerDayStats = asyncHandler(async (req, res) => {
  try {
    const salesPerModal = await generateSalesPerModelStats()
    res.status(200).json({
      message: 'Sales per model stats fetched',
      success: true,
      salesPerModal,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error', success: false })
  }
})
export {
  getCategoryStats,
  getIncomePerDayStats,
  getNewUsersPerDayStats,
  getSalesPerDayStats,
}
