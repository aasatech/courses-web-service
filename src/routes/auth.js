import express from 'express'
const router = express.Router()
import * as controller from '../app/controllers/auth'
import * as validator from '../app/validators/auth'

router.post('/register', validator.registerValidator, controller.register)
router.post('/login', validator.loginValidator, controller.login)

router.get('/google', controller.googleLogin)
router.get('/facebook', controller.facebookLogin)
router.get('/google/callback', controller.googleCallBack)
router.get('/facebook/callback', controller.facebookCallBack)
router.get('/failed', (req, res) => res.json({ message: 'Login failed' }))
export default router
