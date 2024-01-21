import User from '../models/User'

export const profile = async (req, res) => {
  try {
    const user = await User.query().findById(req.decoded.id)

    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ errors: error.message })
  }
}

export const list = async (req, res) => {
  try {
    const users = await User.query()

    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
