import { useEffect, useState } from 'react'
import axios from 'axios'
import CartSkelton from '../components/skeltons/CartSkelton'
import { Link, useNavigate } from 'react-router-dom'
import OrderDetailsModal from '../components/modals/OrderDetailsModal'
import OrderCard from '../components/OrderCard'

const UserOrdersPage = () => {
  const [isOrdersLoading, setIsOrdersLoading] = useState(false)
  const [myOrders, setMyOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const navigate = useNavigate()

  const fetchOrders = async () => {
    setIsOrdersLoading(true)
    const { data } = await axios.get('/orders')
    // console.log(data)
    if (data.success) {
      setMyOrders(data.orders)
      setTimeout(() => {
        setIsOrdersLoading(false)
      }, 500)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const openModal = (order) => {
    setSelectedOrder(order)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setSelectedOrder(null)
    setIsModalOpen(false)
  }

  return (
    <div className="mx-1 md:mx-10 min-h-fit max-md:mb-40">
      {isOrdersLoading ? (
        <>
          <div className="text-2xl sm:text-3xl font-semibold h-14  rounded-sm w-full border-b flex items-center text-violet-700 mb-5 pl-5">
            <button
              className="bg-secondary hover:bg-accent mb-1 items-center  flex mt-2 rounded-full text-white text-lg text-center mr-3 transition-transform duration-200 hover:scale-105 active:scale-95"
              onClick={() => navigate(-1)}
            >
              <img src="/go back.png" alt="go back" className="h-6" />
            </button>
            My Orders
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
        <div className="w-full  px-3 flex justify-center min-h-fit pb-10 gap-x-4 overflow-hidden">
          <div
            className={`sm:w-full ${
              !isOrdersLoading && myOrders?.length > 0 && 'sm:w-2/3'
            } w-full `}
          >
            <div className="text-2xl sm:text-3xl font-semibold h-14  rounded-sm w-full border-b flex items-center text-violet-700 mb-5 pl-5">
              <button
                className="bg-secondary hover:bg-accent mb-1 items-center  flex mt-2 rounded-full text-white text-lg text-center mr-3 transition-transform duration-200 hover:scale-105 active:scale-95"
                onClick={() => navigate(-1)}
              >
                <img src="/go back.png" alt="go back" className="h-6" />
              </button>
              My Orders
              <img
                src="../../assets/icons/purple cart.png"
                alt="cart icon"
                className="object-contain ml-2 h-9"
              />
            </div>
            {isModalOpen && selectedOrder && (
              <OrderDetailsModal
                closeModal={closeModal}
                selectedOrder={selectedOrder}
              />
            )}
            {/* {console.log(myOrders)} */}
            {!isOrdersLoading && myOrders?.length > 0 ? (
              myOrders.map((order, i) => (
                <OrderCard order={order} key={i} openModal={openModal} />
              ))
            ) : (
              <div className="w-full h-96  flex flex-col items-center justify-center text-xl font-medium text-gray-700">
                No Orders Yet!
                <Link
                  to={'/'}
                  className="underline text-violet-400 hover:text-violet-600"
                >
                  continue shopping
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
export default UserOrdersPage
