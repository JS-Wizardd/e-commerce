import { useState } from 'react'
import axios from 'axios'
import '../styles/FormStyles.css'
import { Link, useNavigate } from 'react-router-dom'
import FormInput from '../components/FormInput.jsx'
import OtpValidationPage from './OtpValidationPage.jsx'
import { COLORS } from '../styles/color'
import CustomAlert from '../components/CustomAlert.jsx'
import { setUser } from '../slices/userSlice.js'
import { useDispatch } from 'react-redux'
import { TypeAnimation } from 'react-type-animation'

const RegisterPage = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [mobile, setMobile] = useState('')

  const [isFormValid, setIsFormValid] = useState(true)
  const [showOtpPage, setShowOtpPage] = useState(false)

  const [alertOpen, setAlertOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertTheme, setAlertTheme] = useState('success')

  const navigate = useNavigate()

  const register = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    if (form.checkValidity() === false) {
      setIsFormValid(false)
      // console.log(showOtpPage)
    }
    try {
      const { data } = await axios.post('/users/register', {
        name,
        email,
        password,
        mobile,
      })

      // console.log(data)
      if (data.success) {
        setAlertOpen(true)
        setAlertMessage(`an otp is send to ${mobile}, valid for 10 min`)
        setAlertTheme('success')
        const expirationTime = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 3
        dispatch(setUser({ user: data.user, exp: expirationTime }))
        setTimeout(() => {
          setShowOtpPage(true)
        }, 2000)
      } else {
        setAlertOpen(true)
        setAlertMessage(`registration couldn't complete!`)
        setAlertTheme('error')
        navigate('/register')
      }
    } catch (error) {
      setAlertOpen(true)
      setAlertMessage(`registration failed`)
      setAlertTheme('error')
      navigate('/register')
    }
  }

  return (
    <div className="p-0 w-full bg-gradient-to-br from-red-400 to-violet-700">
      {showOtpPage ? (
        <OtpValidationPage
          name={name}
          email={email}
          password={password}
          mobile={mobile}
          setShowOtpPage={setShowOtpPage}
        />
      ) : (
        <div className=" flex justify-center  items-center  min-h-screen p-0 m-0">
          {/* gradient side */}
          <div className="w-1/2 max-md:hidden  bottom-5 flex  h-full items-center justify-center ">
            <div className="mx-2 h-full">
              <TypeAnimation
                sequence={[
                  'Welcome to Gadget Bazaar',
                  3000,
                  'Register to continue',
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
          {/* register side */}
          <div className="absolute top-5">
            <CustomAlert
              open={alertOpen}
              theme={alertTheme}
              setOpen={setAlertOpen}
              message={alertMessage}
            />
          </div>
          <div className="border  my-4  rounded-lg py-4 px-6  w-96 flex flex-col bg-white text-black">
            <h1
              className="text-3xl font-bold"
              style={{ color: COLORS.BACKGROUND }}
            >
              Create Account
            </h1>
            <form onSubmit={register} className="flex flex-col mt-3">
              <FormInput
                label="Your Name"
                type="text"
                name="name"
                placeholder="First and last name"
                value={name}
                errorMessage="Username should be 3-16 characters and shouldn't include any special character!"
                pattern="^[A-Za-z\s]{3,16}$"
                onchange={setName}
                isFormValid={isFormValid}
              />

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
                label="Mobile number"
                type="tel"
                name="mobile"
                placeholder="Your mobile number"
                errorMessage="enter a valid mobile number!"
                value={mobile}
                onchange={setMobile}
                pattern="^[6-9]\d{9}$"
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
                pattern="^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%^&*]{6,16}$"
                isFormValid={isFormValid}
              />

              <FormInput
                label="Re-enter password"
                type="password"
                name="confirmPassword"
                placeholder="At-least 6 characters"
                errorMessage="Passwords should match!"
                value={confirmPassword}
                pattern={password}
                onchange={setConfirmPassword}
                isFormValid={isFormValid}
              />

              <button className="w-full py-2 text-gray-100 bg-gradient-to-br from-red-400 to-violet-600 rounded-lg font-bold  text-sm mt-5 hover:scale-[1.01] active:scale-[0.99] transition-all hover:text-white">
                Continue
              </button>
            </form>

            <hr className="my-8 border-t-2 border-gray-200" />

            <div className="flex flex-col items-center justify-around">
              <p className=" text-center -mt-2 mb-5 text-md font-normal">
                Already have an account?{''}
                <Link
                  to="/login"
                  className="text-purple-800  p-1 rounded-xl italic font-semibold  hover:text-purple-800 hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default RegisterPage
