import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CustomAlert from '../components/CustomAlert'

const ResetPassword = () => {
  const [resetToken, setResetToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertTheme, setAlertTheme] = useState('success')

  const navigate = useNavigate()

  const resetPassword = async () => {
    try {
      const { data } = await axios.post('/users/reset-password', {
        resetToken,
        newPassword,
      })

      if (data.success) {
        setAlertOpen(true)
        setAlertMessage(`Password reset successful`)
        setAlertTheme('success')
        setTimeout(() => {
          navigate('/login')
        }, 2000)
      } else {
        setAlertOpen(true)
        setAlertMessage(data.message)
        setAlertTheme('error')
      }
    } catch (error) {
      console.log(error)
      setAlertOpen(true)
      setAlertMessage('Internal server error')
      setAlertTheme('error')
    }
  }

  return (
    <div className="flex relative justify-center items-center w-full max-md:bg-gradient-to-br from-red-400 to-violet-700 min-h-screen h-screen">
      {/* gradient side */}
      <div className="w-1/2 lg:w-7/12 max-md:hidden h-full flex items-center justify-center bg-gradient-to-br from-red-400 to-violet-700">
        <div className="mx-2 flex flex-col gap-y-2">
          <h1 className="text-2xl text-white font-semibold ">Reset Password</h1>
          <h1 className="text-base text-white font-semibold italic">
            1. Provide the token sent to your email
          </h1>
          <h1 className="text-base text-white font-semibold italic">
            2. Set new password
          </h1>
          <h1 className="text-base text-white font-semibold italic">
            3. Login with new Password
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
        <div className="border border-violet-100 shadow-xl  my-auto md:my-0 bg-white  rounded-lg py-4 px-4 h-72 justify-around w-80 flex flex-col">
          <h1 className="lg:text-lg font-medium">
            Confirm token and enter new password
          </h1>
          <input
            type="text"
            placeholder="enter the token"
            onChange={(e) => setResetToken(e.target.value)}
          />
          <input
            type="password"
            placeholder="enter new password"
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button
            className="w-full h-10 rounded-lg font-bold text-lg text-gray-300 hover:text-white bg-secondary active:scale-95 transition-all"
            onClick={resetPassword}
          >
            Change password
          </button>
        </div>
      </div>
    </div>
  )
}
export default ResetPassword
