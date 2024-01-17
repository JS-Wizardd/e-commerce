import razorpay from 'razorpay'
import { randomUUID } from 'crypto'

const instance = new razorpay({
  key_id: process.env.RZP_ID,
  key_secret: process.env.RZP_KEY,
})

const createOrderFn = async (amt) => {
  let options = {
    amount: amt * 100,
    currency: 'INR',
    receipt: `order_${randomUUID().split('_')[0].substring(0, 30)}`,
  }

  let order = await new Promise((resolve, reject) => {
    instance.orders.create(options, function (err, response) {
      if (err) {
        reject(err)
      } else {
        resolve(response)
      }
    })
  })

  return order
}

export { createOrderFn }
