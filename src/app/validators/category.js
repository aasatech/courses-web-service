import {checkSchema} from "express-validator"

export const categoryValidator = checkSchema({
  name: {
    errorMessage: "Name required",
    isLength: {
      options: {min: 5 , max: 50},
      errorMessage: "Name should be between 5 to 50 characters"
    },
  },
});
