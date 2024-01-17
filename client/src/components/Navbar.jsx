import { useEffect, useState } from 'react'
import { COLORS } from '../styles/color'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { setSidebarToggle } from '../slices/sidebarSlice'
import { useSelector, useDispatch } from 'react-redux'
import { setSearchResults, setSearch } from '../slices/searchSlice'
import { setCart } from '../slices/cartSlice'
import { fetchCart, searchProductApi } from '../api'
const Navbar = () => {
  const [productList, setProductList] = useState([])
  const [hasSearched, setHasSearched] = useState(false)

  const dispatch = useDispatch()
  const search = useSelector((state) => state.search.search)
  const user = useSelector((state) => state.user.user)
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn)

  // console.log('user: ', user)
  // console.log('isLoggedIn: ', isLoggedIn)

  let cartQuantity = useSelector((state) => state.cart.totalQuantity)

  const navigate = useNavigate()

  useEffect(() => {
    setHasSearched(false)
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `/products/search-term/?searchTerm=${search}`
        )
        // console.log(response.data.suggestions)
        setProductList(response.data.suggestions)
      } catch (error) {
        console.error('Could not fetch products:', error)
      }
    }

    if (search) {
      fetchProducts()
    }
  }, [search])

  // cart fetch
  const fetchData = async () => {
    if (!isLoggedIn) {
      return
    }
    try {
      const { success, totalQuantity } = await fetchCart()
      // console.log(success, cart, totalPrice, totalQuantity)
      if (success) {
        dispatch(
          setCart({
            totalQuantity,
          })
        )
      }
    } catch (error) {
      console.error('something went wrong while fetching cart')
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // cart fetch end
  const searchProduct = async () => {
    navigate('/')
    try {
      const data = await searchProductApi(search)

      if (data.success) {
        dispatch(setSearchResults(data.product))
        setHasSearched(true)

        // console.log(data.product)
      } else {
        dispatch(setSearchResults([]))
        navigate('/')
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      return { error: error.message }
    }
  }

  return (
    <div className="max-sm:mb-10">
      <nav
        className={`absolute top-0 left-0 overflow-hidden right-0 h-20 max-sm:h-32 transition-all ease-in-out  flex  flex-col gap-y-2 pb-2 z-30 overflow-x-hidden bg-secondary`}
      >
        <div className="flex my-auto relative items-center justify-between px-2 md:px-8 sm:px-5 gap-x-5 lg:gap-x-10">
          {/* left */}
          <div className=" min-w-fit">
            <div className="flex gap-x-6 ml-3 sm:gap-x-10   items-center">
              <motion.img
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.1 },
                }}
                whileTap={{ scale: 0.95 }}
                src="/hamburger.png"
                className="h-8 mr-2 "
                alt="hamburger"
                onClick={() => {
                  dispatch(setSidebarToggle())
                }}
              />
              <Link to="/" className="-ml-8">
                <motion.img
                  whileTap={{ scale: 0.95 }}
                  src="/logo_nav.png"
                  className="h-16 max-md:hidden max-sm:ml-5  transition lg:inline ease-in-out"
                  alt="Gadget Bazaar logo"
                />
                <motion.img
                  whileHover={{
                    scale: 1.05,
                    transition: { duration: 0.1 },
                  }}
                  whileTap={{ scale: 0.9 }}
                  src="/icon.png"
                  className="h-12  transition md:hidden "
                  alt="Gadget Bazaar mobile logo"
                />
              </Link>
            </div>
          </div>

          {/* middle */}
          <div className=" w-3/4 min-w-[30%]   max-w-[800px] ]  hidden sm:flex flex-col mt-3">
            <div className="flex items-center   focus:border-2 rounded-md  justify-center  ">
              <input
                type="text"
                value={search}
                className="placeholder:text-base "
                placeholder="Search here..."
                onChange={(e) => dispatch(setSearch(e.target.value))}
              />
              <div
                className="h-10 -ml-1   flex w-16 justify-center items-center  z-[1] search__div"
                onClick={searchProduct}
                style={{ background: COLORS.GRADIENT, color: 'white' }}
              >
                <motion.img
                  whileHover={{
                    scale: 1.05,
                    transition: { duration: 0.1 },
                  }}
                  whileTap={{ scale: 0.95 }}
                  src="../../assets/icons/search.png"
                  alt="search"
                  className="w-7 cursor-pointer"
                />
              </div>
            </div>
            {search.length > 0 && !hasSearched && (
              <div className="relative w-full " style={{ zIndex: '100' }}>
                <div className="fixed cursor-pointer top-16 z-50 sm:w-2/6 md:w-2/5 border shadow-md bg-purple-100 p-1 h-fit rounded-lg ">
                  {productList.length > 0 ? (
                    productList.map((value, i) => (
                      <p
                        key={i}
                        onClick={() => {
                          dispatch(setSearch(value.name))
                        }}
                        className=" p-1 border-b rounded-lg hover:bg-purple-300 hover:font-medium  my-1 "
                      >
                        {value.name}
                      </p>
                    ))
                  ) : (
                    <p className=" p-1 border-b rounded-lg  font-medium italic hover:font-medium my-1 ">
                      {`Search for "${search}"`}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* right */}
          <div className=" flex items-center">
            <div className="flex justify-between gap-x-4 sm:gap-x-8   items-center">
              <Link to={'/account'} className="whitespace-nowrap text-white ">
                <p className="text-xs leading-none">
                  Hello, {isLoggedIn ? user.name : 'sign in'}
                </p>
                <p className="text-xl font-semibold">Account</p>
              </Link>
              {/*
              <Link to={'/orders'} className="-mb-3 ">
                <h1 className="text-xl font-semibold text-white ">Orders</h1>
              </Link> */}

              <Link to={'/cart'}>
                <motion.div
                  whileHover={{
                    scale: 1.05,
                    transition: { duration: 0.1 },
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="relative p-2"
                >
                  <p className="absolute top-0 right-2 text-xs bg-red-400 text-white font-bold rounded-full px-[5px]">
                    {cartQuantity}
                  </p>
                  <img
                    src="../../assets/icons/cart.png"
                    className="w-10 min-w-[25px] sm:min-w-[35px]"
                    alt="cart"
                  />
                </motion.div>
              </Link>
            </div>
          </div>
        </div>

        {/* mobile search */}
        <div
          className={`transition-all ease-in-out px-4 w-full hidden max-sm:flex `}
        >
          <div className="flex flex-col  items-center  rounded-md w-full  h-11 ">
            <div className="w-full flex items-center   h-full">
              <input
                type="text"
                className=".search__input h-full focus:border-2 focus:border-red-400 placeholder:text-base"
                placeholder="Search here..."
                value={search}
                onChange={(e) => dispatch(setSearch(e.target.value))}
              />
              <div
                className="h-full px-2 flex search__div items-center -ml-1 search__div"
                onClick={() => {
                  searchProduct()
                }}
                style={{ background: COLORS.GRADIENT, color: 'white' }}
              >
                <motion.img
                  whileHover={{
                    scale: 1,
                    transition: { duration: 0.1 },
                  }}
                  whileTap={{ scale: 0.9 }}
                  src="../../assets/icons/search.png"
                  alt="search"
                  className="w-7 cursor-pointer"
                />
              </div>
            </div>
            {search.length > 0 && !hasSearched && (
              <div className="relative w-full " style={{ zIndex: '100' }}>
                <div className="fixed cursor-pointer  mt-1 w-5/6 shadow-md bg-purple-100 p-1 h-fit rounded-lg ">
                  {productList.length > 0 ? (
                    productList.map((value, i) => (
                      <p
                        key={i}
                        onClick={() => {
                          dispatch(setSearch(value.name))
                          searchProduct()
                        }}
                        className=" p-1 border-b rounded-lg hover:bg-purple-300 hover:font-medium  my-1 "
                      >
                        {value.name}
                      </p>
                    ))
                  ) : (
                    <div
                      className=" p-1 border-b rounded-lg flex   italic  my-1 "
                      onClick={() => {
                        dispatch(setSearch(search))
                        searchProduct()
                      }}
                    >
                      Search for&nbsp;
                      <p className="font-medium">{`"${search}"`}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  )
}
export default Navbar
