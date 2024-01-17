import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const OrderCancelModal = ({ setConfirmModal, id }) => {
  const [reason, setReason] = useState('')
  const [otherReason, setOtherReason] = useState('')
  const navigate = useNavigate()

  const cancelOrder = async () => {
    try {
      const cancellationReason = otherReason || reason

      if (!cancellationReason) {
        alert('Please provide a reason for cancellation')
        return
      }

      const { data } = await axios.post(`/orders/cancel/${id}`, {
        reason: cancellationReason,
      })
      if (data.success) {
        alert('order cancelled!')
        navigate('/wallet')
      } else {
        alert('order cancellation failed')
      }
    } catch (error) {
      console.error('something went wrong while order cancellation :', error)
    }
  }

  return (
    <div
      className="fixed z-50 top-0 right-0 left-0 bottom-0 flex justify-center items-center"
      style={{ background: 'rgba(0,0,0,0.8)' }}
    >
      <div className="w-2/5 max-sm:w-4/5 min-h-fit  p-5 flex flex-col bg-slate-50 rounded-md">
        <div>
          <h1 className="text-xl mb-3 font-medium text-red-500 text-center">
            Cancel Order
          </h1>
        </div>
        <h1>Are you sure you want to cancel the order?</h1>
        <div>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full py-2 mt-2 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 block rounded-md shadow-sm"
          >
            <option className="" value="">
              Select a reason
            </option>
            <option value="Changed my mind">Changed my mind</option>
            <option value="Found a better product">
              Found a better product
            </option>
            <option value="Don't want this product">
              Don't want this product
            </option>
            <option value="Product doesn't match my need">
              Product doesn't match my need
            </option>
            <option value="Others">Others</option>
          </select>
          {reason === 'Others' && (
            <input
              type="text"
              value={otherReason}
              onChange={(e) => setOtherReason(e.target.value)}
              className="w-full py-2 mt-2 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 block rounded-md shadow-sm"
              placeholder="Please specify"
            />
          )}
        </div>
        <div className="h-1/4 flex gap-x-2 w-full mt-10 ">
          <button
            className={`border ${
              reason === '' &&
              otherReason === '' &&
              'cursor-not-allowed hover:bg-gray-700'
            } border-red-600 w-2/4 bg-red-100 flex items-center justify-center py-3 rounded hover:bg-red-600 hover:text-white active:scale-95 font-semibold hover:shadow transition-all `}
            onClick={cancelOrder}
            disabled={reason === '' && otherReason === ''}
          >
            confirm
          </button>
          <button
            className="border border-blue-600 bg-blue-100 flex items-center justify-center w-2/4 py-3 rounded hover:bg-blue-600 active:scale-95 hover:text-white font-semibold hover:shadow transition-all "
            onClick={() => {
              setConfirmModal(false)
            }}
          >
            cancel
          </button>
        </div>
      </div>
    </div>
  )
}
export default OrderCancelModal
