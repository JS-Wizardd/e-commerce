import { Outlet } from 'react-router-dom'

import Sidebar from './components/Sidebar.jsx'
import { StateContext } from './StateContext.jsx'
import { useContext, useEffect, useState } from 'react'
import Navbar from './components/Navbar.jsx'

const Layout = () => {
  const { sidebarToggle } = useContext(StateContext)

  return (
    <div
      className={`mt-36 sm:mt-24  max-lg:ml-auto   transition-all ease-in-out `}
    >
      <Navbar />
      <Sidebar />
      <Outlet />
    </div>
  )
}

export default Layout
