import { checkSchema } from 'express-validator'

export const categoryValidator = checkSchema({
  name: {
    notEmpty: true,
    errorMessage: 'Name required'
  }
})
