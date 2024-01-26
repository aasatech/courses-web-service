import User from '../models/User'

export const profile = async (req, res) => {
  try {
    const user = await User.query().findById(req.decoded.id)

    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ errors: error.message })
  }
}

export const updateProfile = async (req, res) => {
  try {
    const { name, username, email, password } = req.body

    const password_encrypted = User.generatePassword(password)

    const user = await User.query().patchAndFetchById(req.decoded.id, {
      name,
      username,
      email,
      password_encrypted
    })

    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const deleteProfile = async (req, res) => {
  try {
    const user = await User.query().deleteById(req.decoded.id)

    res.status(200).json({ message: 'Account delete succesfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
