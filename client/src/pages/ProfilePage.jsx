import axios from 'axios'
import { useEffect, useState } from 'react'
import Loading from '../components/Loading'
import CircularProgress from '@mui/material/CircularProgress'
import EditProfileModal from '../components/modals/EditProfileModal'
import EditAddressModal from '../components/modals/EditAddressModal'
import { Link, useNavigate } from 'react-router-dom'

const ProfilePage = () => {
  const [user, setUser] = useState({})
  const [address, setAddress] = useState({
    address: '',
    street: '',
    city: '',
    state: '',
    pin: '',
  })
  const [profileLoading, setProfileLoading] = useState(false)
  const [addressLoading, setAddressLoading] = useState(false)
  const [profModal, setProfModal] = useState(false)
  const [addModal, setAddModal] = useState(false)
  const navigate = useNavigate()

  const getProfile = async () => {
    setProfileLoading(true)
    try {
      const { data } = await axios.get('/users/profile')
      if (data.success) {
        setProfileLoading(false)

        setUser(data.user)
      } else {
        setProfileLoading(false)
        alert('User profile fetch failed')
      }
    } catch (error) {
      setProfileLoading(false)
      console.error('User profile error' + error)
    }
  }

  const getAddress = async () => {
    setAddressLoading(true)
    try {
      const { data } = await axios.get('/address')
      if (data.success) {
        setAddressLoading(false)
        const { address, street, city, state, pin } =
          data.address.addressDetails
        setAddress({
          address: address || '',
          street: street || '',
          city: city || '',
          state: state || '',
          pin: pin || '',
        })
      } else {
        setAddressLoading(false)
      }
    } catch (error) {
      setAddressLoading(false)
      console.error('Address fetch error' + error)
    }
  }

  useEffect(() => {
    getProfile()
    getAddress()
  }, [profModal, addModal])

  return (
    <>
      <div className="text-2xl sm:text-3xl font-semibold h-14  rounded-sm w-full border-b flex items-center  text-violet-700 mb-5 pl-5">
        <button
          className="bg-secondary hover:bg-accent mb-1 items-center  flex mt-2 rounded-full text-white text-lg text-center mr-3 transition-transform duration-200 hover:scale-105 active:scale-95"
          onClick={() => navigate(-1)}
        >
          <img src="/go back.png" alt="go back" className="h-6" />
        </button>
        My Profile
        <img
          src="../../assets/icons/violet_profile.png"
          className="object-contain ml-2 h-9 mt-2"
        />
      </div>
      <div className="w-full h-full flex max-md:flex-col gap-10 items-center justify-center pb-10 px-5">
        {profModal && <EditProfileModal />}

        {/* profile */}
        <div className="w-full mx-1  sm:w-8/12 md:w-7/12 lg:w-4/12  h-80 r p-2 flex flex-col bg-violet-100 rounded-md py-5">
          {profileLoading ? (
            <div className="w-full h-full flex justify-center items-center gap-y-4 font-medium ">
              <CircularProgress style={{ scale: '1.5' }} />
            </div>
          ) : (
            <div className="w-full h-full flex pl-7 flex-col gap-y-4 font-medium ">
              <div className="w-full flex justify-between border-b mb-1">
                <h1 className="text-2xl lg:text-3xl font-semibold  mb-3">
                  Profile
                </h1>
                {/* <button className="h-8 bg-red-400 transition-all hover:bg-accent p-1 rounded-xl active:scale-95">
                  <img
                    src="/edit.png"
                    className="object-contain max-h-full max-w-full"
                    alt="edit"
                  />
                </button> */}
              </div>
              <div className="flex h-16 items-center justify-start gap-x-10">
                <img
                  src={user?.image}
                  alt="user profile pic"
                  className="object-contain rounded-full max-h-full"
                />
                <p className="text-xl lg:text-2xl font-semibold">
                  {user?.name}
                </p>
              </div>
              <div className="flex gap-x-10">
                email &nbsp; <p>: &nbsp; {user?.email}</p>
              </div>
              <div className="flex gap-x-7">
                mobile &nbsp; <p>: &nbsp; {user?.mobile}</p>
              </div>
              <div className="flex gap-x-2">
                created at &nbsp;
                <p>: &nbsp; {new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm self-end text-blue-500"
              >
                reset password?
              </Link>
            </div>
          )}
        </div>

        {/* address */}
        {addModal && (
          <EditAddressModal
            setAddModal={setAddModal}
            editAddress={address}
            setAddress={setAddress}
          />
        )}
        <div className="w-full mx-1  sm:w-8/12 md:w-7/12 lg:w-4/12  h-80 r p-2 flex flex-col bg-violet-100 rounded-md py-5">
          {addressLoading ? (
            <div className="w-full h-full flex justify-center items-center gap-y-4 font-medium ">
              <CircularProgress style={{ scale: '1.5' }} />
            </div>
          ) : (
            <div className="w-full h-full capitalize pl-7 flex flex-col gap-y-4 font-medium ">
              <div className="flex w-full justify-between border-b mb-1">
                <h1 className="text-2xl lg:text-3xl font-semibold  mb-3">
                  Address
                </h1>
                <button
                  className="h-8  bg-red-400 transition-all hover:bg-accent p-1 rounded-xl active:scale-95"
                  onClick={() => setAddModal(true)}
                >
                  <img
                    src={
                      address?.address?.length < 1 ? '/add.png' : '/edit.png'
                    }
                    className="object-contain max-h-full max-w-full"
                    alt="edit"
                  />
                </button>
              </div>
              <div className="flex gap-x-2">
                address &nbsp; <p>: &nbsp; {address.address}</p>
              </div>
              <div className="flex gap-x-6">
                street &nbsp; <p>: &nbsp; {address.street}</p>
              </div>
              <div className="flex gap-x-11">
                pin &nbsp;
                <p>: &nbsp; {address.pin}</p>
              </div>
              <div className="flex gap-x-10">
                city &nbsp; <p>: &nbsp; {address.city}</p>
              </div>
              <div className="flex gap-x-8">
                state &nbsp; <p>: &nbsp; {address.state}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
export default ProfilePage
