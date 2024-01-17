import express from 'express'
const router = express.Router()
import validateToken from '../Middlewares/authMiddleware.js'

import {
  fetchAddress,
  addAddress,
  updateAddress,
} from '../Controllers/addressController.js'

router.get('/', validateToken, fetchAddress)
router.post('/add', validateToken, addAddress)
router.put('/update', validateToken, updateAddress)

export { router as addressRouter }
