import axios from 'axios'
import ProductCard from '../components/ProductCard'
import { COLORS } from '../styles/color'
import { useEffect, useState } from 'react'
import Pagination from '@mui/material/Pagination'
import { filterProducts, searchProductApi } from '../api'
import HomeProductSkelton from '../components/skeltons/HomeProductSkelton'
import { useSelector } from 'react-redux'
import LoginToContinue from '../components/modals/LoginModal'

const HomePage = () => {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [pageLoading, setPageLoading] = useState(false)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [isVisible, setIsVisible] = useState(false)
  const [loginModal, setLoginModal] = useState(false)
  const searchResults = useSelector((state) => state.search.searchResults)
  const search = useSelector((state) => state.search.search)
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn)

  const fetchAllProducts = async () => {
    setIsLoading(true)
    setPageLoading(true)
    try {
      const { data } = await axios.get(
        `/products/view-all-products?page=${page}`
      )
      // console.log(data)

      if (data.success) {
        setTotalPages(data.totalPages)
        setProducts(data.products)
        setTimeout(() => {
          setPageLoading(false)
          setIsLoading(false)
        }, 1000)
      } else {
        setProducts((prev) => {
          return [...prev]
        })
        setTimeout(() => {
          setPageLoading(false)
          setIsLoading(false)
        }, 1000)
      }
    } catch (err) {
      console.log('error : ' + err)
      setIsLoading(false)
      setPageLoading(false)
      setProducts((prev) => {
        return [...prev]
      })
    }
  }

  useEffect(() => {
    fetchAllProducts()
  }, [page])

  const fetchProductsByCategory = async (category) => {
    try {
      const response = await filterProducts(page, { category })
      if (response.success) {
        setProducts(response.products)
        setTotalPages(response.totalPages)
        setTimeout(() => {
          setPageLoading(false)
          setIsLoading(false)
        }, 1000)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      setProducts([])
    }
  }

  const handleCategorySelection = (category) => {
    setPage(1)
    setSelectedCategory(category)
    window.scrollTo(0, 0)
    if (category === 'All') {
      fetchAllProducts()
    } else {
      fetchProductsByCategory(category)
    }
  }

  useEffect(() => {
    if (search) {
      setProducts(searchResults)
      setTotalPages(1)
    } else {
      setProducts((prev) => [...prev])
    }
  }, [searchResults, page])

  // scroll button functionality
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  // category style and class
  const categoryStyle = (category) => {
    if (category === selectedCategory) {
      return `${categoryClass} bg-gradient-to-br from-red-400 to-violet-700`
    } else {
      return `${categoryClass}`
    }
  }

  const categoryClass =
    'w-fit px-2 py-1 cursor-pointer text-white rounded my-1 text-center flex items-center font-medium hover:bg-gradient-to-br from-red-400 to-violet-700 px-2 '

  return (
    <div className="z-0 relative ">
      <div className="flex gap-x-3 z-30 sticky bg-secondary  items-center -mt-4 top-0 w-full h-12 px-3 py-[4px]">
        <p
          className={categoryStyle('All')}
          onClick={() => handleCategorySelection('All')}
        >
          All
        </p>
        <p
          className={categoryStyle('smartphone')}
          onClick={() => handleCategorySelection('smartphone')}
        >
          Smartphone
        </p>
        <p
          className={categoryStyle('laptop')}
          onClick={() => handleCategorySelection('laptop')}
        >
          Laptop
        </p>
        <p
          className={categoryStyle('tab')}
          onClick={() => handleCategorySelection('tab')}
        >
          Tab
        </p>
        <p
          className={categoryStyle('smartwatch')}
          onClick={() => handleCategorySelection('smartwatch')}
        >
          Smartwatch
        </p>
      </div>

      <div
        className={`p-4 grid w-full h-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4  overflow-x-hidden`}
        style={{ background: COLORS.CREAM }}
      >
        {isLoading ? (
          Array(6)
            .fill()
            .map((_, index) => <HomeProductSkelton key={index} />)
        ) : products && products.length > 0 ? (
          products.map((product) => (
            <ProductCard
              product={product}
              pageLoading={pageLoading}
              key={product._id}
              isLoggedIn={isLoggedIn}
              setLoginModal={setLoginModal}
            />
          ))
        ) : (
          <div className="w-screen  h-96 flex justify-center items-center">
            <p className="text-xl font-semibold text-gray-600">{`Oops! No Products found :(`}</p>
          </div>
        )}
      </div>
      {loginModal && <LoginToContinue setLoginModal={setLoginModal} />}
      {/* scroll to top button */}
      {isVisible && (
        <div
          className="fixed right-4 bottom-8 lg:right-8 lg:bottom-8 bg-red-500 shadow-md shadow-gray-700 p-2 rounded-xl w-12 h-12 flex items-center justify-center overflow-hidden aspect-square"
          onClick={scrollToTop}
        >
          <img src="/ScrollToTop.png" alt="scroll to top" />
        </div>
      )}
      <div
        className="w-full flex justify-center items-center h-20"
        style={{ background: COLORS.CREAM }}
      >
        <Pagination
          count={totalPages}
          page={page}
          onChange={(event, value) => {
            setPage(value)
            window.scrollTo(0, 0)
          }}
        />
      </div>
    </div>
  )
}
export default HomePage
