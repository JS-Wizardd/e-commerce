import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { setSidebarToggle } from '../../slices/sidebarSlice'
import { useDispatch } from 'react-redux'
import { logoutUser } from '../../slices/userSlice'

const LogoutModal = ({ setLogoutModal }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const logout = async () => {
    dispatch(setSidebarToggle())
    setLogoutModal(false)
    const { data } = await axios.post('/users/logout')
    console.log(data)
    if (data.success) {
      dispatch(logoutUser())
      navigate('/login')
    } else {
      alert('logout attempt failed!')
    }
  }

  return (
    <div className="fixed z-50 top-0 right-0 left-0 bottom-0 flex justify-center items-center bg-black/70">
      <div className="w-2/5 max-sm:w-4/5 h-44 r p-5 flex flex-col bg-slate-50 rounded-md">
        <div className="h-3/4 text-start flex justify-start items-center">
          <p className="text-lg flex font-medium">
            Are you sure you want to logout?
          </p>
        </div>
        <div className="h-1/4 flex gap-x-2 w-full ">
          <button
            className={`border border-red-600 w-2/4 bg-red-100 flex items-center justify-center py-3 rounded hover:bg-red-600 hover:text-white font-semibold active:scale-95 hover:shadow transition-all `}
            onClick={logout}
          >
            logout
          </button>
          <button
            className="border active:scale-95 border-blue-600 bg-blue-100 flex items-center justify-center w-2/4 py-3 rounded hover:bg-blue-600 hover:text-white font-semibold hover:shadow transition-all "
            onClick={() => {
              setLogoutModal(false)
              dispatch(setSidebarToggle())
            }}
          >
            cancel
          </button>
        </div>
      </div>
    </div>
  )
}
export default LogoutModal
