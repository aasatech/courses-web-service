import Category from '../models/Category'
import {validationResult}from "express-validator"
import _ from "lodash"

export const list = async (req, res) => {
  try {
    const category = await Category.query()

    res.status(200).json(category)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
export const show = async (req, res) => {
  try {
    const { id } = req.params

    const category = await Category.query().findById(id)

    if (!category) return res.status(404).json({ mesage: 'Category not found' })

    res.status(200).json(category)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const create = async (req, res) => {
  try {
    const { name, slug } = req.body

    const result = validationResult(req)

    if(!result.isEmpty()){
      return res.status(400).json({error: _.groupBy(result.array(), "path") })
    }

    const category = await Category.query().insertAndFetch({
      name,
      slug
    })

    res.status(201).json(category)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const update = async (req, res) => {
  try {
    const { id } = req.params
    const { name, slug } = req.body

    let category = await Category.query().findById(id)

    if (!category) return res.status(404).json({ mesage: 'Category not found' })

    await category.$query().patchAndFetch({
      name,
      slug
    })

    res.status(200).json(category)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
export const destroy = async (req, res) => {
  try {
    const {id} = req.params

    const category = await Category.query().deleteById(id)

    if(!category) return res.status(404).json({ mesage: 'Category not found' })

    res.status(200).json(category)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
