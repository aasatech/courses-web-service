import { checkSchema } from 'express-validator'

export const courseValidator = checkSchema({
  name: {
    isEmpty: false,
    errorMessage: 'Course name is required'
  },
  category_id: {
    isEmpty: false,
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
