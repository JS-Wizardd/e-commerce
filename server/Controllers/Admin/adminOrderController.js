import asyncHandler from 'express-async-handler'
import Orders from '../../Models/ordersModel.js'

//@desc Admin view orders
//@route GET /api/v1/admin/orders
//@access Private
const viewOrders = asyncHandler(async (req, res) => {
  const { status } = req.query

  try {
    const orders = await Orders.find({ status })
      .sort({ createdAt: -1 })
      .populate('products.product')
      .exec()
    // console.log(orders)
    res.status(200).json({
      message: 'Admin orders fetched successfully',
      success: true,
      orders,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'server error while fetching admin orders',
      error: error.message,
    })
  }
})

//@desc Update order status
//@routes PUT/api/v1/admin/orders/update-status/:orderId
//@access Private
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params
  const { newStatus } = req.body
  // console.log(orderId, newStatus)
  try {
    const order = await Orders.findById(orderId)

    if (!order) {
      return res
        .status(404)
        .json({ message: 'Order not found', success: false })
    }

    order.status = newStatus
    await order.save()
    res.status(200).json({
      message: 'Order status updated successfully',
      success: true,
      order,
    })
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ message: 'Internal server error', success: false })
  }
})

export { viewOrders, updateOrderStatus }
