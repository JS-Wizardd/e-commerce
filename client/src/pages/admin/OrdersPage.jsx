import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import CartSkelton from '../../components/skeltons/CartSkelton'
import OrderDetailsModal from '../../components/modals/OrderDetailsModal'
import OrderCard from '../../components/OrderCard'
import AdminOrderCard from '../../components/admin/AdminOrderCard'
import AdminOrderDetailsModal from '../../components/modals/AdminOrderDetailsModal'

const OrdersPage = () => {
  const [isOrdersLoading, setIsOrdersLoading] = useState(false)
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [status, setStatus] = useState('Placed')
  const navigate = useNavigate()

  const fetchOrders = async () => {
    setIsOrdersLoading(true)
    try {
      const { data } = await axios.get(`/admin/orders?status=${status}`)
      // console.log(data)
      if (data.success) {
        setOrders(data.orders)
        setTimeout(() => {
          setIsOrdersLoading(false)
        }, 500)
      }
    } catch (error) {
      alert('something went wrong')
      console.error('order fetching error: ' + error)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [status])

  const openModal = (order) => {
    setSelectedOrder(order)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setSelectedOrder(null)
    setIsModalOpen(false)
  }

  const handleStatus = (newStatus) => {
    setStatus(newStatus)
  }

  const btnClass = ` px-2  py-1 rounded-3xl border border-slate-300 hover:bg-slate-700 hover:text-white transition-all hover:shadow-xl`

  return (
    <div className="mx-1 md:mx-10 min-h-fit max-md:mb-40">
      {isOrdersLoading ? (
        <div className="mt-[76px]">
          <div className=" font-semibold h-14  rounded-sm w-full flex justify-center gap-x-5 items-center  my-3 ">
            <button
              className={`${btnClass} ${
                status === 'Placed'
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-200 text-black '
              }  `}
              onClick={() => handleStatus('Placed')}
            >
              Placed
            </button>
            <button
              className={`${btnClass} ${
                status === 'Shipped'
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-200 text-black '
              }  `}
              onClick={() => handleStatus('Shipped')}
            >
              Shipped
            </button>
            <button
              className={`${btnClass} ${
                status === 'Delivered'
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-200 text-black '
              }  `}
              onClick={() => handleStatus('Delivered')}
            >
              Delivered
            </button>
            <button
              className={`${btnClass} ${
                status === 'Cancelled'
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-200 text-black '
              }  `}
              onClick={() => handleStatus('Cancelled')}
            >
              Cancelled
            </button>
          </div>
          {Array(4)
            .fill()
            .map((_, index) => (
              <CartSkelton key={index} />
            ))}
        </div>
      ) : (
        <div className="w-full  px-3 flex justify-center min-h-fit pb-10 gap-x-4 overflow-hidden">
          <div
            className={`sm:w-full ${
              !isOrdersLoading && orders?.length > 0 && 'sm:w-2/3'
            } w-full `}
          >
            <div className=" font-semibold h-14  rounded-sm w-full flex justify-center gap-x-5 items-center  my-3 ">
              <button
                className={`${btnClass} ${
                  status === 'Placed'
                    ? 'bg-slate-800 text-white'
                    : 'bg-slate-200 text-black '
                }  `}
                onClick={() => handleStatus('Placed')}
              >
                Placed
              </button>
              <button
                className={`${btnClass} ${
                  status === 'Shipped'
                    ? 'bg-slate-800 text-white'
                    : 'bg-slate-200 text-black '
                }  `}
                onClick={() => handleStatus('Shipped')}
              >
                Shipped
              </button>
              <button
                className={`${btnClass} ${
                  status === 'Delivered'
                    ? 'bg-slate-800 text-white'
                    : 'bg-slate-200 text-black '
                }  `}
                onClick={() => handleStatus('Delivered')}
              >
                Delivered
              </button>
              <button
                className={`${btnClass} ${
                  status === 'Cancelled'
                    ? 'bg-slate-800 text-white'
                    : 'bg-slate-200 text-black '
                }  `}
                onClick={() => handleStatus('Cancelled')}
              >
                Cancelled
              </button>
            </div>
            {isModalOpen && selectedOrder && (
              <AdminOrderDetailsModal
                closeModal={closeModal}
                selectedOrder={selectedOrder}
              />
            )}
            {/* {console.log(myOrders)} */}
            {!isOrdersLoading && orders?.length > 0 ? (
              orders.map((order, i) => (
                <AdminOrderCard
                  order={order}
                  key={i}
                  openModal={openModal}
                  setIsOrdersLoading={setIsOrdersLoading}
                  setStatus={setStatus}
                />
              ))
            ) : (
              <div className="w-full h-96  flex flex-col items-center justify-center text-xl font-medium text-gray-700">
                No orders yet in {status.toLocaleLowerCase()} state
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
export default OrdersPage
