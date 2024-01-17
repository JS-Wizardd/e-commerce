import axios from 'axios'
import { useEffect, useState } from 'react'
import _ from 'lodash'
import CustomAlert from '../CustomAlert'

const AddressModal = ({ makePayment, setAddressModal }) => {
  const [addressDetails, setAddressDetails] = useState({
    address: '',
    street: '',
    city: '',
    state: '',
    pin: '',
  })
  const [initialAddress, setInitialAddress] = useState({
    address: '',
    street: '',
    city: '',
    state: '',
    pin: '',
  })
  const [isAddressFetched, setIsAddressFetched] = useState(false)
  const [isButtonEnabled, setIsButtonEnabled] = useState(false)
  const [isAddressChanged, setIsAddressChanged] = useState(false)
  const [isAnyValueEmpty, setIsAnyValueEmpty] = useState(false)
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertTheme, setAlertTheme] = useState('success')

  const handleChange = (e) => {
    const { name, value } = e.target
    setAddressDetails({
      ...addressDetails,
      [name]: value,
    })
  }

  const fetchAddress = async () => {
    try {
      const { data } = await axios.get('/address')

      if (data.success) {
        const { address, street, city, state, pin } =
          data.address.addressDetails
        setAddressDetails({
          address: address,
          street: street,
          city: city,
          state: state,
          pin: pin,
        })
        setInitialAddress({
          address: address,
          street: street,
          city: city,
          state: state,
          pin: pin,
        })
        setIsAddressFetched(true)
        setIsButtonEnabled(true)
      } else {
        setIsButtonEnabled(true)
        setIsAddressFetched(false)
      }
    } catch (error) {
      alert('Internal server error')
      console.error('Error fetching address:', error)
    }
  }

  const addAddress = async (e) => {
    e.preventDefault()
    setIsButtonEnabled(false)
    try {
      const { data } = await axios.post('/address/add', { addressDetails })
      if (data.success) {
        setAlertOpen(true)
        setAlertMessage('Address added successfully')
        setAlertTheme('success')
        await fetchAddress()
        setIsButtonEnabled(true)
      } else {
        setIsButtonEnabled(true)
      }
    } catch (error) {
      alert('Internal server error')
      console.error('Error adding address:', error)
    }
  }

  const updateAddress = async (e) => {
    e.preventDefault()
    setIsButtonEnabled(false)
    try {
      const { data } = await axios.put('/address/update', {
        addressDetails,
      })
      // console.log(data)
      if (data.success) {
        await fetchAddress()
        setIsButtonEnabled(true)
        setAlertOpen(true)
        setAlertMessage('Address updated successfully')
        setAlertTheme('success')
      } else {
        setIsButtonEnabled(true)
      }
    } catch (error) {
      alert('Internal server error')
      console.error('Error adding address:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await makePayment()
    } catch (error) {
      setAlertOpen(true)
      setAlertMessage("couldn't complete the request")
      setAlertTheme('error')
    }
  }

  useEffect(() => {
    fetchAddress()
  }, [])

  useEffect(() => {
    let valueEmpty = Object.values(addressDetails).some((value) => value === '')
    setIsAnyValueEmpty(valueEmpty)
    // console.log(isAnyValueEmpty)
  }, [addressDetails])

  useEffect(() => {
    const isEqual = _.isEqual(initialAddress, addressDetails)
    setIsAddressChanged(!isEqual)
  }, [initialAddress, addressDetails])

  return (
    <div className="fixed z-50 top-0 right-0 left-0 bottom-0 flex justify-center items-center bg-black/70">
      <div className="absolute top-5">
        <CustomAlert
          open={alertOpen}
          theme={alertTheme}
          setOpen={setAlertOpen}
          message={alertMessage}
        />
      </div>
      <div className="w-9/12 sm:w-3/5 md:w-6/12 lg:w-4/12  h-fit r p-5 flex flex-col bg-slate-50 rounded-md">
        <div className="flex relative flex-col w-full h-full p-2 px3 items-center justify-start">
          <img
            src="../../../assets/icons/modal-close.png"
            className="absolute p-1 scale-75 hover:shadow-xl cursor-pointer rounded-full right-1 top-1 bg-gradient-to-tr from-red-400 to-violet-700"
            alt="close modal"
            onClick={() => setAddressModal(false)}
          />
          <h1 className="text-center text-xl lg:text-2xl font-semibold mb-5">
            Shipping Address
          </h1>
          <form
            onSubmit={
              isAddressFetched
                ? isAddressChanged
                  ? updateAddress
                  : handleSubmit
                : addAddress
            }
            className="w-full h-full overflow-hidden"
          >
            <label>
              Address:
              <input
                type="text"
                name="address"
                value={addressDetails?.address}
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
                value={addressDetails.street}
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
                value={addressDetails.city}
                onChange={handleChange}
                pattern="^[A-Za-z\s]{3,}$"
                title="City must be at least 3 characters long and contain only alphabets"
                required
              />
            </label>
            <label>
              State:
              <input
                type="text"
                name="state"
                value={addressDetails.state}
                onChange={handleChange}
                pattern="^[A-Za-z\s]{3,}$"
                title="State must be at least 3 characters long and contain only alphabets"
                required
              />
            </label>
            <label>
              PIN Code:
              <input
                type="text"
                name="pin"
                value={addressDetails.pin}
                onChange={handleChange}
                pattern="^[0-9]{6}$"
                title="PIN Code must be 6 digits"
                required
              />
            </label>
            {/* submit button */}
            <button
              className={`w-full   ${
                isAnyValueEmpty
                  ? 'bg-gray-700 cursor-wait'
                  : 'bg-gradient-to-tr from-violet-700 to-red-400'
              }  mt-7 self-end  h-10  flex justify-center  items-center text-lg shadow-md  rounded text-white transition-all active:scale-95    `}
              type="submit"
              disabled={!isButtonEnabled || isAnyValueEmpty}
              onClick={
                isAddressFetched
                  ? isAddressChanged
                    ? updateAddress
                    : handleSubmit
                  : addAddress
              }
            >
              {isAddressFetched
                ? isAddressChanged
                  ? 'Update Address'
                  : 'Buy Now'
                : 'Add Address'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
export default AddressModal
