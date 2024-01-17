import express from 'express'
const router = express.Router()

import validateToken from '../Middlewares/authMiddleware.js'

import {
  createOrder,
  confirmPayment,
} from '../Controllers/paymentController.js'

router.post('/new-order', validateToken, createOrder)
router.post('/pay', validateToken, confirmPayment)

export { router as paymentRouter }
