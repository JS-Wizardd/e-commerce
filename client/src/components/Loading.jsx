import CircularProgress from '@mui/material/CircularProgress'

const Loading = () => {
  return (
    <div
      className="fixed top-0 right-0 left-0 flex justify-center items-center bottom-0 z-10"
      style={{ background: 'rgba(0,0,0,0.4)' }}
    >
      <CircularProgress style={{ scale: '1.5' }} />
    </div>
  )
}
export default Loading
