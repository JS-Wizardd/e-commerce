import { useState } from 'react'
import { Link } from 'react-router-dom'
import Loading from './Loading'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { updateCart } from '../slices/cartSlice'
import { deleteCartItem } from '../slices/cartSlice'

const CartCard = ({ product }) => {
  const { _id, name, price, images } = product.product

  const [quantity, setQuantity] = useState(product.quantity)
  const [isUpdating, setIsUpdating] = useState(false)

  const dispatch = useDispatch()

  const qtyClass =
    'w-8 h-7 text-2xl text-center flex items-center justify-center rounded-md font-semibold  bg-violet-300 active:scale-95 transition-all'

  const updateQty = async (action) => {
    setIsUpdating(true)

    if ((action === 'dec' && quantity > 1) || action === 'inc') {
      try {
        const { data } = await axios.put(`/cart/update/${_id}`, { action })

        if (data.success) {
          dispatch(
            updateCart({
              product: _id,
              act: action,
              totalPrice: data.cart.totalPrice,
              totalQuantity: data.totalQuantity,
            })
          )
          setQuantity(data.updatedQty)
        } else {
          alert('Cart quantity update failed')
          setQuantity((prev) => prev)
        }
      } catch (error) {
        console.error('Error updating quantity:', error)
      } finally {
        setIsUpdating(false)
      }
    }
  }

  const deleteProduct = async () => {
    setIsUpdating(true)
    try {
      const { data } = await axios.patch(`/cart/delete/${_id}`)
      // console.log(data)

      if (data.success) {
        dispatch(
          deleteCartItem({
            productId: _id,
            cart: data.cart.products,
            totalQuantity: data.totalQuantity,
            totalPrice: data.cart.totalPrice,
          })
        )
        setIsUpdating(false)
      } else {
        alert('Failed to delete product from the cart')
        setIsUpdating(false)
      }
    } catch (error) {
      console.error('Error deleting product', error)
      setIsUpdating(false)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div
      className={`flex max-h-fit cursor-pointer h-28 max-sm:h-32 mb-3 rounded-lg border-violet-100 p-2 border  transition-all justify-between w-full lg:w-[90%] xl:w-[80%] ${
        isUpdating && 'cursor-wait'
      }`}
    >
      {/* left */}
      {isUpdating && <Loading />}
      {images.length > 0 && (
        <div className="w-1/5 flex bg-white justify-center rounded-md h-full p-2">
          <img
            src={images[0]}
            alt="cart product image"
            className="object-contain max-h-full"
          />
        </div>
      )}
      {/* middle */}
      <div className="flex ml-3 items-start mr-auto  flex-col w-3/6 border-r  p-3">
        {/* middle top */}
        <Link to={`/product/${_id}`}>
          <p className="text-xl  font-medium   my-auto ">{name}</p>
        </Link>
        {/* middle bottom */}
        <div className="flex gap-x-12 max-md:gap-x-5 h-8 mt-auto w-full  ">
          <div className="flex justify-between w-28 rounded bg-violet-100  items-center">
            {/* quantity button */}
            <button
              className={`${qtyClass} ${quantity <= 1 && 'cursor-not-allowed'}`}
              disabled={quantity <= 1}
              onClick={() => updateQty('dec')}
            >
              -
            </button>
            <p className="w-3/4 text-center font-medium">Qty: {quantity}</p>
            <button className={`${qtyClass}`} onClick={() => updateQty('inc')}>
              +
            </button>
          </div>
          <button
            onClick={deleteProduct}
            className="transition-transform hover:scale-105 rounded-lg active:scale-95"
          >
            <img
              src="/delete.png"
              alt="delete product icon"
              className="object-contain max-h-full scale-90"
            />
          </button>
        </div>
      </div>
      {/* right */}
      <div className="w-2/6 lg:w-1/6 flex flex-col whitespace-nowrap bg-violet-100 rounded-lg justify-center items-center gap-y-3">
        <div className="text-md text-gray-700 font-medium">
          {quantity} x {price}
        </div>
        <div className="text-lg md:text-xl font-semibold">
          {quantity * price} /-
        </div>
      </div>
    </div>
  )
}
export default CartCard
