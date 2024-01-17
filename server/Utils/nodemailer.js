import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

const config = {
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL,
    pass: process.env.GMAIL_PASS,
  },
}
let transporter = nodemailer.createTransport(config)

export const orderSuccessMail = async (email, order) => {
  const deliveryDate = new Date(order.delivery).toLocaleDateString()
  const mail = {
    from: process.env.GMAIL,
    to: email,
    subject: `Your order has been placed successfully!`,
    html: `
      <p>Ordered On: ${order.date}</p>
      <p>Products: ${order.products.length}</p>
      <p>Total Price: ${order.total}</p>
      <p>Expected Delivery: ${deliveryDate}</p>
    `,
  }
  transporter.sendMail(mail, (err, info) => {
    if (err) {
      console.log(err)
    } else {
      return info.response
    }
  })
}
export const orderCancelMail = async (email, order) => {
  const mail = {
    from: process.env.GMAIL,
    to: email,
    subject: `Your order has been cancelled`,
    html: `
      <p>Order Cancelled On: ${new Date().toLocaleDateString()}</p>
      <p>Reason: ${order.reason}</p>
      <p>Order ID: ${order.orderId}</p>
      <p>Products: ${order.products.length}</p>
      <p>Total Refund Amount added to wallet: ${order.total}</p>
    `,
  }
  transporter.sendMail(mail, (err, info) => {
    if (err) {
      console.log(err)
    } else {
      return info.response
    }
  })
}
export const passwordResetTokenMail = async (resetToken, email) => {
  const mail = {
    from: process.env.GMAIL,
    to: email,
    subject: `Password reset token`,
    html: `
      <p>Your request to reset password is successfully recieved,below is the your password-reset token</p>

      <p>${resetToken}</p>
    `,
  }
  transporter.sendMail(mail, (err, info) => {
    if (err) {
      console.log(err)
    } else {
      return info.response
    }
  })
}
