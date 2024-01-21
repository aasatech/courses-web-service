import { checkSchema } from 'express-validator'

export const courseValidator = checkSchema({
  name: {
    notEmpty: true,
    errorMessage: 'Course name is required',
    isLength: {
      options: { min: 5, max: 50 },
      errorMessage: 'Name should be between 5 to 50 characters'
    }
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
