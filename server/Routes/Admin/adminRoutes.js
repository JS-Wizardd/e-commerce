import express from 'express'
const router = express.Router()
import { isAdmin } from '../../Middlewares/isAdminMiddleware.js'
import upload from '../../Middlewares/uploadMiddleware.js'

//user controllers imports
import {
  searchUser,
  adminLogin,
  adminLogout,
  updateUserStatus,
  viewAllUsers,
  fetchAdmins,
  updateStatus,
  searchSuggestion,
} from '../../Controllers/Admin/adminUserController.js'

//product controllers imports
import {
  addProduct,
  updateProduct,
  toggleSoftDelete,
} from '../../Controllers/Admin/adminProductController.js'

//order controllers import
import {
  updateOrderStatus,
  viewOrders,
} from '../../Controllers/Admin/adminOrderController.js'
import { getProfile } from '../../Controllers/userController.js'

//admin general controllers input
import {
  getCategoryStats,
  getIncomePerDayStats,
  getNewUsersPerDayStats,
  getSalesPerDayStats,
} from '../../Controllers/Admin/adminController.js'

//admin routes
router.post('/login', adminLogin)
router.post('/logout', adminLogout)
router.get('/profile', isAdmin, getProfile)

// admin dashboard
router.get('/stats/sales-per-category', isAdmin, getCategoryStats)
router.get('/stats/income-per-day', isAdmin, getIncomePerDayStats)
router.get('/stats/users-per-day', isAdmin, getNewUsersPerDayStats)
router.get('/stats/sales-per-model', isAdmin, getSalesPerDayStats)

//admin-product routes
router.post('/add-product', isAdmin, upload.array('images', 4), addProduct)
router.put(
  '/update-product/:id',
  isAdmin,
  upload.array('images', 4),
  updateProduct
)
router.patch('/toggle-soft-delete/:id', isAdmin, toggleSoftDelete)

//admin-user routes
router.patch('/update-user-status/:id', isAdmin, updateUserStatus)
router.get('/view-all-users', isAdmin, viewAllUsers)
router.get('/admins', isAdmin, fetchAdmins)
router.put('/update-status/:id', isAdmin, updateStatus)
router.get('/search-user', isAdmin, searchUser)
router.get('/search-suggestion', isAdmin, searchSuggestion)

//admin order routes
router.get('/orders', isAdmin, viewOrders)
router.put('/orders/update-status/:orderId', isAdmin, updateOrderStatus)

export { router as adminRouter }
