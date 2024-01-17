import { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import FormInput from '../../components/FormInput.jsx'
import { COLORS } from '../../styles/color'
import { useDispatch } from 'react-redux'
import CustomAlert from '../../components/CustomAlert.jsx'
import { setUser } from '../../slices/userSlice.js'
import { TypeAnimation } from 'react-type-animation'

const AdminLoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isFormValid, setIsFormValid] = useState(true)
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertTheme, setAlertTheme] = useState('success')

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const login = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    if (form.checkValidity() === false) {
      setIsFormValid(false)
    }
    try {
      const { data } = await axios.post('/admin/login', {
        email,
        password,
      })

      // console.log(data)
      if (data.success) {
        // console.log(data)
        setAlertOpen(true)
        setAlertMessage(data.message)
        setAlertTheme('success')
        const expirationTime = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 3
        dispatch(setUser({ user: data.user, exp: expirationTime }))
        setTimeout(() => {
          navigate('/admin')
        }, 1000)
      } else {
        setAlertOpen(true)
        setAlertMessage(data.message)
        setAlertTheme('error')

        navigate('/admin-login')
      }
    } catch (error) {
      console.error(error)
      setAlertOpen(true)
      setAlertMessage('Login failed. Please try again.')
      setAlertTheme('error')
      navigate('/admin-login')
    }
  }

  return (
    <div className="flex justify-center items-center max-md:bg-gradient-to-br from-slate-800 to-slate-600 min-h-screen h-screen">
      {/* gradient side */}
      <div className="w-1/2 lg:w-7/12 max-md:hidden h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-500">
        <div className="mx-2">
          <TypeAnimation
            sequence={[
              // Same substring at the start will only be typed out once, initially
              'Welcome to Gadget Bazaar',
              3000, // wait 1s before replacing "Mice" with "Hamsters"
              'Sign in,Admin',
              2000,
            ]}
            wrapper="span"
            speed={10}
            style={{
              fontSize: '2em',
              fontWeight: '900',
              display: 'inline-block',
              color: 'white',
              stroke: '1',
            }}
            repeat={Infinity}
          />
        </div>
      </div>

      {/* login side */}
      <div className=" relative p-4 w-1/2 lg:w-5/12  flex  items-center justify-center text-black flex-col pb-10  gap-5">
        <div className="border border-violet-100 shadow-xl  my-auto md:my-0 bg-white  rounded-lg py-4 px-4  w-80 flex flex-col">
          <h1 className="text-3xl font-bold">Sign in,Admin</h1>
          <form onSubmit={login} className="flex flex-col mt-3">
            <FormInput
              label="Email"
              type="email"
              name="email"
              placeholder="admin@gmail.com"
              value={email}
              errorMessage="enter a valid email!"
              onchange={setEmail}
              isFormValid={isFormValid}
            />

            <FormInput
              label="Password"
              type="password"
              name="password"
              errorMessage="Password should be 6-16 characters and should contain letter,number and special characters!"
              placeholder="Admin123"
              value={password}
              onchange={setPassword}
              pattern="^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%^&*]{6,16}$"
              isFormValid={isFormValid}
            />

            <button className="w-full py-2 text-white rounded-lg font-bold  text-sm mt-5 bg-gradient-to-br from-slate-800 to-slate-500 hover:scale-[1.01] active:scale-[0.99] transition-all hover:text-white">
              Login
            </button>
          </form>

          <hr className="my-8 border-t-2 border-gray-200" />

          <p className=" text-center -mt-2 mb-5 text-md font-normal">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-blue-600 p-1 rounded-xl italic font-semibold  hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
export default AdminLoginPage
