import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderId: {
      type: String,
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
    date: {
      type: Date,
      default: Date.now,
    },
    shippingAddress: {
      type: Object,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    paymentMethod: String,
    status: {
      type: String,
      enum: ['Pending', 'Placed', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Placed',
    },
    delivery: {
      type: Date,
      default: function () {
        return new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
      },
    },
    isCancelled: {
      type: Boolean,
      default: false,
    },
    reason: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
)

const Order = mongoose.model('Orders', orderSchema)
export default Order
