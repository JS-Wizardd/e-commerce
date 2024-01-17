import express from 'express'
const router = express.Router()

import validateToken from '../Middlewares/authMiddleware.js'

import {
  addReview,
  deleteReview,
  getProductReviews,
} from '../Controllers/reviewController.js'

router.post('/add-review/:productId', validateToken, addReview)
router.get('/:id', getProductReviews)
router.delete('/delete-review/:reviewId', validateToken, deleteReview)

export { router as reviewRouter }
