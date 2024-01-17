import { Link, useLocation, useNavigate } from 'react-router-dom'
import SidebarTab from './SidebarTab'
import { COLORS } from '../styles/color'
import { setSidebarToggle } from '../slices/sidebarSlice'
import { useSelector, useDispatch } from 'react-redux'
import { useState } from 'react'
import LogoutModal from './modals/logoutModal'

const Sidebar = () => {
  const location = useLocation()
  const page = location.pathname.split('/')[2]

  const navigate = useNavigate()

  const dispatch = useDispatch()
  const sidebarToggle = useSelector((state) => state.sidebar.sidebarToggle)
  const user = useSelector((state) => state.user.user)
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn)

  const [logoutModal, setLogoutModal] = useState(false)

  const handleProfileClick = () => {
    if (isLoggedIn) {
      dispatch(setSidebarToggle())
      navigate('/account')
    } else {
      navigate('/login')
    }
  }

  return (
    <div className="z-[31] ">
      <div
        className={`fixed z-[31]  ${
          sidebarToggle ? 'block bg-black/50  ' : 'hidden bg-black/10  '
        } z-10 top-0 w-full   left-0 bottom-0 transition-all ease-in-out `}
        onClick={() => {
          dispatch(setSidebarToggle())
        }}
      >
        <img
          src="../../assets/icons/modal-close.png"
          alt="sidebar-close"
          className="fixed left-52 ml-3  scale-105 top-5 cursor-pointer"
        />
      </div>
      <div
        className={`fixed z-[31] border-r rounded-lg cursor-pointer  top-0 left-0 bg-white  bottom-0 gap-y-1 w-52 flex flex-col   py-4 ${
          sidebarToggle ? 'translate-x-0' : '-translate-x-52'
        } transition-all ease-in-out overflow-hidden px-2`}
        style={{ background: COLORS.WHITE }}
      >
        <div
          className="flex text-xl w-full rounded-md text-secondary font-medium gap-x-2 px-3 h-16 items-center transition-all duration-300 hover:scale-100 active:scale-95 mb-6"
          onClick={handleProfileClick}
        >
          Hello,{' '}
          <p className="font-bold">{isLoggedIn ? user.name : 'Sign In'}</p>
        </div>
        <SidebarTab
          src="../../assets/icons/home.png"
          name="Home"
          toLink="/"
          page={page}
          customImgClass=""
        />
        <SidebarTab
          src="../../assets/icons/android.png"
          name="smartphone"
          toLink="/products/smartphone"
          page={page}
          customImgClass=""
        />
        <SidebarTab
          src="../../assets/icons/tab.png"
          name="tab"
          toLink="/products/tab"
          page={page}
          customImgClass=""
        />
        <SidebarTab
          src="../../assets/icons/laptop.png"
          name="laptop"
          toLink="/products/laptop"
          page={page}
          customImgClass=""
        />
        <SidebarTab
          src="../../assets/icons/smartwatch.png"
          name="smartwatch"
          toLink="/products/smartwatch"
          page={page}
          customImgClass=""
        />
        <button
          className="mt-auto mb- text-lg w-full h-12  rounded-lg border flex items-center justify-center  hover:bg-red-500 hover:text-white font-semibold text-red-600 transition-all ease-in-out"
          onClick={() => setLogoutModal(true)}
        >
          Logout
        </button>
      </div>
      {logoutModal && <LogoutModal setLogoutModal={setLogoutModal} />}
    </div>
  )
}
export default Sidebar
