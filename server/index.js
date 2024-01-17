import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { errorHandler, notFound } from './Middlewares/errorHandler.js'
import { userRouter } from './Routes/userRoutes.js'
import { adminRouter } from './Routes/Admin/adminRoutes.js'
import { productsRouter } from './Routes/productRoutes.js'
import { cartRouter } from './Routes/cartRoutes.js'
import { reviewRouter } from './Routes/reviewRoutes.js'
import { paymentRouter } from './Routes/paymentRoutes.js'
import { addressRouter } from './Routes/addressRoutes.js'
import './Utils/node-crone.js'
import { ordersRouter } from './Routes/ordersRoutes.js'
import connectDb from './Config/dbConnection.js'
// dirname
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import path from 'path'

connectDb()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const port = process.env.PORT || 4000

const app = express()

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')))
  app.get('*', (req, res) => {
    res.sendFile(
      path.resolve(__dirname, '../client/dist', 'index.html'),
      function (err) {
        if (err) res.status(500).send(err)
      }
    )
  })
}

app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups')
  next()
})

app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:3000'],
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/api/v1/admin', adminRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/products', productsRouter)
app.use('/api/v1/cart', cartRouter)
app.use('/api/v1/payment', paymentRouter)
app.use('/api/v1/reviews', reviewRouter)
app.use('/api/v1/address', addressRouter)
app.use('/api/v1/orders', ordersRouter)

//error handling middlewares
app.use(notFound)
app.use(errorHandler)

app.listen(port, () => {
  console.log(`Server is listening to port ${port}`)
})
