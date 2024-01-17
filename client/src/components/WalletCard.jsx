import { useState } from 'react'
import { Link } from 'react-router-dom'
import Loading from './Loading'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { updateCart } from '../slices/cartSlice'
import { deleteCartItem } from '../slices/cartSlice'

const WalletCard = ({ history }) => {
  const { date, orderDetails, amount, type } = history

  const dispatch = useDispatch()

  return (
    <div
      className={`flex max-h-fit h-28 max-sm:h-32 mb-3 rounded-lg border-violet-100 p-2 border  transition-all justify-between w-full lg:w-[90%] xl:w-[80%] `}
    >
      {/* left */}
      {false && <Loading />}

      <div className="w-1/5 flex items-center  bg-white justify-center rounded-md h-full  cursor-pointer font-medium text-blue-600 p-2">
        {orderDetails[0]?.products.length} item
      </div>

      {/* middle */}
      <div className="flex ml-3 justify-center mr-auto gap-y-1 flex-col w-3/6 border-r font-medium p-3">
        <p>{type === 'addition' ? 'order cancelled' : 'order placed '}</p>
        <p className="italic">on : {new Date(date).toLocaleDateString()}</p>
      </div>
      {/* right */}
      <div className="w-2/6 lg:w-1/6 flex flex-col whitespace-nowrap bg-violet-50 rounded-lg justify-center items-center gap-y-3">
        <div className="text-md text-gray-700 font-medium">
          {type === 'addition' ? (
            <p className="text-green-600 font-medium text-lg md:text-xl">
              + {amount}
            </p>
          ) : (
            <p className="text-red-600 font-medium text-lg md:text-xl">
              - {amount}
            </p>
          )}
        </div>
      </div>
    </div>
  ) //addition', 'deduction
}
export default WalletCard
