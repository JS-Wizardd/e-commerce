import Alert from '@mui/material/Alert'
import IconButton from '@mui/material/IconButton'
import Collapse from '@mui/material/Collapse'
import CloseIcon from '@mui/icons-material/Close'
import { useEffect } from 'react'

const CustomAlert = ({ open, theme, setOpen, message, duration = 3000 }) => {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        setOpen(false)
      }, duration)
      return () => {
        clearTimeout(timer)
      }
    }
  }, [open, setOpen])
  return (
    <div>
      <Collapse in={open}>
        <Alert
          severity={theme}
          action={
            <IconButton
              aria-label="close"
              color={'inherit'}
              size="small"
              onClick={() => {
                setOpen(false)
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          {message}
        </Alert>
      </Collapse>
    </div>
  )
}
export default CustomAlert
