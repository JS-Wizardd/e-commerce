import CircularProgress from '@mui/material/CircularProgress'

const PageLoadingWheel = () => {
  return (
    <div className="w-full h-92 flex items-center justify-center z-10">
      <CircularProgress style={{ scale: '1' }} />
    </div>
  )
}
export default PageLoadingWheel
