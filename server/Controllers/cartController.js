import asyncHandler from 'express-async-handler'
import dotenv from 'dotenv'
import Cart from '../Models/cartModel.js'
dotenv.config()
import Product from '../Models/productModel.js'

//@desc Get all cart items
//@route GET/api/v1/cart/view-cart
//@access Private
const viewCart = asyncHandler(async (req, res) => {
  const userId = req.user.id

  const cartItems = await Cart.findOne({ user: userId })
    .populate('products.product')
    .exec()

  if (!cartItems || cartItems.products.length === 0) {
    return res.status(200).json({
      message: 'Your cart is empty',
      cart: false,
      success: true,
    })
  }

  res.status(200).json({
    cartItems,
    cart: true,
    success: true,
    message: 'Cart found successfully',
  })
})

//@desc Add product to the cart
//@route POST/api/v1/cart/add
//@access Private
const addToCart = asyncHandler(async (req, res) => {
  const { productId } = req.params
  const userId = req.user.id

  if (!productId) {
    return res.status(400).json({
      message: 'Invalid product details',
      success: false,
    })
  }

  try {
    let userCart = await Cart.findOne({ user: userId })
    if (!userCart) {
      userCart = await Cart.create({ user: userId, products: [] })
    }

    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({
        message: 'Product not found',
        success: false,
      })
    }

    const existingProduct = userCart.products.find((item) =>
      item.product.equals(productId)
    )

    if (existingProduct) {
      existingProduct.quantity += 1
    } else {
      userCart.products.push({
        product: productId,
        quantity: 1,
      })
    }

    userCart.totalPrice = userCart.products.reduce((total, item) => {
      const productPrice = product.price * item.quantity
      return total + productPrice
    }, 0)

    userCart.totalQuantity = userCart.products.reduce(
      (total, item) => total + item.quantity,
      0
    )

    const newCart = await userCart.save()

    res.status(200).json({
      message: 'Product added to the cart successfully',
      success: true,
      cart: newCart,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
      success: false,
    })
  }
})

//@desc Update quantity of a product in the cart
//@route PUT/api/v1/cart/update
//@access Private
const updateCart = asyncHandler(async (req, res) => {
  const { productId } = req.params
  const userId = req.user.id
  const { action } = req.body

  // console.log(action)

  if (!productId || !action) {
    return res.status(400).json({
      message: 'Invalid product details or actions',
      success: false,
    })
  }

  try {
    let userCart = await Cart.findOne({ user: userId }).populate(
      'products.product'
    )
    if (!userCart || !userCart.products || userCart.products.length === 0) {
      return res.status(404).json({
        message: 'Cart not found or is empty',
        success: false,
      })
    }

    const existingProduct = userCart.products.find((item) =>
      item.product.equals(productId)
    )

    if (!existingProduct) {
      return res.status(404).json({
        message: 'Product not found in the cart',
        success: false,
      })
    }

    if (action === 'inc') {
      existingProduct.quantity += 1
    } else if (action === 'dec' && existingProduct.quantity > 1) {
      existingProduct.quantity -= 1
    }

    userCart.totalPrice = userCart.products.reduce((total, item) => {
      const productPrice = item.product.price * item.quantity
      return total + productPrice
    }, 0)

    userCart.totalQuantity = userCart.products.reduce(
      (total, item) => total + item.quantity,
      0
    )

    const cart = await userCart.save()

    res.status(200).json({
      message: 'Cart qty updated successfully',
      success: true,
      cart,
      updatedQty: existingProduct.quantity,
      totalQuantity: userCart.totalQuantity,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: 'Internal server error',
      success: false,
    })
  }
})

//@desc Delete a product from the cart
//@route PATCH /api/v1/cart/delete/:productId
//@access Private
const deleteCartItem = asyncHandler(async (req, res) => {
  const { productId } = req.params
  const userId = req.user.id

  if (!productId) {
    return res.status(400).json({
      message: 'Invalid product details',
      success: false,
    })
  }

  try {
    let userCart = await Cart.findOne({ user: userId }).populate(
      'products.product'
    )

    if (!userCart || !userCart.products || userCart.products.length === 0) {
      return res.status(404).json({
        message: 'Cart not found or is empty',
        success: false,
      })
    }

    const existingProductIndex = userCart.products.findIndex((item) =>
      item.product.equals(productId)
    )

    if (existingProductIndex === -1) {
      return res.status(404).json({
        message: 'Product not found in the cart',
        success: false,
      })
    }

    // Remove the product from the array
    userCart.products.splice(existingProductIndex, 1)

    userCart.totalPrice = userCart.products.reduce((total, item) => {
      const productPrice = item.product.price * item.quantity
      return total + productPrice
    }, 0)

    userCart.totalQuantity = userCart.products.reduce(
      (total, item) => total + item.quantity,
      0
    )

    const cart = await userCart.save()

    res.status(200).json({
      message: 'Product removed from the cart successfully',
      success: true,
      cart,
      totalQuantity: userCart.totalQuantity,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: 'Internal server error',
      success: false,
    })
  }
})

export { viewCart, addToCart, updateCart, deleteCartItem }
