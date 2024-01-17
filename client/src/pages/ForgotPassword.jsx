import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import CustomAlert from '../components/CustomAlert'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertTheme, setAlertTheme] = useState('success')
  const navigate = useNavigate()

  const forgotPassword = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post('/users/forgot-password', { email })
      if (data.success) {
        // console.log(data)
        setAlertOpen(true)
        setAlertMessage(`a 8 digit token is sent to your email`)
        setAlertTheme('success')

        setTimeout(() => {
          navigate('/reset-password')
        }, 3000)
      } else {
        setAlertOpen(true)
        setAlertMessage(data.message)
        setAlertTheme('error')
      }
    } catch (error) {
      setAlertOpen(true)
      setAlertMessage(data.message)
      setAlertTheme('error')
    }
  }

  return (
    <div className="flex relative justify-center items-center w-full max-md:bg-gradient-to-br from-red-400 to-violet-700 min-h-screen h-screen">
      {/* gradient side */}
      <div className="w-1/2 lg:w-7/12 max-md:hidden h-full flex items-center justify-center bg-gradient-to-br from-red-400 to-violet-700">
        <div className="mx-2 flex flex-col gap-y-2">
          <h1 className="text-2xl text-white font-semibold ">
            Forgot Password?
          </h1>
          <h1 className="text-base text-white font-semibold italic">
            1. Provide your existing email
          </h1>
          <h1 className="text-base text-white font-semibold italic">
            2. A reset token will be send to your email
          </h1>
          <h1 className="text-base text-white font-semibold italic">
            3. Enter the token and set your new password
          </h1>
        </div>
      </div>

      <div className=" relative p-4 w-1/2 lg:w-5/12 h-full flex  items-center justify-center text-black flex-col pb-10  gap-5">
        <div className="absolute top-5">
          <CustomAlert
            open={alertOpen}
            theme={alertTheme}
            setOpen={setAlertOpen}
            message={alertMessage}
          />
        </div>
        <div className="border border-violet-100 shadow-xl  my-auto md:my-0 bg-white  rounded-lg py-4 px-4 h-56 justify-around w-80 flex flex-col">
          <h1 className="lg:text-lg font-medium">
            Forgot password? confirm your email to proceed
          </h1>
          <form
            onSubmit={forgotPassword}
            className="h-full flex flex-col justify-around"
          >
            <input
              type="email"
              placeholder="enter your current email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              className={`w-full h-10 rounded-lg font-bold text-lg text-gray-300 hover:text-white bg-secondary active:scale-95 transition-all ${
                !email && 'cursor-not-allowed'
              }`}
              disabled={!email}
              onClick={forgotPassword}
            >
              submit
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
export default ForgotPassword
