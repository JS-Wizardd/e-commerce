import mongoose from 'mongoose'

const transactionsSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    paymentId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
    },
    status: {
      type: String,
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
)

const Transaction = mongoose.model('Transaction', transactionsSchema)
export default Transaction
