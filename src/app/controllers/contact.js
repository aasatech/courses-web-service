import { sendEmail } from '../../config/mail'
import Contact from '../models/Contact'

export const contact = async (req, res) => {
  try {
    const { email, name, comment } = req.body

    await Contact.query().insert({
      email,
      name,
      comment,
      subject: null
    })

    await sendEmail(email, `Send testing email to ${name}`, 'Contact')
    res.status(201).json({ message: 'success' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
