import { checkSchema } from 'express-validator'

export const courseValidator = checkSchema({
  name: {
    notEmpty: true,
    errorMessage: 'Course name is required'
  },
  category_id: {
    notEmpty: true,
    errorMessage: 'Category is required'
  },
  'chapters.*.name': {
    notEmpty: true,
    errorMessage: 'Chapter name is required'
  },
  'chapters.*.lessons.*.name': {
    notEmpty: true,
    errorMessage: 'Lesson name is required'
  }
})
