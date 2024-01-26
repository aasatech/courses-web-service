import express from 'express'
const router = express.Router()
import * as controller from '../app/controllers/auth'
import * as validator from '../app/validators/auth'
import '../config/passport'
import passport from 'passport'

router.post('/register', validator.registerValidator, controller.register)
router.post('/login', validator.loginValidator, controller.login)

router.get('/failed', (req, res) =>
  res.json({ message: 'You Failed to log in!' })
)

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
)

router.get(
  '/google/callback',
  passport.authenticate('google', {
    successRedirect: '../../auth/profile',
    failureRedirect: '../../auth/failed'
  })
)

router.get('/facebook', passport.authenticate('facebook'))

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '../../auth/profile',
    failureRedirect: '../../auth/failed'
  })
)

router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

router.get('/profile', (req, res) => {
  res.json(req.user)
})

export default router
