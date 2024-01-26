import express from 'express'
const router = express.Router()
import * as controller from '../app/controllers/auth'
import * as validator from '../app/validators/auth'
import 'dotenv/config'

router.post('/register', validator.registerValidator, controller.register)
router.post('/login', validator.loginValidator, controller.login)

router.get('/google', controller.googleLogin)
router.get('/google/callback', controller.googleCallback)
router.get('/facebook', controller.facebookLogin)
router.get('/facebook/callback', controller.facebookCallback)

export default router
