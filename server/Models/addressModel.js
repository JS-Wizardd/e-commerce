import mongoose from 'mongoose'

const addressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  addressDetails: {
    address: { type: String, required: true },
    street: {
      type: String,
      required: true,
    },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pin: {
      type: Number,
      required: true,
    },
  },
})

const Address = mongoose.model('Address', addressSchema)
export default Address
