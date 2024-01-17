import { useState } from 'react'
import axios from 'axios'
import './../styles/FormStyles.css'
import { Link, useNavigate } from 'react-router-dom'
import FormInput from '../components/FormInput.jsx'
import { useDispatch } from 'react-redux'
import { setUser } from '../slices/userSlice.js'
import CustomAlert from '../components/CustomAlert.jsx'
import { TypeAnimation } from 'react-type-animation'

const LoginPage = () => {
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
      const { data } = await axios.post('/users/login', {
        email,
        password,
      })

      if (data.success) {
        setAlertOpen(true)
        setAlertMessage(data.message)
        setAlertTheme('success')
        const expirationTime = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 3
        dispatch(setUser({ user: data.user, exp: expirationTime }))
        setTimeout(() => {
          navigate('/')
        }, 1000)
      } else {
        setAlertOpen(true)
        setAlertMessage(data.message)
        setAlertTheme('error')

        navigate('/login')
      }
    } catch (error) {
      setAlertOpen(true)
      setAlertMessage('Login failed. Please try again.')
      setAlertTheme('error')
      navigate('/login')
    }
  }

  return (
    <div className="flex justify-center items-center max-md:bg-gradient-to-br from-red-400 to-violet-700 min-h-screen h-screen">
      {/* gradient side */}
      <div className="w-1/2 lg:w-7/12 max-md:hidden h-full flex items-center justify-center bg-gradient-to-br from-red-400 to-violet-700">
        <div className="mx-2">
          <TypeAnimation
            sequence={[
              // Same substring at the start will only be typed out once, initially
              'Welcome to Gadget Bazaar',
              3000, // wait 1s before replacing "Mice" with "Hamsters"
              'Login-in to  world of tech',
              2000,
              'All the tech, in one place',
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
      <div className=" relative p-4 w-1/2 lg:w-5/12  flex h-full items-center justify-center text-black flex-col pb-10  gap-5">
        <div className="absolute top-5">
          <CustomAlert
            open={alertOpen}
            theme={alertTheme}
            setOpen={setAlertOpen}
            message={alertMessage}
          />
        </div>

        <div className="border border-violet-100 shadow-xl  my-auto md:my-0 bg-white  rounded-lg py-4 px-4  w-80 flex flex-col">
          <h1 className="text-3xl font-bold text-secondary">Sign in</h1>
          <form onSubmit={login} className="flex flex-col mt-3">
            <FormInput
              label="Email"
              type="email"
              name="email"
              placeholder="Enter your email"
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
              placeholder="At-least 6 characters"
              value={password}
              onchange={setPassword}
              isFormValid={isFormValid}
            />
            <Link
              to="/forgot-password"
              className="self-end text-sm font-medium text-blue-400 hover:text-blue-700"
            >
              forgot password?
            </Link>
            <button className="w-full py-2 text-gray-100 bg-gradient-to-br from-red-400 to-violet-600 rounded-lg font-bold  text-sm mt-5 hover:scale-[1.01] active:scale-[0.99] transition-all hover:text-white">
              Login
            </button>
          </form>

          <hr className="my-8 border-t-2 border-gray-200" />

          <p className=" text-center -mt-2 mb-5 text-md font-normal">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-purple-800 p-1 rounded-xl italic font-semibold  hover:text-purple-800 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
export default LoginPage
