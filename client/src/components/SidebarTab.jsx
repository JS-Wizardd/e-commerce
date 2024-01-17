import { Link, useParams } from 'react-router-dom'
import { COLORS } from '../styles/color'
import { motion } from 'framer-motion'
import { setSidebarToggle } from '../slices/sidebarSlice.js'
import { useDispatch } from 'react-redux'

const SidebarTab = ({ name, toLink, src, customImgClass }) => {
  const dispatch = useDispatch()

  const { category } = useParams()

  return (
    <motion.div
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.1 },
      }}
      whileTap={{ scale: 0.95 }}
      onClick={() => {
        dispatch(setSidebarToggle())
      }}
      className=""
    >
      <Link
        to={toLink}
        className={`flex justify-start gap-x-2  text-black rounded-lg items-center w-full   h-14 text-lg
        ${
          name === category || (category === undefined && name === 'Home')
            ? 'bg-secondary font-semibold text-white'
            : ''
        }  hover:shadow-md pl-5 ${
          name !== category &&
          !(category === undefined && name === 'Home') &&
          'hover:bg-violet-50'
        }
           capitalize`}
      >
        <img
          src={src}
          alt=""
          className={customImgClass + 'w-8 bg-secondary rounded-xl p-1'}
        />
        {name}
      </Link>
    </motion.div>
  )
}
export default SidebarTab
