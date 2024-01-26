import express from 'express'
const router = express.Router()
import * as controller from '../app/controllers/auth'
import * as validator from '../app/validators/auth'
import 'dotenv/config'
import axios from 'axios'
import User from '../app/models/User'
import AuthProvider from '../app/models/AuthProvider'
import { generateToken, verifyToken } from '../config/jwt'

router.post('/register', validator.registerValidator, controller.register)
router.post('/login', validator.loginValidator, controller.login)

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET

const GOOGLE_REDIRECT_URI = 'http://localhost:5000/api/v1/auth/google/callback'
const FACEBOOK_REDIRECT_URI =
  'http://localhost:5000/api/v1/auth/facebook/callback'

router.get('/google', (req, res) => {
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&response_type=code&scope=profile email`
  res.redirect(url)
})

router.get('/facebook', (req, res) => {
  const url = `https://www.facebook.com/v13.0/dialog/oauth?client_id=${FACEBOOK_APP_ID}&redirect_uri=${FACEBOOK_REDIRECT_URI}&scope=email`

  res.redirect(url)
})

const sucess_redirect = 'http://localhost:5000/api/v1/account/profile'

router.get('/google/callback', async (req, res) => {
  const { code } = req.query

  try {
    const { data } = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      code,
      redirect_uri: GOOGLE_REDIRECT_URI,
      grant_type: 'authorization_code'
    })

    const { access_token, id_token } = data

    const { data: profile } = await axios.get(
      'https://www.googleapis.com/oauth2/v1/userinfo',
      {
        headers: { Authorization: `Bearer ${access_token}` }
      }
    )

    const existingUser = await User.query().findOne({ email: profile.email })

    let user = existingUser

    if (!existingUser) {
      const createdUser = await User.query().insert({
        name: profile.name,
        username: profile.name,
        email: profile.email
      })

      user = createdUser
    }

    const isExistingProvider = await AuthProvider.query().findById(profile.id)

    if (!isExistingProvider) {
      await AuthProvider.query().insert({
        provider_key: profile.id,
        user_id: user.id,
        provider: 'google'
      })
    }

    const token = await generateToken(user)

    res.status(200).json(token)
  } catch (error) {
    console.log(error.message)
    res.redirect('../../auth/failed')
  }
})

router.get('/facebook/callback', async (req, res) => {
  const { code } = req.query

  try {
    const { data } = await axios.get(
      `https://graph.facebook.com/v13.0/oauth/access_token?client_id=${FACEBOOK_APP_ID}&client_secret=${FACEBOOK_APP_SECRET}&code=${code}&redirect_uri=${FACEBOOK_REDIRECT_URI}`
    )

    const { access_token } = data

    const { data: profile } = await axios.get(
      `https://graph.facebook.com/v13.0/me?fields=name,email&access_token=${access_token}`
    )

    const existingUser = await User.query().findOne({ email: profile.email })

    let user

    if (!existingUser) {
      const createdUser = await User.query().insert({
        name: profile.name,
        username: profile.name,
        email: profile.email
      })

      user = createdUser
    }

    const isExistingProvider = await AuthProvider.query().findById(profile.id)

    if (!isExistingProvider) {
      await AuthProvider.query().insert({
        provider_key: profile.id,
        user_id: user.id,
        provider: 'google'
      })
    }

    const token = generateToken(user)

    res.cookie('auth_token', token, {
      maxAge: 900000,
      httpOnly: true,
      secure: false
    })

    res.status(200).json(token)
  } catch (error) {
    res.redirect('../../auth/failed')
  }
})

router.get('/failed', (req, res) => {
  res.json({ message: 'Login fail' })
})

router.get('/logout', (req, res) => {
  res.redirect('/login')
})

export default router
