import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import cloudinary from '../Config/cloudinary.js'

const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: (req, file) => {
    let folderName = 'Other' // Default folder name for undefined cases
    switch (file.fieldname) {
      case 'images':
        folderName = 'Products' // Folder name for product images
        break
      // Add more cases if necessary for different image types
      default:
        break
    }

    const parts = file.originalname.split('.')
    const ext = parts[parts.length - 1]
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)

    let public_id
    if (typeof file === 'string') {
      public_id = 'url_' + uniqueSuffix
    } else {
      public_id = file.fieldname + '-' + uniqueSuffix
    }

    return {
      folder: folderName,
      format: ext,
      public_id,
    }
  },
})

const upload = multer({ storage })

export default upload
