import asyncHandler from 'express-async-handler'
import dotenv from 'dotenv'
dotenv.config()
import User from '../Models/userModel.js'
import Product from '../Models/productModel.js'
import Review from '../Models/reviewsModel.js'

//@desc Get Reviews for a Specific Product
//@route GET/api/v1/products/:id/reviews
//@access public
const getProductReviews = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?.id
    const { id } = req.params
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required',
      })
    }

    const reviews = await Review.find({ product: id })

    const product = await Product.findById(id)
    const { avgRating, numOfReviews } = product

    res.status(200).json({
      success: true,
      message: 'Reviews fetched successfully',
      reviews,
      avgRating,
      numOfReviews,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Could not fetch Reviews: ' + error.message,
    })
  }
})

//@desc Add a review to  product
//@route POST /api/v1/reviews/add-review/:productId
//@access Private
const addReview = asyncHandler(async (req, res) => {
  const { productId } = req.params
  const { rating, review } = req.body
  const userId = req.user.id

  try {
    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      })
    }

    const existingReview = await Review.findOne({
      user: userId,
      product: productId,
    })
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product',
      })
    }

    const user = await User.findById(userId)

    const newReview = await Review.create({
      user: userId,
      product: productId,
      name: user.name,
      rating,
      review,
    })

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      review: newReview,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding review: ' + error.message,
    })
  }
})

//@desc Delete a review
//@route DELETE /api/v1/reviews/delete-review/:reviewId
//@access Private
const deleteReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params
  const userId = req.user.id

  try {
    const review = await Review.findById(reviewId)

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      })
    }
    if (review.user.toString() !== userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized to this review',
      })
    }

    const productId = review.product

    await Review.deleteOne({ _id: reviewId })

    const reviewsForProduct = await Review.find({ product: productId })
    let avgRating = 0
    let numOfReviews = 0

    if (reviewsForProduct.length > 0) {
      const totalRatings = reviewsForProduct.reduce(
        (total, review) => total + review.rating,
        0
      )

      avgRating = totalRatings / reviewsForProduct.length
      numOfReviews = reviewsForProduct.length
    }

    await Product.findByIdAndUpdate(
      productId,
      { avgRating, numOfReviews },
      { new: true }
    )
    res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: 'Error deleting review: ' + error.message,
    })
  }
})
export { getProductReviews, addReview, deleteReview }
