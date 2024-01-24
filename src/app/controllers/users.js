import { validationResult } from 'express-validator'
import User from '../models/User'
import _ from 'lodash'

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
    let users = await User.query().withDeleted()

    const result = users
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({ error: error.message })
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

export const update = async (req, res) => {
  try {
    const { id } = req.params
    const { name, username, email, password, role } = req.body

    const result = validationResult(req)

    if (!result.isEmpty()) {
      return res.status(400).json({ error: _.groupBy(result.array(), 'path') })
    }

    let user = await User.query().findById(id)

    if (!user) return res.status(404).json({ message: 'User not found' })

    const password_encrypted = User.generatePassword(password)

    await user.$query().patchAndFetch({
      name,
      username,
      email,
      role,
      password_encrypted
    })

    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const destroy = async (req, res) => {
  try {
    const { id } = req.params

    const user = await User.query().findById(id)

    if (!user) return res.status(404).json({ message: 'User not found' })

    await user.$query().delete()

    res.status(200).json({ message: 'Successfully delete user' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
