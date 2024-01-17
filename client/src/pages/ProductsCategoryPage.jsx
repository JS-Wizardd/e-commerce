import ProductCard from '../components/ProductCard'
import { COLORS } from '../styles/color'
import { useEffect, useState } from 'react'
import Pagination from '@mui/material/Pagination'
import { filterProducts } from '../api'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import HomeProductSkelton from '../components/skeltons/HomeProductSkelton'

const ProductsCategoryPage = () => {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isVisible, setIsVisible] = useState(false)

  const navigate = useNavigate()

  const { category } = useParams()

  const searchResults = useSelector((state) => state.search.searchResults)
  const search = useSelector((state) => state.search.search)

  const fetchProductsByCategory = async (category) => {
    setIsLoading(true)
    try {
      const response = await filterProducts(page, { category })
      setProducts(response.products)
      setTotalPages(response.totalPages)
      setTimeout(() => {
        setIsLoading(false)
      }, 1000)
    } catch (error) {
      setTimeout(() => {
        setIsLoading(false)
      }, 1000)
      console.error('Error fetching products:', error)
      setProducts([])
    }
  }

  useEffect(() => {
    fetchProductsByCategory(category)
  }, [category])

  useEffect(() => {
    if (search) {
      setProducts(searchResults)
    } else {
      setProducts((prev) => [...prev])
    }
  }, [searchResults, page])

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }
  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <div className="pt-3 relative" style={{ background: COLORS.CREAM }}>
      <div className="flex px-5   items-center justify-between">
        <div
          className="flex w-full gap-x-0"
          style={{ background: COLORS.CREAM }}
        >
          <button
            className="bg-secondary ml-4 hover:bg-accent mb-1 items-center  flex mt-2 rounded-full text-white text-lg text-center mr-3 transition-transform duration-200 hover:scale-105 active:scale-95"
            onClick={() => navigate(-1)}
          >
            <img src="/go back.png" alt="go back" className="h-6" />
          </button>
          <h1 className="text-3xl ml-1  text-slate-700 capitalize italic font-semibold ">
            "{category}"
          </h1>
        </div>
      </div>
      <div className="z-0 relative ">
        <div
          className={`p-4 grid w-full h-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 xl:grid-cols-5 overflow-x-hidden`}
        >
          {isLoading ? (
            Array(6)
              .fill()
              .map((_, index) => <HomeProductSkelton key={index} />)
          ) : products && products.length > 0 ? (
            products.map((product) => (
              <ProductCard product={product} key={product._id} />
            ))
          ) : (
            <div className="w-screen  h-96 flex justify-center items-center">
              <p className="text-xl font-semibold text-gray-600">{`Oops! No Products found :(`}</p>
            </div>
          )}
        </div>

        {/* scroll to top button */}
        {isVisible && (
          <div
            className="fixed right-4 bottom-8 lg:right-8 lg:bottom-8 bg-gradient-to-r from-violet-700 to-red-400 shadow-sm hover:shadow-lg shadow-gray-700 p-2 rounded-xl w-12 h-12 flex items-center justify-center overflow-hidden aspect-square transition-transform duration-200 hover:scale-105 active:scale-95"
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
    </div>
  )
}
export default ProductsCategoryPage
