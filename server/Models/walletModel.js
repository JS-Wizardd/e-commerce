import mongoose from 'mongoose'

const walletSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    balance: { type: Number, default: 0 },
    history: {
      type: [
        {
          amount: { type: Number, required: true },
          date: {
            type: Date,
            default: Date.now,
          },
          type: {
            type: String,
            required: true,
            enum: ['addition', 'deduction'],
          },
          orderDetails: [
            { type: mongoose.Schema.Types.ObjectId, ref: 'Orders' },
          ],
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
)

const Wallet = mongoose.model('Wallet', walletSchema)
export default Wallet
