import mongoose from 'mongoose'
import Product from './productModel.js'

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      enum: [1, 2, 3, 4, 5],
    },
    review: {
      type: String,
      required: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
)

reviewSchema.post(
  'save',
  { document: true, query: false },
  async function (review) {
    try {
      const product = await Product.findById(review.product)
      if (!product) {
        return
      }

      const reviews = await Review.find({ product: product._id })
      const totalRatings = reviews.reduce(
        (total, review) => total + review.rating,
        0
      )
      product.avgRating = totalRatings / reviews.length
      product.numOfReviews = reviews.length
      await product.save()
    } catch (error) {
      console.error(error)
    }
  }
)

const Review = mongoose.model('Review', reviewSchema)

export default Review
