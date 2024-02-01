import { validationResult } from 'express-validator'
import User from '../models/User'
import _ from 'lodash'
import { pagination, paging } from '../helper/utils'
import { raw } from 'objection'

export const list = async (req, res) => {
  try {
    const { page, perPage } = paging(req)
    const orderByDate = req.query.order_by || 'asc'
    const name = req.query.name
    const withDeleted = req.query.with_deleted
    const deletedOnly = req.query.deleted_only
    
    let users = User.query()
    .orderBy('id', orderByDate)
    .modify('filter', name,withDeleted,deletedOnly)
    .modify('getWithDeleted',withDeleted)
    .modify('getOnlyDeleted',deletedOnly)
    .page(page, perPage)


    // if(deletedOnly){
    //   users.where(raw('deleted_at is not null'))
    // }else{
    //   users.modify('getWithDeleted',withDeleted)
    // } 
    
    const result = await users


    const meta = pagination(result.total, perPage, page)

    res.status(200).json({ data: result.results, meta })
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

    const password_encrypted = User.generatePassword(password)

    const existingEmail = await User.query().findOne({ email })

    if (existingEmail)
      return res.status(400).json({ message: 'Email already exist' })

    const user = await User.query().insert({
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

    const deletedUser = await User.query().withDeleted().whereNotNull('deleted_at').findById(id)

    if(deletedUser) return res.status(202).json({message:'User Already Deleted'})

    console.log(deletedUser);

    if (!user) return res.status(404).json({ message: 'User not found' })

    await user.$query().delete()

    res.status(200).json({ message: 'Successfully delete user' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
