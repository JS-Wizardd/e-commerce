import axios from 'axios'

const filterProducts = async (page, filters) => {
  const { category, year, sortBy, sortOrder } = filters

  let apiUrl = `/products/filter/?page=${page}`

  if (category) {
    apiUrl += `&category=${category}`
  }

  if (year) {
    apiUrl += `&year=${year}`
  }

  if (sortBy) {
    apiUrl += `&sortBy=${sortBy}&sortOrder=${sortOrder || 'asc'}`
  }

  try {
    const { data } = await axios.get(apiUrl)
    return data
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

const handleToggleDelete = async (id) => {
  try {
    const { data } = await axios.patch(`/admin/toggle-soft-delete/${id}`)
    if (await data) return data
  } catch (error) {
    console.error('Error handling delete', error)
    return { success: false, error: 'Something went wrong' }
  }
}

const fetchCart = async () => {
  try {
    const { data } = await axios.get('/cart/view-cart')
    if (data.success && data.cart) {
      return {
        success: data.success,
        cart: data.cartItems.products,
        totalPrice: data.cartItems.totalPrice,
        totalQuantity: data.cartItems.totalQuantity,
      }
    } else if (data.success && !data.cart) {
      return {
        success: data.success,
        cart: [],
        totalPrice: 0,
        totalQuantity: 0,
      }
    }
  } catch (error) {
    console.error('Error fetching cart:', error)
  }
}

//search navbar
const searchProductApi = async (search) => {
  try {
    const { data } = await axios.get(
      `/products/searchProduct?productName=${search}`
    )
    return data
  } catch (error) {
    console.error('Error fetching product:', error)
    return { error: error.message }
  }
}

export { filterProducts, handleToggleDelete, fetchCart, searchProductApi }
