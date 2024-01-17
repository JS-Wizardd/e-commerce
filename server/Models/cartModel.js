import mongoose from 'mongoose'

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    totalPrice: {
      type: Number,
      default: 0,
    },
    totalQuantity: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

cartSchema.pre('save', async function (next) {
  const productPrices = await Promise.all(
    this.products.map(async (item) => {
      const product = await mongoose.model('Product').findById(item.product)
      return product.price * item.quantity
    })
  )

  this.totalPrice = productPrices.reduce((total, price) => total + price, 0)

  this.totalQuantity = this.products.reduce(
    (total, item) => total + item.quantity,
    0
  )

  next()
})

const Cart = mongoose.model('Cart', cartSchema)
export default Cart
