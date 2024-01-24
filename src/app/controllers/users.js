import { validationResult } from 'express-validator'
import User from '../models/User'
import _ from 'lodash'

export const list = async (req, res) => {
  try {
    let users = await User.query()

    if (req.query.deleted) {
      users = await User.query().withDeleted()
    }

    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const show = async (req, res) => {
  try {
    const { id } = req.params

    const user = await User.query().findById(id)

    if (!user) return res.status(404).json({ message: 'User not found' })

    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const create = async (req, res) => {
  try {
    const { name, username, email, password } = req.body

    const result = validationResult(req)

    if (!result.isEmpty()) {
      return res.status(400).json({ errors: _.groupBy(result.array(), 'path') })
    }

    const password_encrypted = User.generatePassword(password)

    const user = await User.query().insert({
      name,
      username,
      email,
      password_encrypted
    })

    res.status(201).json(user)
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
