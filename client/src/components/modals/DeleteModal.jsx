import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { handleToggleDelete } from '../../api'

const DeleteModal = ({
  id,
  name,
  setDeleteModal,
  setIsDeleting,
  softDelete,
  category,
}) => {
  const navigate = useNavigate()

  const toggleDelete = async () => {
    setDeleteModal(false)
    setIsDeleting(true)

    try {
      const data = await handleToggleDelete(id)

      if (data.success) {
        setIsDeleting(false)
        if (data.product.softDelete) {
          navigate('/admin/products/deleted-products')
        } else {
          navigate(`/admin/products/${category}`)
        }
      } else {
        setDeleteModal(false)
        setIsDeleting(false)
        alert(`Product delete failed! Error: ${data.error}`)
      }
    } catch (error) {
      setIsDeleting(false)
      alert(`Something went wrong while attempting deletion! Error: ${error}`)
      console.error('Product delete error:', error)
    }
  }

  return (
    <div
      className="fixed top-0 right-0 left-0 bottom-0 flex justify-center items-center"
      style={{ background: 'rgba(0,0,0,0.8)' }}
    >
      <img
        src="/modal-close.png"
        alt="delete modal close"
        className="fixed cursor-pointer top-2 z-15 right-5 lg:right-20 rounded-full border border-slate-500 scale-105"
      />
      <div className="w-2/5 max-sm:w-4/5 h-44 r p-5 flex flex-col bg-slate-50 rounded-md">
        <div className="h-3/4 text-start flex justify-start items-center">
          {softDelete ? (
            <p className="text-lg flex font-medium">recycle "{name}"?</p>
          ) : (
            <p className="text-lg flex font-medium">
              Are you sure you want to delete "{name}"
            </p>
          )}
        </div>
        <div className="h-1/4 flex gap-x-2 w-full ">
          <button
            className={`border ${
              softDelete ? 'border-green-600' : 'border-red-600'
            } w-2/4 ${
              softDelete ? 'bg-green-100' : 'bg-red-100'
            } flex items-center justify-center py-3 rounded ${
              softDelete ? 'hover:bg-green-600' : 'hover:bg-red-600'
            } hover:text-white font-semibold hover:shadow transition-all `}
            onClick={toggleDelete}
          >
            {softDelete ? 'recycle' : 'delete'}
          </button>
          <button
            className="border border-blue-600 bg-blue-100 flex items-center justify-center w-2/4 py-3 rounded hover:bg-blue-600 hover:text-white font-semibold hover:shadow transition-all "
            onClick={() => setDeleteModal(false)}
          >
            cancel
          </button>
        </div>
      </div>
    </div>
  )
}
export default DeleteModal
