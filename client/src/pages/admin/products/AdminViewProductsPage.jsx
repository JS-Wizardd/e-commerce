import axios from 'axios'
import AdminProductCard from '../../../components/admin/AdminProductCard'
import { COLORS } from '../../../styles/color'
import { useContext, useEffect, useState } from 'react'
import Pagination from '@mui/material/Pagination'
import { filterProducts } from '../../../api'
import { StateContext } from '../../../StateContext'
import { Link, useParams } from 'react-router-dom'

import HomeProductSkelton from '../../../components/skeltons/HomeProductSkelton'

const AdminViewProductsPage = () => {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [pageLoading, setPageLoading] = useState(false)
  const [totalPages, setTotalPages] = useState(1)
  const [isVisible, setIsVisible] = useState(false)
  // for deleted products page quick recycle button
  const [isDeleting, setIsDeleting] = useState(false)

  const { searchResults, search } = useContext(StateContext)
  const { category } = useParams()

  const fetchProductsByCategory = async (category) => {
    setIsLoading(true)
    try {
      const response = await filterProducts(page, { category })
      setProducts(response.products)
      setTimeout(() => {
        setIsLoading(false)
      }, 500)
    } catch (error) {
      setIsLoading(false)
      console.error('Error fetching products:', error)
      setProducts([])
    }
  }

  useEffect(() => {
    fetchProductsByCategory(category)
  }, [])

  useEffect(() => {
    fetchProductsByCategory(category)
  }, [isDeleting])

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
        <div className="flex w-full" style={{ background: COLORS.CREAM }}>
          <Link
            to={'/admin/products/'}
            className="bg-slate-700 px-2 w-fit rounded-xl py-1 font-medium text-slate-200 hover:bg-slate-800 hover:text-white flex items-center gap-x-2 transition-transform duration-200 hover:scale-105 active:scale-95"
          >
            <img src="/go back.png" alt="go back" className="h-6" />
            <h2>back</h2>
          </Link>
          <h1 className="text-3xl ml-3 text-slate-700 capitalize italic font-semibold ">
            "{category.toUpperCase()}"
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
              <AdminProductCard
                setIsDeleting={setIsDeleting}
                isDeleting={isDeleting}
                product={product}
                pageLoading={pageLoading}
                key={product._id}
              />
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
            className="fixed right-4 bottom-8 lg:right-8 lg:bottom-8 bg-slate-700 hover:bg-slate-800 shadow-sm hover:shadow-lg shadow-gray-700 p-2 rounded-xl w-12 h-12 flex items-center justify-center overflow-hidden aspect-square"
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
export default AdminViewProductsPage
