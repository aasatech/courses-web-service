import {checkSchema} from "express-validator"

export const registerValidator =   checkSchema({
  name: {
    errorMessage: "Name required",
    isLength: {
      options: {min: 5 , max: 50},
      errorMessage: "Name should be between 5 to 50 characters"
    },
    isEmail: false
  },
  username: {
    errorMessage: 'Invalid username',
    isLength: {
      options: {min: 5 , max: 50},
      errorMessage: "Name should be between 5 to 50 characters"
    },
    isEmpty: false
  },
  email: {
    errorMessage: "Email required",
    isEmail: true,
    isEmpty: false,
  },
  password: {
    errorMessage: "Password is required",
    isLength: {
      options: { min: 8 },
      errorMessage: 'Password should be at least 8 chars',
    },
  },
  password_confirmation: {
    errorMessage: "Password is required",
    isLength: {
      options: { min: 8 },
      errorMessage: 'Password should be at least 8 chars',
    },
    custom: {
      options: (value, {req}) => {
        const password = req.body.password
        
        if(password !== value) {
          return Promise.reject("Password not match")
        }

        return value
      }
    }
  }
});

export const loginValidator = checkSchema({
  email: {
    errorMessage: "Email is required",
    isEmail: true,
    isEmpty: false,
  },
  password: {
    errorMessage: "Password is required",
    isLength: {
      options: { min: 8 },
      errorMessage: 'Password should be at least 8 chars',
    },
  },
})