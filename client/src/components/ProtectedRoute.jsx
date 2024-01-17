import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import { checkTokenExpiration } from '../slices/userSlice'

const ProtectedRoute = ({ children, role }) => {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(checkTokenExpiration())
  }, [dispatch])

  if (role === 'admin' && !isLoggedIn) {
    return <Navigate to={'/admin-login'} replace />
  }

  if (!isLoggedIn) {
    return <Navigate to={'/login'} replace />
  }
  return children ? children : <Outlet />
}
export default ProtectedRoute
