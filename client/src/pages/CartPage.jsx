import { useEffect, useState } from 'react'
import CartCard from '../components/CartCard'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setCart } from '../slices/cartSlice'
import CartSkelton from '../components/skeltons/CartSkelton'
import { fetchCart } from '../api'
import AddressModal from '../components/modals/addressModal'
import CustomAlert from '../components/CustomAlert'

const CartPage = () => {
  const [isCartLoading, setIsCartLoading] = useState(true)
  const [addressModal, setAddressModal] = useState(false)
  const [wallet, setWallet] = useState(0)
  const [useWallet, setUseWallet] = useState(false)

  const [alertOpen, setAlertOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertTheme, setAlertTheme] = useState('success')

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const myCart = useSelector((state) => state.cart.cartItems)
  const totalPrice = useSelector((state) => state.cart.totalPrice)
  const totalQuantity = useSelector((state) => state.cart.totalQuantity)

  const effectiveTotalPrice = useWallet
    ? Math.max(totalPrice - wallet, 0)
    : totalPrice

  const remainingWallet = useWallet
    ? totalPrice < wallet
      ? wallet - totalPrice
      : 0
    : wallet

  const fetchWallet = async () => {
    try {
      const { data } = await axios.get('/users/wallet')
      // console.log(data)
      if (data.success) {
        setWallet(data.wallet.balance)
      }
    } catch (error) {
      alert('something went wrong while fetching wallet')
    }
  }

  const fetchData = async () => {
    setIsCartLoading(true)
    try {
      const { success, cart, totalPrice, totalQuantity } = await fetchCart()
      // console.log(success, cart, totalPrice, totalQuantity)
      if (success) {
        dispatch(
          setCart({
            cart,
            totalPrice,
            totalQuantity,
          })
        )
        setTimeout(() => {
          setIsCartLoading(false)
        }, 500)
      }
    } catch (error) {
      alert('something went wrong while fetching cart')
      setIsCartLoading(false)
    }
  }

  const checkStock = async () => {
    try {
      const { data } = await axios.get('/products/stock')
      // console.log(data)
      if (data.success) {
        return data
      } else {
        return data
      }
    } catch (error) {
      console.error(error)
    }
  }

  const makePayment = async () => {
    setAddressModal(false)
    const data = await checkStock()
    if (data.success) {
      try {
        axios
          .post('/payment/new-order', { useWallet })
          .then(({ data }) => {
            console.log(data)
            const order = data.savedOrder

            var options = {
              key: import.meta.env.VITE_RZP_ID,
              amount: order.total * 100,
              currency: 'INR',
              name: 'Gadget Bazaar',
              description: 'Test Transaction',
              order_id: order.orderId,
              handler: function (response) {
                axios
                  .post('/payment/pay', {
                    orderId: response.razorpay_order_id,
                    paymentId: response.razorpay_payment_id,
                  })
                  .then(({ data }) => {
                    navigate('/orders')
                  })
                  .catch((error) => {
                    console.log(error)
                  })
              },
              prefill: {
                name: '',
                email: '',
                contact: '',
              },
              notes: {
                address: 'Your Company Address',
              },
              theme: {
                color: '#502a94',
              },
            }
            var rzp1 = new window.Razorpay(options)
            rzp1.open()
          })
          .catch((err) => {
            console.log('error' + err)
          })
      } catch (error) {
        console.log('catch block error: ', error)
      }
    } else {
      setAlertOpen(true)
      setAlertMessage(data.message)
      setAlertTheme('error')
    }
  }

  useEffect(() => {
    fetchData()
    fetchWallet()
  }, [])

  return (
    <div className="mx-1 md:mx-10 min-h-fit max-md:mb-40">
      {isCartLoading ? (
        <>
          <div className="text-2xl sm:text-3xl font-semibold h-14  rounded-sm w-full border-b flex items-center text-violet-700 mb-5 pl-5">
            <button
              className="bg-secondary hover:bg-accent mb-1 items-center  flex mt-2 rounded-full text-white text-lg text-center mr-3 transition-transform duration-200 hover:scale-105 active:scale-95"
              onClick={() => navigate(-1)}
            >
              <img src="/go back.png" alt="go back" className="h-6" />
            </button>
            My Cart
            <img
              src="../../assets/icons/purple cart.png"
              alt="cart icon"
              className="object-contain ml-2 h-9"
            />
          </div>
          {Array(4)
            .fill()
            .map((_, index) => (
              <CartSkelton key={index} />
            ))}
        </>
      ) : (
        <>
          <div className="w-full relative px-3 flex justify-center min-h-fit h-full pb-10 gap-x-4 overflow-hidden">
            <div className="absolute top-0 right-0">
              <CustomAlert
                open={alertOpen}
                theme={alertTheme}
                setOpen={setAlertOpen}
                message={alertMessage}
                duration={5000}
              />
            </div>
            <div
              className={`sm:w-full ${
                !isCartLoading && myCart?.length > 0 && 'sm:w-2/3'
              } w-full `}
            >
              <div className="text-2xl sm:text-3xl font-semibold h-14  rounded-sm w-full border-b flex items-center text-violet-700 mb-5 pl-5">
                <button
                  className="bg-secondary hover:bg-accent mb-1 items-center  flex mt-2 rounded-full text-white text-lg text-center mr-3 transition-transform duration-200 hover:scale-105 active:scale-95"
                  onClick={() => navigate(-1)}
                >
                  <img src="/go back.png" alt="go back" className="h-6" />
                </button>
                My Cart
                <img
                  src="../../assets/icons/purple cart.png"
                  alt="cart icon"
                  className="object-contain ml-2 h-9"
                />
              </div>
              {!isCartLoading && myCart?.length > 0 ? (
                myCart.map((product, i) => (
                  <CartCard product={product} key={i} />
                ))
              ) : (
                <div className="w-full h-96  flex flex-col items-center justify-center text-xl font-medium text-gray-700">
                  No items in your cart!
                  <Link
                    to={'/'}
                    className="underline text-violet-400 hover:text-violet-600"
                  >
                    continue shopping
                  </Link>
                </div>
              )}
            </div>
            {addressModal && (
              <AddressModal
                makePayment={makePayment}
                setAddressModal={setAddressModal}
              />
            )}
            {/* right */}
            {!isCartLoading && myCart?.length > 0 && (
              <div className="max-md:hidden mt-16 w-56 min-w-[14rem]  flex relative top-4 h-60 flex-col text-lg  justify-between rounded-md shadow-lg p-2  whitespace-nowrap bg-violet-100 ">
                <div className="my-auto flex flex-col gap-y-3">
                  <div className="flex w-full justify-between">
                    total items:{' '}
                    <p className="text-lg font-medium mr-3">{totalQuantity}</p>
                  </div>
                  <div className="flex  w-full justify-between">
                    total :{' '}
                    <div className="flex flex-col gap-y-2">
                      <p
                        className={`text-lg font-medium ${
                          useWallet && 'line-through text-sm'
                        }`}
                      >
                        {totalPrice.toLocaleString('en-IN')}/-
                      </p>
                      <p
                        className={`text-lg  ${
                          useWallet ? 'block' : 'hidden'
                        } text-lg font-medium `}
                      >
                        {effectiveTotalPrice.toLocaleString('en-IN')}/-
                      </p>
                    </div>
                  </div>
                </div>
                {/* wallet checkbox */}
                <div className="flex flex-col gap-y-2">
                  <label
                    htmlFor="useWallet"
                    className={`flex items-center ${
                      wallet <= 0 && 'text-gray-500'
                    }   text-base pl-2 justify-start gap-x-4`}
                  >
                    <input
                      id="useWallet"
                      disabled={wallet <= 0}
                      type="checkbox"
                      checked={useWallet}
                      onChange={(e) => setUseWallet(e.target.checked)}
                      className="mr-2  rounded cursor-pointer h-5 w-5 border-2 border-gray-400 text-accent bg-accent checked:bg-accent checked:border-accent"
                    />
                    Apply wallet(
                    {useWallet
                      ? remainingWallet.toLocaleString('en-IN')
                      : wallet.toLocaleString('en-IN')}{' '}
                    /-)
                  </label>
                  <button
                    className="w-full h-10 mt-auto flex justify-center bg-gradient-to-tr from-violet-700 to-red-400  items-center text-lg shadow-md  rounded text-gray-200 transition-all active:scale-95 hover:text-white   "
                    onClick={() => {
                      setAddressModal(true)
                    }}
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            )}

            {/* mobile fixed */}
            {!isCartLoading && myCart?.length > 0 && (
              <div className="hidden max-md:flex gap-x-5 fixed bottom-3 right-4 left-4 h-20 rounded-md border bg-violet-300 py-2 shadow-xl">
                {/* left */}
                <div className="w-3/5 flex text-lg flex-col justify-center items-center p-3">
                  <div className="flex w-full border-black justify-start gap-x-5">
                    total items:{' '}
                    <p className="mr-3 font-medium">{totalQuantity}</p>
                  </div>

                  <div className="flex   w-full justify-start gap-x-4">
                    total price:{' '}
                    <div>
                      <p
                        className={`text-lg font-semibold ${
                          useWallet && 'line-through text-xs'
                        }`}
                      >
                        {totalPrice}/-
                      </p>
                      <p
                        className={`text-lg ${
                          useWallet ? 'block' : 'hidden'
                        } font-semibold`}
                      >
                        {effectiveTotalPrice.toLocaleString('en-IN')}/-
                      </p>
                    </div>
                  </div>
                </div>
                {/* wallet checkbox */}
                <label
                  htmlFor="useWallet"
                  className={`flex items-center whitespace-nowrap ${
                    wallet <= 0 && 'text-gray-500'
                  }   text-base pl-2 justify-start gap-x-4`}
                >
                  <input
                    id="useWallet"
                    disabled={wallet <= 0}
                    type="checkbox"
                    checked={useWallet}
                    onChange={(e) => setUseWallet(e.target.checked)}
                    className="mr-2  rounded cursor-pointer h-5 w-5 border-2 border-gray-400 text-accent bg-accent  checked:bg-accent checked:border-accent"
                  />
                  Apply wallet
                  <br /> (
                  {useWallet
                    ? remainingWallet.toLocaleString('en-IN')
                    : wallet.toLocaleString('en-IN')}{' '}
                  /-)
                </label>

                {/* right */}
                <button
                  className="w-1/5 ml-auto h-full m-2 my-2 mt-auto flex justify-center bg-gradient-to-tr from-violet-700 to-red-400  items-center text-lg max-sm:text-base shadow-md  rounded text-white hover:text-white  transition-all active:scale-95  hover:shadow-lg"
                  onClick={() => {
                    setAddressModal(true)
                  }}
                >
                  Buy Now
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
export default CartPage
