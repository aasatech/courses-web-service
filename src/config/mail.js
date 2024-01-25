import 'dotenv/config'
import nodemailer from 'nodemailer'
import hbs from 'nodemailer-express-handlebars'
import path from 'path'

const rootPath = process.cwd()

const handlebarOption = {
  viewEngine: {
    partialsDir: path.resolve(rootPath + '/src/app/views/'),
    defaultLayout: false
  },
  viewPath: path.resolve(rootPath + '/src/app/views/')
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_APP_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  },
  secure: true
})
transporter.use('compile', hbs(handlebarOption))

export const sendEmail = async (email, subject, text) => {
  try {
    transporter.sendMail({
      from: process.env.GMAIL_APP_USER,
      to: email,
      template: 'email',
      subject: subject,
      html: text
    })
    console.log('email send successfully')
  } catch (error) {
    console.log(error, 'email not sent')
  }
}
