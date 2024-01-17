import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const AccountCategory = ({ name, src, link }) => {
  const transition = { type: 'spring', duration: 0.3 }
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0.8 }}
      whileInView={{ scale: 1, opacity: 1 }}
      transition={{ ...transition, type: 'tween' }}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.05 },
      }}
      whileTap={{ scale: 0.95 }}
      className="rounded-lg h-36 sm:h-40 md:h-48 lg:h-56 w-full mx-auto px-4 border border-violet-100 whitespace-nowrap  shadow-md hover:shadow-2xl bg-white text-secondary  hover:bg-secondary transition-all hover:text-white hover:border-white "
    >
      <Link
        to={`/${link?.toLowerCase()}`}
        className={` flex md:flex-col justify-start sm:justify-center h-full items-center gap-x-7
      `}
      >
        <div className="max-md:w-1/4  rounded-full  md:h-3/4  flex justify-center items-center">
          <img
            src={src}
            alt="category icon"
            className={`bg-secondary rounded-lg p-1 object-contain max-h-full max-w-full`}
          />
        </div>
        <div className="max-md:w-3/4 md:h-1/4  text-2xl lg:text-3xl font-semibold">
          <p>{name}</p>
        </div>
      </Link>
    </motion.div>
  )
}
export default AccountCategory
