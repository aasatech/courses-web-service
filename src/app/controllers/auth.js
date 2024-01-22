import User from '../models/User'
import { generateToken } from '../../config/jwt'
import { validationResult } from 'express-validator'
import _ from 'lodash'

export const register = async (req, res) => {
  try {
    const { name, username, email, password } = req.body

    const result = validationResult(req)

    if (!result.isEmpty()) {
      return res.status(400).json({ errors: _.groupBy(result.array(), 'path') })
    }

    const encryptedPassword = await User.generatePassword(password)

    const user = await User.query().insert({
      name,
      username,
      email,
      password_encrypted: encryptedPassword
    })

    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // validate with express validator
    const result = validationResult(req)

    if (!result.isEmpty()) {
      return res.status(400).json({ errors: _.groupBy(result.array(), 'path') })
    }

    // find user
    const user = await User.query().findOne({ email })

    if (!user)
      return res.status(400).json({ message: 'Invalid login credentials' })

    // check password
    const isValid = await user.comparePassword(password)

    if (!isValid)
      return res.status(400).json({ message: 'Invalid login credentials' })

    // generate token
    const token = await generateToken(user)

    res.status(200).json({ token })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
