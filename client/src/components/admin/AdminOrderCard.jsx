import { useState } from 'react'
import axios from 'axios'

const AdminOrderCard = ({
  order,
  openModal,
  setIsOrdersLoading,
  setStatus,
}) => {
  const { total, status, date, delivery, products, _id } = order

  const updateStatus = async (e) => {
    setIsOrdersLoading(true)
    try {
      const { data } = await axios.put(`/admin/orders/update-status/${_id}`, {
        newStatus: e.target.value,
      })
      if (data.success) {
        setIsOrdersLoading(false)
        setStatus(data.order.status)
      }
    } catch (error) {
      setIsOrdersLoading(false)
    }
  }

  return (
    <div
      className={`flex max-h-fit max-sm:pr-4 cursor-pointer h-32  mb-3 rounded-lg border-violet-100 p-2 border  overflow-hidden transition-all justify-between w-full lg:w-[90%] xl:w-[80%]`}
    >
      {/* left */}

      {products.length > 0 && (
        <div
          className={`w-1/6 grid ${
            products.length === 1
              ? 'grid-cols-1'
              : products.length === 2
              ? 'grid-cols-2'
              : products.length === 3
              ? 'grid-cols-2'
              : products.length === 4 && '2'
          }
          ${
            products.length === 1
              ? 'grid-rows-1'
              : products.length === 2
              ? 'grid-rows-1'
              : products.length === 3
              ? 'grid-rows-2'
              : products.length === 4 && 'grid-rows-2'
          }
            bg-white justify-center rounded-md h-full p-2`}
          onClick={() => {
            openModal(order)
          }}
        >
          {products.slice(0, 4).map((product, i) => (
            <div
              key={i}
              className="w-full flex justify-center items-center h-full"
            >
              <img
                src={product.product.images[0]}
                alt="cart product image"
                className={`object-contain ${
                  products.length > 1 ? 'max-h-[70%]' : 'max-h-full'
                } max-w-full`}
              />
            </div>
          ))}
        </div>
      )}
      {/* middle */}
      <div
        className="flex ml-3 text-base lg:text-lg max-sm:text-sm font-medium  justify-around h-full items-start mr-auto  flex-col w-4/6   p-3"
        onClick={() => {
          openModal(order)
        }}
      >
        <div className="flex gap-x-20 max-md:flex-col">
          <div className="flex">
            total price: &nbsp;{' '}
            <p className="text-blue-500">{total.toLocaleString('en-IN')}/-</p>
            <p
              className={`text-gray-600 ${
                status === 'Cancelled' ? 'block' : 'hidden'
              }`}
            >
              &nbsp;(refunded)
            </p>
          </div>
          <div className="flex">
            status: &nbsp;{' '}
            <p
              className={`text-blue-500 ${
                status === 'Cancelled' && 'text-red-600'
              }`}
            >
              {status}
            </p>
          </div>
        </div>
        <div
          className={`flex flex-col ${
            status === 'Cancelled' && 'hidden'
          } lg:flex-row lg:gap-x-10`}
        >
          <div className="flex">
            ordered on: &nbsp;{' '}
            <p className="text-blue-500">
              {new Date(date).toLocaleDateString()}
            </p>
          </div>
          <div className="flex">
            expected delivery: &nbsp;{' '}
            <p className="text-blue-500">
              {new Date(delivery).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
      {/* right */}
      <div
        className={`w-1/6 ${
          status === 'Cancelled' && 'hidden'
        } flex rounded-lg justify-center items-center gap-y-3`}
      >
        <select
          className="rounded-md bg-white border border-blue-500 px-3 py-2 text-sm text-blue-500 font-bold hover:text-white hover:bg-blue-600 transition-all "
          value={status}
          onChange={(e) => updateStatus(e)}
        >
          <option value="Placed">Placed</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>s
        </select>
      </div>
    </div>
  )
}
export default AdminOrderCard
