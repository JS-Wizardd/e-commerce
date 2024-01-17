import { Link, useLocation } from 'react-router-dom'
import { COLORS } from '../../styles/color'
// const tabs = [
//   { id: 1, name: 'Home', link: '/admin/home' },
//   { id: 2, name: 'Products', link: '/admin/products' },
//   { id: 3, name: 'Users', link: '/admin/' },
//   { id: 4, name: 'Booking', link: '/admin/home' },
// ]

const style =
  'flex justify-center items-center px-4 py-2 rounded-xl text-lg lg:text-xl font-semibold hover:text-white hover:scale-105 transition-transform ease-in-out '

const AdminNavbar = () => {
  const location = useLocation()
  const page = location.pathname.split('/')[2]

  return (
    <div
      className="fixed p-3 text cursor-pointer pb-4 left-0 top-0 right-0 h-16 items-center flex z-20  text-white  border-r bg-slate-900 "
      // style={{ background: COLORS.NAV_GRADIENT }}
    >
      <div className="flex w-full text justify-start items-start text-slate-500 overflow-auto py-4">
        <Link
          to="/admin"
          className={`${style} text-${
            page === undefined ? 'white' : 'slate-500'
          }`}
        >
          Home
        </Link>
        <Link
          to="/admin/products"
          className={`${style} text-${
            page === 'products' ? 'white' : 'slate-500'
          }`}
        >
          Products
        </Link>
        <Link
          to="/admin/users"
          className={`${style} text-${
            page === 'users' ? 'white' : 'slate-500'
          }`}
        >
          Users
        </Link>
        <Link
          to="/admin/orders"
          className={`${style} text-${
            page === 'orders' ? 'white' : 'slate-500'
          }`}
        >
          Orders
        </Link>

        <Link
          to="/admin/profile"
          className={`${style} mr-2 lg:mr-5 self-end ml-auto text-${
            page === 'profile' ? 'white' : 'slate-500'
          }`}
        >
          Admin
        </Link>
      </div>
    </div>
  )
}
export default AdminNavbar
