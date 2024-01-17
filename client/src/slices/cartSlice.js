import { createSlice } from '@reduxjs/toolkit'

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartItems: [],
    totalQuantity: 0,
    totalPrice: 0,
  },
  reducers: {
    setCart: (state, action) => {
      const { cart, totalQuantity, totalPrice } = action.payload
      state.cartItems = cart
      state.totalQuantity = totalQuantity
      state.totalPrice = totalPrice
    },

    updateCart: (state, action) => {
      const { product, act, totalPrice, totalQuantity } = action.payload
      const existItem = state.cartItems.find((x) => x.product === product)

      if (existItem && act === 'inc') {
        existItem.quantity += 1
      } else if (existItem && act === 'dec' && existItem.quantity > 1) {
        existItem.quantity - +1
      }

      state.totalPrice = totalPrice
      state.totalQuantity = totalQuantity
    },
    deleteCartItem: (state, action) => {
      const { cart, totalQuantity, totalPrice } = action.payload

      state.cartItems = cart
      state.totalQuantity = totalQuantity
      state.totalPrice = totalPrice
    },
  },
})

export const { setCart, updateCart, deleteCartItem } = cartSlice.actions

export default cartSlice.reducer
