import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Rate } from 'antd'
import Skeleton from '@mui/material/Skeleton'

const ProductDetailsSkelton = () => {
  return (
    <div className="flex flex-col p-3">
      <div className="flex flex-col sm:flex-row items-center gap-x-6 lg:gap-x-20 p-2 w-full">
        {/* ḷeft */}
        <div className=" flex flex-col items-center">
          <div className=" mb-2 aspect-square w-full h-[450px] sm:w-[350px] md:w-[430px] lg:w-[530px] overflow-hidden rounded-xl">
            <Skeleton
              sx={{ height: '100%', width: '100%' }}
              animation="wave"
              variant="rectangular"
            />
          </div>
        </div>

        {/* right */}
        <div className="flex gap-y-2  mx-4 sm:mx-0 md:px-7 flex-col self-start w-full  px-3 mt-6">
          <Skeleton animation="wave" width="90%" height={100} />

          {/* rating */}

          {/* description */}
          <div className=" flex flex-col p-1 py-3 my-3 items-start rounded-lg">
            <Skeleton animation="wave" width="70%" />
            <Skeleton animation="wave" width="70%" />
            <Skeleton animation="wave" width="70%" />
            <Skeleton animation="wave" width="70%" />
          </div>

          {/* buttons */}
        </div>
      </div>
    </div>
  )
}
export default ProductDetailsSkelton
