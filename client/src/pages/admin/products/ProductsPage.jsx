import { useState } from 'react'
import AdminViewProductsPage from './AdminViewProductsPage'
import Fab from '@mui/material/Fab'
import AddIcon from '@mui/icons-material/Add'
import Loading from '../../../components/Loading'
import AdminProductCategoryCard from '../../../components/admin/AdminProductCategoryCard'
import { COLORS } from '../../../styles/color'
import AddProduct from '../../../components/admin/AddProduct.jsx'

const ProductsPage = () => {
  const [modal, setModal] = useState(false)
  const [loading, setLoading] = useState(false)
  return (
    <div className="px-2" style={{ background: COLORS.CREAM }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1 md:gap-2 lg:gap-3 pt-3">
        <AdminProductCategoryCard
          name="Smartphone"
          category="smartphone"
          src="../../../../assets/icons/android.png"
          customClass=""
        />
        <AdminProductCategoryCard
          name="Laptop"
          category="laptop"
          src="../../../../assets/icons/laptop.png"
          imgClass="scale-125 max-sm:ml-3"
          customClass="ml-3"
          className=""
        />
        <AdminProductCategoryCard
          name="Tab"
          category="tab"
          link="/admin/products"
          src="../../../../assets/icons/tab.png"
          imgClass="scale-90 max-md:ml-1"
        />
        <AdminProductCategoryCard
          name="Smartwatch"
          category="smartwatch"
          src="../../../../assets/icons/smartwatch.png"
          customClass=""
        />
        <AdminProductCategoryCard
          name="Deleted Products"
          category="deleted-products"
          src="../../../../assets/icons/deleted.png"
          imgClass="scale-90"
        />
      </div>
      {/* <AdminViewProductsPage modal={modal} setModal={setModal} /> */}
      {loading && <Loading />}
      {modal && <AddProduct setModal={setModal} setLoading={setLoading} />}
      <div
        className="fixed right-10  bottom-10 "
        onClick={() => {
          setModal(true)
        }}
      >
        <Fab variant="extended" color="white">
          <AddIcon sx={{ mr: 1 }} />
          Add Product
        </Fab>
      </div>
    </div>
  )
}
export default ProductsPage
