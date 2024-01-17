import { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import FormInput from '../components/FormInput.jsx'
import { COLORS } from '../styles/color.js'
import CustomAlert from '../components/CustomAlert.jsx'
import { useDispatch } from 'react-redux'
import { setUser } from '../slices/userSlice.js'

const OtpValidationPage = ({
  name,
  email,
  password,
  mobile,
  setShowOtpPage,
}) => {
  const [otp, setOtp] = useState('')
  const [isFormValid, setIsFormValid] = useState(true)

  const [alertOpen, setAlertOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertTheme, setAlertTheme] = useState('success')

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const validateOTP = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    if (form.checkValidity() === false) {
      setIsFormValid(false)
    }
    try {
      const response = await axios.post('/users/verify-otp', {
        name,
        email,
        password,
        mobile,
        otp,
      })
      const data = response.data

      if (data.success) {
        setAlertOpen(true)
        setAlertMessage(data.message)
        setAlertTheme('success')
        const expirationTime = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 3
        dispatch(setUser({ user: data.user, exp: expirationTime }))
        setTimeout(() => {
          navigate('/')
        }, 1500)
      } else {
        setAlertOpen(true)
        setAlertMessage(data.message)
        switch (data.errorType) {
          case 'ExpiredOTP':
            setAlertTheme('warning')
            break
          case 'OTPVerificationFailed':
            setAlertTheme('error')
            break
          default:
            setAlertTheme('error')
        }
        navigate('/register')
      }
    } catch (error) {
      setAlertOpen(true)
      setAlertMessage('OTP verification failed. Please try again.')
      setAlertTheme('error')
      navigate('/register')
    }
  }

  return (
    <div
      className="relative h-screen p-4 w-full flex text-white flex-col pb-10 items-center gap-5"
      style={{ background: COLORS.GRADIENT }}
    >
      <div className="absolute top-5">
        <CustomAlert
          open={alertOpen}
          theme={alertTheme}
          setOpen={setAlertOpen}
          message={alertMessage}
        />
      </div>
      <div className="border my-auto text-black bg-white rounded-lg py-4 px-4  w-80 flex flex-col">
        <h1
          className="text-[1.7rem] font-medium"
          style={{ color: COLORS.BACKGROUND }}
        >
          Enter OTP
        </h1>
        <form onSubmit={validateOTP} className="flex flex-col mt-3">
          <FormInput
            label="Enter the OTP"
            type="text"
            name="otp"
            placeholder="enter the otp"
            value={otp}
            errorMessage="enter the valid otp"
            pattern="[0-9]{4}"
            onchange={setOtp}
            isFormValid={isFormValid}
          />
          <button className="w-full py-2 text-gray-100 bg-gradient-to-br from-red-400 to-violet-600 rounded-lg font-bold  text-sm mt-5 hover:scale-[1.01] active:scale-[0.99] transition-all hover:text-white">
            Submit
          </button>
        </form>

        <hr className="mt-8 border-t-2 border-gray-200" />
        <p className="text-red-600  text-center text-sm font-semibold my-3">
          otp is valid for only 10 min!
        </p>
        <div className="flex text-xs text-gray-500 font-medium gap-x-1">
          {'989776234'}
          <p
            className="italic text-blue-500 underline cursor-pointer"
            onClick={() => {
              setShowOtpPage(false)
            }}
          >
            change number?
          </p>
        </div>
      </div>
    </div>
  )
}
export default OtpValidationPage
