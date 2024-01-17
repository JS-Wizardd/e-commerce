import axios from 'axios'
import { useEffect, useState } from 'react'
import { indianStates } from '../../constants'
import _ from 'lodash'

const EditAddressModal = ({ setAddModal, editAddress }) => {
  const { address, street, city, state, pin } = editAddress
  const [newAddress, setNewAddress] = useState({
    address: address,
    street: street,
    city: city,
    state: state,
    pin: pin,
  })
  const [initialAddress, setInitialAddress] = useState({
    address: address,
    street: street,
    city: city,
    state: state,
    pin: pin,
  })
  const [isAddressChanged, setIsAddressChanged] = useState(false)
  const [Loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target

    setNewAddress({
      ...newAddress,
      [name]: value,
    })
  }

  useEffect(() => {
    const isEqual = _.isEqual(initialAddress, newAddress)
    setIsAddressChanged(!isEqual)
  }, [initialAddress, newAddress])

  const updateAddress = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      // console.log('new address: ' + newAddress)
      const { data } = await axios.put('/address/update', {
        addressDetails: newAddress,
      })
      // console.log(data)
      if (data.success) {
        setTimeout(() => {
          setLoading(false)
          setAddModal(false)
        }, 500)
      } else {
        setLoading(false)
        setAddModal(false)
        alert('address update failed')
      }
    } catch (error) {
      setLoading(false)
      setAddModal(false)
      alert('something went wrong')
    }
  }

  return (
    <div className="fixed z-50 top-0 right-0 left-0 bottom-0 flex justify-center items-center bg-black/70">
      <div className="w-9/12 sm:w-3/5 md:w-6/12 lg:w-4/12  h-fit r p-5 flex flex-col bg-slate-50 rounded-md">
        <div className="flex relative flex-col w-full h-full p-2 px3 items-center justify-start">
          <img
            src="../../../assets/icons/modal-close.png"
            className="absolute p-1 scale-75 hover:shadow-xl cursor-pointer rounded-full right-1 top-1 bg-accent"
            alt="close modal"
            onClick={() => setAddModal(false)}
          />
          <h1 className="text-center text-xl lg:text-2xl font-semibold mb-5">
            Shipping Address
          </h1>
          <form
            onSubmit={() => {
              updateAddress
            }}
            className="w-full h-full overflow-hidden"
          >
            <label>
              Address:
              <input
                type="text"
                name="address"
                value={newAddress?.address}
                onChange={handleChange}
                pattern="^[A-Za-z0-9\s]{5,}$"
                title="Address must be at least 5 characters long and contain only alphanumeric characters"
                required
              />
            </label>
            <label>
              Street:
              <input
                type="text"
                name="street"
                value={newAddress?.street}
                onChange={handleChange}
                pattern="^[A-Za-z0-9\s]{3,}$"
                title="Street must be at least 3 characters long and contain only alphanumeric characters"
                required
              />
            </label>
            <label>
              City:
              <input
                type="text"
                name="city"
                value={newAddress?.city}
                onChange={handleChange}
                pattern="^[A-Za-z\s]{3,}$"
                title="City must be at least 3 characters long and contain only alphabets"
                required
              />
            </label>
            <label>
              State:
              <select
                name="state"
                value={newAddress?.state}
                onChange={handleChange}
                required
                className="h-10"
              >
                <option value={newAddress?.state}>{newAddress?.state}</option>
                {indianStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </label>
            <label>
              PIN Code:
              <input
                type="text"
                name="pin"
                value={newAddress?.pin}
                onChange={handleChange}
                pattern="^[0-9]{6}$"
                title="PIN Code must be 6 digits"
                required
              />
            </label>
            {/* submit button */}
            <button
              className={`w-full   ${
                !isAddressChanged || Loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-accent'
              }  mt-7 self-end  h-10  flex justify-center  items-center text-lg shadow-md  rounded text-white transition-all active:scale-95  hover:scale-100 hover:shadow-xl  `}
              type="submit"
              onClick={updateAddress}
            >
              {Loading ? 'Updating...' : 'Update Address'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
export default EditAddressModal
