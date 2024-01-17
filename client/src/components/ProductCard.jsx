import { motion } from 'framer-motion'
import { COLORS } from '../styles/color'
import { Link, useNavigate } from 'react-router-dom'
import { Rate } from 'antd'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setCart } from '../slices/cartSlice'
import LoginToContinue from './modals/LoginModal'
import { useState } from 'react'

const ProductCard = ({ product, isLoggedIn, setLoginModal }) => {
  const {
    _id,
    name,
    discount,
    price,
    images = [],
    stock,
    numOfReviews,
    avgRating,
  } = product

  const transition = { type: 'spring', duration: 0.3 }

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const addToCart = async () => {
    if (!isLoggedIn) {
      setLoginModal(true)
      return
    } else {
      try {
        const { data } = await axios.post(`/cart/add/${_id}`)
        console.log(data)
        if (data.success) {
          console.log('Product added to the cart successfully!')
          dispatch(setCart(data.cart))
          navigate('/cart')
        } else {
          alert(`add to cart failed`)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  return (
    <>
      <motion.div
        initial={{ scale: 0.8, opacity: 0.8 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ ...transition, type: 'tween' }}
        whileHover={{
          scale: 1.02,
          transition: { duration: 0.05 },
        }}
        whileTap={{ scale: 0.95 }}
        className="relative -mb-2  mx-auto m-10 flex w-full my-0 sm:my-2 lg:my-4  flex-col overflow-hidden rounded-lg border border-gray-100 h-92 sm:h-[470px] px-2 pb-5 whitespace-nowrap bg-white shadow-md hover:shadow-2xl  "
      >
        {discount > 0 && (
          <div className="absolute -top-3 -right-3 ">
            <img
              src="../../assets/icons/discount.png"
              alt="discount"
              className=" w-16"
            />
            <p className="absolute rotate-12 text-xl top-5 left-3 text-white font-semibold">
              -{discount}%
            </p>
          </div>
        )}
        {/* Link to the product details page */}
        <Link
          to={`/product/${_id}`}
          className="h-full flex justify-evenly items-center sm:flex-col"
        >
          <div className="relative mx-3 p-2 mt-3 max-sm:w-2/5 flex justify-center h-52 sm:h-60 overflow-hidden rounded-xl ">
            <img src={images[0]} className="object-contain" />
          </div>

          {/* Bottom  */}
          <div className="flex flex-col max-w-full px-3   my-4 sm:my-auto ">
            <p className="text-lg sm:text-xl my-2 whitespace-nowrap  overflow-hidden text-ellipsis">
              {name}
            </p>
            <div className="flex  gap-x-3 ">
              <Rate allowHalf defaultValue={avgRating} disabled />
              <p className="text-sm font-medium text-slate-600 opacity-80">
                ({numOfReviews})
              </p>
            </div>

            {/* price */}
            {discount && discount > 0 ? (
              <div className="flex  mt-3 gap-y-0 mb-2">
                <div className="flex">
                  <p className="font-semibold">{'\u20B9 '}</p>
                  <p className="text-2xl sm:text-3xl  font-bold text-slate-900">{`${Math.round(
                    (price * (100 - Number(discount))) / 100
                  )}`}</p>
                </div>
                <div className="flex mt-3 ml-3 text-gray-600 line-through">
                  <p className="font-medium text-xs">{'\u20B9 '}</p>
                  <p className="text-sm sm:text-md  font-medium  h-3 ">{`${price}`}</p>
                </div>
              </div>
            ) : (
              <div className="flex">
                <p className="mt-2 font-semibold">{'\u20B9 '}</p>
                <p className="text-2xl sm:text-3xl my-2 font-bold text-slate-900">
                  {price.toLocaleString('en-IN')}
                </p>
              </div>
            )}

            <p
              className={`${
                stock < 5 ? 'text-red-500' : 'text-violet-500'
              } text-sm whitespace-nowrap mb-2`}
            >
              {stock < 5
                ? stock < 1
                  ? 'Stock Out'
                  : `Hurry, only ${stock} left!`
                : 'Available'}
            </p>
          </div>
        </Link>

        {/* Add to cart button */}
        <motion.button
          whileHover={{
            scale: 1.03,
            transition: { duration: 0.1 },
          }}
          whileTap={{ scale: 1 }}
          className="items-center hidden sm:flex justify-center rounded-md  px-5 mx-3 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4 focus:ring-blue-300 hover:text-md bg-secondary"
          onClick={addToCart}
        >
          Add to cart
        </motion.button>
      </motion.div>
    </>
  )
}
export default ProductCard
