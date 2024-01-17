import { motion } from 'framer-motion'
import { useState } from 'react'
import { COLORS } from '../../styles/color'
import { Link, useNavigate } from 'react-router-dom'
import HomeProductSkelton from '../skeltons/HomeProductSkelton'
import NavigationIcon from '@mui/icons-material/Navigation'

import AddProduct from './AddProduct'
import Loading from '../Loading'
import { Rate } from 'antd'
import { handleToggleDelete } from '../../api'
import DeleteModal from '../modals/DeleteModal'

const AdminProductCard = ({
  product,
  pageLoading,
  modal,
  setModal,
  setIsDeleting,
  isDeleting,
}) => {
  const [deleteModal, setDeleteModal] = useState(false)
  const [localSoftDelete, setLocalSoftDelete] = useState(product.softDelete)

  const navigate = useNavigate()

  const {
    _id,
    name,
    category,
    brand,
    description,
    price,
    softDelete,
    discount,
    images,
    stock,
    numOfReviews,
    avgRating,
    reviews,
  } = product

  const toggleDelete = async (prodId) => {
    setDeleteModal(false)
    setIsDeleting(true)

    try {
      setLocalSoftDelete(!localSoftDelete)
      const data = await handleToggleDelete(_id)

      if (data.success) {
        setIsDeleting(false)
        alert('product recycled successfully')
      } else {
        setLocalSoftDelete(!localSoftDelete)
        setDeleteModal(false)
        setIsDeleting(false)
        alert(`Product recycle failed!`)
      }
    } catch (error) {
      setIsDeleting(false)
      alert(`Something went wrong while attempting recycling!`)
      console.error('Product recycle error:', error)
    }
  }

  const transition = { type: 'spring', duration: 0.3 }

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0.8 }}
      whileInView={{ scale: 1, opacity: 1 }}
      transition={{ ...transition, type: 'tween' }}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.05 },
      }}
      whileTap={{ scale: 0.95 }}
      className={`relative -mb-2  mx-auto m-10 flex w-full my-0 sm:my-2 lg:my-4  flex-col overflow-hidden rounded-lg border border-gray-100 h-92 sm:h-[470px] px-2 pb-5 whitespace-nowrap bg-white  shadow-md hover:shadow-2xl  `}
    >
      {isDeleting && <Loading />}
      {deleteModal && (
        <DeleteModal
          setDeleteModal={setDeleteModal}
          id={_id}
          name={name}
          category={category}
          softDelete={softDelete}
          setIsDeleting={setIsDeleting}
        />
      )}
      {/* Link to the product details page */}
      <div className="h-full flex justify-center items-center sm:flex-col">
        <Link
          to={`/admin/product/${_id}`}
          className="relative mx-3 mt-3 max-sm:w-2/5 flex justify-center h-52 sm:h-60 overflow-hidden rounded-xl "
        >
          <img src={images[0]} className="object-contain" />
        </Link>

        {/* Bottom  */}
        <div className="flex flex-col px-3 justify-start w-full  max-w-full  ml-3  my-4 sm:my-auto ">
          <Link to={`/admin/product/${_id}`}>
            <p className="text-lg sm:text-xl my-2 whitespace-nowrap overflow-hidden text-ellipsis">
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
              <div className="flex flex-col mt-3 gap-y-0 mb-2">
                <div className="flex">
                  <p className="font-semibold">{'\u20B9 '}</p>
                  <p className="text-2xl sm:text-3xl  font-bold text-slate-900">{`${Math.round(
                    (price * (100 - Number(discount))) / 100
                  )}`}</p>
                </div>
                <div className="flex mt-1 text-gray-500 line-through">
                  <p className="font-medium text-xs">{'\u20B9 '}</p>
                  <p className="text-sm sm:text-md  font-medium  h-3 ">{`${price}`}</p>
                </div>
              </div>
            ) : (
              <div className="flex">
                <p className="mt-2 font-semibold">{'\u20B9 '}</p>
                <p className="text-2xl sm:text-3xl my-2 font-bold text-slate-900">{`${price}`}</p>
              </div>
            )}

            <p
              className={`${
                stock < 50 ? 'text-red-500' : 'hidden'
              } text-sm whitespace-nowrap mb-2`}
            >
              {stock < 50 ? `Hurry, only ${stock} left!` : 'Available'}
            </p>
          </Link>
          {softDelete && (
            <button
              className="flex items-center justify-center text-lg w-full h-10 max-sm:w-3/4 mx-auto text-white bg-slate-700 hover:bg-slate-800 rounded-lg hover:shadow"
              onClick={() => {
                toggleDelete(_id)
              }}
            >
              recycle
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
export default AdminProductCard
