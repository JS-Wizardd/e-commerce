import { motion } from 'framer-motion'
const OrderDetailsModal = ({ closeModal, selectedOrder }) => {
  return (
    <div className="fixed z-50 top-0 right-0 left-0 bottom-0 flex justify-center items-center bg-black/70">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
        className="w-9/12 sm:w-3/5 md:w-6/12 lg:w-4/12 h-[80vh] r p-5 flex flex-col bg-slate-50 rounded-md"
      >
        <div className="flex relative flex-col w-full h-full p-2 px3 items-center justify-start">
          <img
            src="../../../assets/icons/modal-close.png"
            className="absolute p-1 scale-75 hover:shadow-xl cursor-pointer rounded-full right-1 top-1 bg-accent"
            alt="close modal"
            onClick={() => closeModal()}
          />
          <h1 className="text-center text-xl lg:text-2xl font-semibold mb-5">
            Order Details
          </h1>
          <div className="flex flex-col w-full h-full p-2 font-medium gap-y-5 overflow-hidden">
            {/* product image /name/price map() */}
            <div className="min-h-52 h-fit min-h-[4rem] rounded-md border py-3 border-violet-100 overflow-y-auto">
              {selectedOrder.products.map((product, i) => (
                <div
                  key={i}
                  className="flex w-full justify-around items-center h-14 "
                >
                  <div className="h-full">
                    <img
                      src={product.product.images[0]}
                      className="aspect-square h-full object-contain"
                      alt="product image"
                    />
                  </div>
                  <h1>{product.product.name}</h1>
                  <h1>{product.product.price}/-</h1>
                </div>
              ))}
            </div>
            <div className="flex justify-between">
              Order status:{' '}
              <p
                className={`text-blue-500 ${
                  selectedOrder.status === 'Cancelled' && 'text-red-600'
                }`}
              >
                {selectedOrder.status}
              </p>
            </div>
            <div className="flex justify-between">
              ordered on:{' '}
              <p>{new Date(selectedOrder.date).toLocaleDateString()}</p>
            </div>
            <div
              className={`flex justify-between  ${
                selectedOrder.status === 'Cancelled' &&
                'line-through text-gray-400'
              }`}
            >
              expected delivery:{' '}
              <p>{new Date(selectedOrder.delivery).toLocaleDateString()}</p>
            </div>
            <div className="flex justify-between">
              total amount:{' '}
              <div className="flex">
                <p>{selectedOrder.total}/-</p>
                <p
                  className={`${
                    selectedOrder.status === 'Cancelled' ? 'block' : 'hidden'
                  }`}
                >
                  &nbsp; (refunded)
                </p>
              </div>
            </div>
            <div className="flex justify-between">
              address:{' '}
              <p>
                {selectedOrder.shippingAddress.addressDetails.address},{' '}
                {selectedOrder.shippingAddress.addressDetails.city}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
export default OrderDetailsModal
