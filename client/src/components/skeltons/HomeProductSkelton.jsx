import { motion } from 'framer-motion'
import Skeleton from '@mui/material/Skeleton'

const HomeProductSkelton = () => {
  const transition = { type: 'spring', duration: 0.3 }

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0.8 }}
      whileInView={{ scale: 1, opacity: 1 }}
      transition={{ ...transition, type: 'tween' }}
      whileHover={{
        scale: 1.02,
        shadow: 'black',
        transition: { duration: 0.1 },
      }}
      whileTap={{ scale: 0.95 }}
      className="relative -mb-2 mx-auto m-10 flex w-full my-0 sm:my-2 lg:my-4  flex-col overflow-hidden rounded-lg border border-gray-100 h-92 sm:h-[470px] px-2 pb-5  bg-white shadow-md hover:shadow-xl "
    >
      <div className="h-full flex sm:flex-col">
        <div className="relative mx-3 mt-3 flex w-64 sm:w-auto h-52 sm:h-60 overflow-hidden rounded-xl ">
          <Skeleton
            sx={{ height: '100%', width: '100%' }}
            animation="wave"
            variant="rectangular"
          />
        </div>

        {/* Bottom  */}
        <div className="flex flex-col px-3 w-full  my-4 sm:my-auto ">
          <Skeleton animation="wave" />
          <div className="flex flex-col sm:flex-row gap-x-3">
            <Skeleton animation="wave" width="70%" />
          </div>
          <Skeleton animation="wave" width="60%" />
        </div>
      </div>
    </motion.div>
  )
}
export default HomeProductSkelton
