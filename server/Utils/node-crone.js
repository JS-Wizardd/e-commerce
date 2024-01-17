import cron from 'node-cron'
import Order from '../Models/ordersModel.js'

const deleteOrders = () => {
  cron.schedule('0 * * * * *', async () => {
    try {
      await Order.deleteMany({
        status: 'Pending',
      })
    } catch (error) {
      console.error('Error deleting pending orders:', error)
    }
  })
}

export { deleteOrders }
