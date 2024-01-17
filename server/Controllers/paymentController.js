import asyncHandler from 'express-async-handler'
import Cart from '../Models/cartModel.js'
import Order from '../Models/ordersModel.js'
import Product from '../Models/productModel.js'
import Address from '../Models/addressModel.js'
import Wallet from '../Models/walletModel.js'
import Transaction from '../Models/transactionModel.js'
import User from '../Models/userModel.js'
import { createOrderFn } from '../Utils/razorpay.js'
import { orderSuccessMail } from '../Utils/nodemailer.js'

//@desc Place the order
//@route POST/api/v1/payment/new-order
//@access private
const createOrder = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id
    const { useWallet } = req.body

    const cart = await Cart.findOne({ user: userId })

    // console.log('cart: ', cart)

    if (!cart) {
      return res.status(404).json({ success: false, error: 'Cart not found.' })
    }

    const address = await Address.findOne({ user: userId })

    if (!address) {
      return res
        .status(404)
        .json({ success: false, error: 'Address not found.' })
    }

    const products = cart.products.map((item) => ({
      product: item.product,
      quantity: item.quantity,
    }))

    const wallet = await Wallet.findOne({ userId })

    let total = cart.totalPrice
    let deductionAmount = 0

    if (useWallet && wallet) {
      if (total > wallet.balance) {
        deductionAmount = wallet.balance
        total -= wallet.balance
        wallet.balance = 0
      } else {
        deductionAmount = total
        wallet.balance -= total
        total = 0
      }
    }

    const order = await createOrderFn(total)

    if (!order) {
      return res
        .status(500)
        .json({ success: false, error: 'Failed to create the order.' })
    }

    const newOrder = new Order({
      userId: userId,
      orderId: order.id,
      products: products,
      shippingAddress: address,
      total: total,
      status: 'Pending',
    })
    const savedOrder = await newOrder.save()
    if (useWallet && wallet) {
      wallet.history.push({
        amount: deductionAmount,
        type: 'deduction',
        orderDetails: savedOrder._id,
      })
    }
    await wallet.save()

    res.status(200).json({
      message: 'order created successfully',
      success: true,
      savedOrder,
    })
  } catch (error) {
    console.error('server error in the create order controller : ', error)
  }
})

//@desc confirm payment
//@route POST/api/v1/payment/pay
//@access private
const confirmPayment = asyncHandler(async (req, res) => {
  try {
    const { orderId, paymentId } = req.body
    const userId = req.user.id

    const order = await Order.findOne({ orderId }).populate('products.product')

    const user = await User.findById(userId)

    if (order) {
      order.status = 'Placed'
      await order.save()

      for (const item of order.products) {
        const product = item.product
        const orderedQty = item.quantity

        const fetchedProduct = await Product.findById(product._id)

        if (fetchedProduct) {
          fetchedProduct.stock -= orderedQty
          await fetchedProduct.save()
        }
      }

      const transaction = new Transaction({
        userId: order.userId,
        amount: order.total,
        type: 'Credit',
        paymentId: paymentId,
        orderId: orderId,
        status: 'success',
      })
      const savedTransaction = await transaction.save()

      // nodemailer custom function
      await orderSuccessMail(user.email, order)

      res.status(200).json({
        success: true,
        message: 'Payment successful',
        savedTransaction,
      })
    } else {
      res.status(404).json({
        success: false,
        error: 'Order not found',
      })
    }
  } catch (error) {
    console.error('Something went wrong during payment: ', error)
    res.status(500).json({
      success: false,
      error: 'Something went wrong during payment',
    })
  }
})

export { createOrder, confirmPayment }
