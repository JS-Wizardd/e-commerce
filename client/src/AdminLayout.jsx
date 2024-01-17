import { Outlet } from 'react-router-dom'
import AdminNavbar from './components/admin/AdminNavbar.jsx'

const AdminLayout = () => {
  return (
    <div className="mt-16">
      <AdminNavbar />
      <Outlet />
    </div>
  )
}

export default AdminLayout
