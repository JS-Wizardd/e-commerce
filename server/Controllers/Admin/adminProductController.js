import asyncHandler from 'express-async-handler'
import dotenv from 'dotenv'
dotenv.config()
import Product from '../../Models/productModel.js'

//@desc Add Product
//@route POST/api/v1/admin/add-product
//@access private
const addProduct = asyncHandler(async (req, res) => {
  const { name, category, brand, description, price, stock, discount } =
    req.body

  if (!name || !category || !brand || !description || !price || !stock) {
    return res.status(400).json({
      errorType: 'MissingFields',
      message: 'All fields are mandatory',
      success: false,
    })
  }

  // console.log(req.files)

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'At least one image is required' })
  }

  const images = req.files.map((file) => file.path)

  // console.log(name, category, brand, description, price, stock, images)

  const product = new Product({
    name,
    category,
    brand,
    description,
    discount,
    price,
    stock,
    images: images,
  })

  try {
    const result = await product.save()

    return res.status(201).json({
      message: 'Product created successfully',
      success: true,
      product: result,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      errorType: 'ServerError',
      message: 'Server error',
      success: false,
    })
  }
})

//@desc UPDATE Specific Products
//@route PUT/api/v1/admin/update-product/:id
//@access private
const updateProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params
    const {
      name,
      category,
      brand,
      description,
      price,
      stock,
      discount,
      year,
      image,
    } = req.body

    // console.log('image: ', image)

    const images = req.files.map((file) => file.path)

    let combinedImages

    if (Array.isArray(image)) {
      combinedImages = [...image, ...images]
    } else {
      combinedImages = [image, ...images]
    }

    // console.log('combined :', combinedImages)

    const existingProduct = await Product.findById(id)

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      })
    }

    existingProduct.name = name || existingProduct.name
    existingProduct.description = description || existingProduct.description
    existingProduct.price = price || existingProduct.price
    existingProduct.category = category || existingProduct.category
    existingProduct.year = year || existingProduct.year
    existingProduct.brand = brand || existingProduct.brand
    existingProduct.stock = stock || existingProduct.stock
    existingProduct.discount = discount || existingProduct.discount
    existingProduct.images = combinedImages || existingProduct.images

    const updatedProduct = await existingProduct.save()

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Could not update product: ' + error,
    })
  }
})

//@desc Handle soft delete of product
//@route PUT /api/v1/admin/toggle-soft-delete/:id
//@access private
const toggleSoftDelete = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params

    const existingProduct = await Product.findById(id)

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      })
    }

    existingProduct.softDelete = !existingProduct.softDelete

    const updatedProduct = await existingProduct.save()

    res.status(200).json({
      success: true,
      message: 'Product soft-deleted successfully',
      product: updatedProduct,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Could not soft-delete product: ' + error,
    })
  }
})

export { addProduct, updateProduct, toggleSoftDelete }
