import express from 'express'
const router = express.Router()
import * as controller from '../app/controllers/auth'
import * as validator from '../app/validators/auth'

router.post('/register', validator.registerValidator, controller.register)
router.post('/login', validator.loginValidator, controller.login)

export default router
