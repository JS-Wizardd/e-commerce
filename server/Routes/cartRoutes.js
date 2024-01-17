import express from 'express'
const router = express.Router()

import validateToken from '../Middlewares/authMiddleware.js'
import {
  viewCart,
  addToCart,
  updateCart,
  deleteCartItem,
} from '../Controllers/cartController.js'

router.get('/view-cart', validateToken, viewCart)
router.post('/add/:productId', validateToken, addToCart)
router.put('/update/:productId', validateToken, updateCart)
router.patch('/delete/:productId', validateToken, deleteCartItem)

export { router as cartRouter }
