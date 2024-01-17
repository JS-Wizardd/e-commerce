import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Rate } from 'antd'
import ProductDetailsSkelton from '../components/skeltons/ProductDetailsSkelton'
import { useDispatch, useSelector } from 'react-redux'
import { setCart } from '../slices/cartSlice'
import ReviewModal from '../components/modals/ReviewModal'
import { CircularProgress } from '@mui/material'
import { checkTokenExpiration } from '../slices/userSlice'
import LoginToContinue from '../components/modals/LoginModal'

const ProductDetailsPage = () => {
  const [product, setProduct] = useState({})
  const [avgRating, setAvgRating] = useState(0)
  const [numOfReviews, setNumOfReviews] = useState(0)
  const [reviews, setReviews] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isReviewsLoading, setIsReviewsLoading] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [index, setIndex] = useState(0)
  const [reviewModal, setReviewModal] = useState(false)
  const [loginModal, setLoginModal] = useState(false)
  const { id } = useParams()

  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.user)
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn)

  const navigate = useNavigate()
  useEffect(() => {
    dispatch(checkTokenExpiration())
  }, [dispatch])

  let hasReviewed = isLoggedIn
    ? reviews.some((review) => review.user === user.id)
    : false

  useEffect(() => {
    setIsLoading(true)
    axios.get(`/products/${id}`).then(({ data }) => {
      setProduct(data.product)
      setNumOfReviews(data.product.numOfReviews)
      setAvgRating(data.product.avgRating)
      setTimeout(() => {
        setIsLoading(false)
      }, 500)
    })
  }, [])

  const fetchReviews = async () => {
    setIsReviewsLoading(true)
    try {
      const { data } = await axios.get(`/reviews/${id}`)
      // console.log(isLoggedIn)
      if (isLoggedIn === true) {
        const sortedReviews = data.reviews.sort((a, b) => {
          if (a.user === user.id) return -1
          if (b.user === user.id) return 1
          return 0
        })
        setReviews(sortedReviews)
      } else {
        setReviews(data.reviews)
      }

      setAvgRating(data.avgRating)
      setNumOfReviews(data.numOfReviews)
      setIsReviewsLoading(false)
    } catch (error) {
      console.error('Error fetching reviews:', error)
    }
  }

  const {
    _id,
    name,
    category,
    brand,
    description,
    discount,
    price,
    images = [],
    stock,
  } = product

  useEffect(() => {
    fetchReviews()
  }, [])

  const addToCart = async () => {
    if (isLoggedIn) {
      try {
        const { data } = await axios.post(`/cart/add/${_id}`)
        // console.log(data)
        if (data.success) {
          dispatch(setCart(data.cart))
          navigate('/cart')
        } else {
          alert(`add to cart failed`)
        }
      } catch (error) {
        console.error(error)
        alert('add to cart failed')
      }
    } else {
      setLoginModal(true)
    }
  }

  const addReview = () => {
    if (isLoggedIn) {
      setReviewModal(true)
    } else {
      setLoginModal(true)
    }
  }

  const deleteReview = async (reviewId) => {
    try {
      const { data } = await axios.delete(`/reviews/delete-review/${reviewId}
      `)
      if (data.success) {
        const updatedReviews = reviews.filter(
          (review) => review._id !== reviewId
        )
        setReviews(updatedReviews)
        setNumOfReviews((prevNumOfReviews) => prevNumOfReviews - 1)
      } else {
        console.error('Failed to delete review')
      }
    } catch (error) {
      console.error('Error deleting review:', error)
    }
  }

  return (
    <>
      {isLoading ? (
        <ProductDetailsSkelton />
      ) : (
        <div className="flex p-2 flex-col mt-14 max-sm:px-2 justify-center overflow-hidden transition-all ease-in-out">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-x-4 md:gap-x-6 lg:gap-x-10 sm:px-2 md:mx-4 p-2 w-full">
            {/* ḷeft */}
            <div className=" flex flex-col self-start mx-auto max-h-fit items-center">
              <div className="relative mb-2 object-cover  flex justify-center aspect-square w-96 sm:w-[350px rounded-md mb-5 md:w-[430px] lg:w-[530px] overflow-hidden shadow-md shadow-purple-100 p-2">
                {discount > 0 && (
                  <div className="absolute -top-0 -left-1 ">
                    <img
                      src="../../../../assets/icons/discount.png"
                      alt="discount"
                      className=" w-16"
                    />
                    <p className="absolute -rotate-12 text-lg top-4 left-3 text-white font-bold">
                      -{discount}%
                    </p>
                  </div>
                )}
                <img
                  src={images[index]}
                  alt="main product image"
                  className="object-contain"
                  loading="lazy"
                />
              </div>
              <div className="flex mx-auto w-fit justify-center  items-center gap-x-6  px-5">
                {images.length > 0 &&
                  images.map((value, ind) => (
                    <div
                      className={`h-20 w-16 p-1 hover:shadow-lg lg:h-28 lg:w-20 mx-auto flex justify-center items-center bg-white border-2 border-purple-${
                        index === ind ? '600' : '50'
                      } rounded-xl  `}
                      key={ind}
                      onMouseOver={() => setIndex(ind)}
                      onClick={() => setIndex(ind)}
                    >
                      <img
                        src={value}
                        alt="product sub images"
                        className={`object-contain h-full min-h-fit border-purple-${
                          index === ind ? '500' : '50'
                        }`}
                      />
                    </div>
                  ))}
              </div>
            </div>

            {/* right */}
            <div className="flex gap-y-2 max-sm:mx-3 md:px-4 mr-3 flex-col self-start w-full mx-auto px-2 mt-6 ">
              <p className="text-xs text-sky-600">Brand: {brand}</p>
              <h1 className="text-xl font-medium capitalize">{name}</h1>

              {/* rating */}
              <div className="flex gap-x-3 max-md:flex-col whitespace-nowrap text-sky-600">
                <Rate allowHalf value={avgRating} disabled />
                {numOfReviews !== 0 ? (
                  <p className="whitespace-nowrap">
                    {numOfReviews} {numOfReviews === 1 ? 'review' : 'reviews'}
                  </p>
                ) : (
                  <p>No ratings yet</p>
                )}
              </div>

              {/* price */}
              {discount && discount > 0 ? (
                <div className="flex flex-col mt-3 gap-y-0 mb-2">
                  <div className="flex">
                    <p className="font-semibold">{'\u20B9 '}</p>
                    <p className="text-2xl sm:text-3xl font-bold text-slate-900">
                      {`${Math.round(
                        (price * (100 - discount)) / 100
                      ).toLocaleString('en-IN')}`}
                    </p>
                  </div>
                  <div className="flex mt-1 text-gray-500 line-through">
                    <p className="font-medium text-xs">{'\u20B9 '}</p>
                    <p className="text-sm sm:text-md  font-medium  h-3 ">{`${price.toLocaleString(
                      'en-IN'
                    )}`}</p>
                  </div>
                </div>
              ) : (
                <div className="flex">
                  <p className="mt-2 font-semibold">{'\u20B9 '}</p>
                  <p className="text-3xl my-2 font-bold text-slate-900">{`${price}`}</p>
                </div>
              )}

              <div className="flex items-center  gap-x-3">
                <h2>Stock :</h2>
                <p
                  className={`text-${
                    stock < 10 ? 'red-500' : 'sky-600'
                  } text whitespace-nowrap `}
                >
                  {stock < 10
                    ? stock < 1
                      ? 'Stock Out'
                      : `Hurry, only ${stock} left!`
                    : 'Available'}
                </p>
              </div>

              {/* description */}
              <div className="bg-violet-100 flex flex-col p-1 py-3 my-3 items-start rounded-lg">
                <h2 className="text-lg font-medium ml-1">Description</h2>
                <p
                  className={`text-base leading-snug  whitespace-pre-wrap px-1 ${
                    isExpanded ? '' : 'line-clamp-3'
                  }`}
                >
                  {description}
                </p>

                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-blue-500 self-end mr-2 mt-2"
                >
                  {isExpanded ? 'Read Less' : 'Read More'}
                </button>
              </div>

              {/* buttons */}
              <div className="flex flex-col mx-auto min-w-fit whitespace-nowrap my-4 max-w-[450px] w-full text-lg font-semibold  gap-y-4 ">
                <button
                  className="bg-white border-accent border-2 shadow-lg text-accent px-3 hover:shadow-lg  hover:bg-accent transition-all hover:text-white  py-2 sm:mx-10 rounded-lg text-lg hover:text-xl active:text-lg  "
                  onClick={addToCart}
                >
                  Add to cart
                </button>
              </div>
            </div>
          </div>
          {reviewModal && (
            <ReviewModal
              productId={_id}
              fetchReviews={fetchReviews}
              setReviewModal={() => setReviewModal(false)}
            />
          )}
          {loginModal && <LoginToContinue setLoginModal={setLoginModal} />}
          {/* reviews */}
          <div className="flex max-sm:flex-col mt-10  w-full h-fit px-3">
            {/* rating */}
            <div className="w-full flex flex-col p-3 border h-fit mx-auto max-sm:w-11/12 border-violet-200 sm:w-2/5 rounded-md shadow-md justify-start items-center sm:mt-3">
              <div className="flex flex-col w-full  items-center mb-5">
                <div className=" ">
                  <Rate
                    allowHalf
                    value={Number(avgRating)}
                    disabled
                    className="scale-125 text-yellow-300"
                  />
                </div>
                <h1 className="text-center my-1 text-gray-500 ">
                  {numOfReviews} reviews
                </h1>
                <div className="text-lg text-center max-md:text-base my-3">
                  {reviews.length > 0 ? (
                    <>
                      <p>
                        This product got average rating of{' '}
                        {avgRating.toFixed(1)}
                        /5
                      </p>
                    </>
                  ) : (
                    <p>{`No ratings yet. Be the first to review!`}</p>
                  )}
                </div>
              </div>

              <button
                className={`bg-secondary ${
                  hasReviewed && 'opacity-60'
                }  w-4/5  mt-auto  py-2  transition-all hover:shadow-lg sm:mx-10 rounded-lg text-md ${
                  hasReviewed && 'cursor-pointer'
                } whitespace-nowrap  h
              active:scale-95 text-white`}
                disabled={hasReviewed}
                onClick={addReview}
              >
                {hasReviewed ? 'already reviewed!' : 'Add a review'}
              </button>
            </div>

            {/* reviews of the product */}
            <div className="bg-violet-50 w-full sm:w-3/5 mx-4 flex flex-col py-3 my-3 items-start rounded-lg p-2 min-h-fit max-h-96 overflow-y-auto ">
              <p className="text-lg font-medium ml-1 mb-3">Reviews</p>
              {isReviewsLoading ? (
                <div className="bg-violet-100 py-4 flex justify-center mb-2 rounded-2xl h-28 items-center p-2 w-full">
                  <CircularProgress style={{ scale: '0.8' }} />
                </div>
              ) : reviews.length > 0 ? (
                reviews.map((review) => (
                  <div
                    key={review._id}
                    className="relative bg-violet-100 py-4 mb-2 rounded-2xl p-2 w-full"
                  >
                    {user?.id === review.user && isLoggedIn && (
                      <button
                        className="absolute right-3 top-2"
                        onClick={() => {
                          deleteReview(review._id)
                        }}
                      >
                        <img src="/delete.png" alt="delete" className="h-5" />
                      </button>
                    )}
                    <h2 className="font-semibold">{review.name}</h2>
                    <Rate
                      allowHalf
                      defaultValue={review.rating}
                      style={{ scale: '0.8', marginLeft: '-1rem' }}
                      disabled
                    />
                    <p>{review.review}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm font-semibold text-slate-500">
                  No reviews yet
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
export default ProductDetailsPage
