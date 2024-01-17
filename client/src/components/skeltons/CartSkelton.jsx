import Skeleton from '@mui/material/Skeleton'
const CartSkelton = () => {
  return (
    <div className="flex max-h-fit cursor-pointer h-28 max-sm:h-32 mb-3 rounded-lg bg-violet-100 border-violet-100 p-2  pr-11 border  transition-all justify-start w-full">
      {/* left */}
      <div className="w-1/5 flex  justify-start rounded-md h-full p-2">
        <Skeleton
          sx={{ height: '100%', width: '100%' }}
          animation="wave"
          variant="rectangular"
        />
      </div>
      {/* middle */}
      <div className="flex ml-3 items-start justify-start flex-col w-3/5 border-r  p-3">
        {/* middle top */}
        <div className="w-4/5 mr-auto">
          <Skeleton animation="wave" width="70%" />
        </div>
        {/* middle bottom */}
        <div className="flex gap-x-12 h-8 mt-auto w-full  ">
          <div className="flex justify-between w-28 rounded bg-violet-100  items-center">
            {/* quantity button */}
            <Skeleton animation="wave" width="100%" />
          </div>
        </div>
      </div>
    </div>
  )
}
export default CartSkelton
