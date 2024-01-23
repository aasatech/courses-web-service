import { checkSchema } from 'express-validator'

export const categoryValidator = checkSchema({
  name: {
    notEmpty: true,
    errorMessage: 'Category name required'
  }
})
