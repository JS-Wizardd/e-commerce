import mongoose from 'mongoose'
import { deleteOrders } from '../Utils/node-crone.js'

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URL)

    console.log(`MongoDB connected : ${connect.connection.name}`)

    deleteOrders()

    connect.connection.on('error', (err) => {
      console.error(`MongoDB connection error : ${err}`)
    })
  } catch (error) {
    console.error(`Database Error: ${error.message}`)
    process.exit(1)
  }
}

export default connectDB
