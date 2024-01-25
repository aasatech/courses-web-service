import { sendEmail } from '../../config/mail'
import User from '../models/User'

export const contact = async (req, res) => {
  try {
    const { email, name } = req.body

    // const user = await User.query().findOne({ email })

    // if (!user) res.status(404).json({ message: 'Email not found' })

    await sendEmail(email, `Send testing email to ${name}`, 'Contact')
    res.status(201).json({ message: 'success' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
