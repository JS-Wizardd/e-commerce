import express from 'express'
const router = express.Router()
import validateToken from '../Middlewares/authMiddleware.js'
import { cancelOrder, getOrders } from '../Controllers/ordersController.js'

router.get('/', validateToken, getOrders)
router.post('/cancel/:orderId', validateToken, cancelOrder)

export { router as ordersRouter }
