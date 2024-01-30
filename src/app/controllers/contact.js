import { sendEmail } from '../../config/mail'
import Contact from '../models/Contact'

export const contact = async (req, res) => {
  try {
    const { email, name, comment, subject } = req.body

    await Contact.query().insert({
      email,
      name,
      subject,
      comment
    })

    await sendEmail(email, name, subject, comment)
    res.status(201).json({ message: 'success' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
