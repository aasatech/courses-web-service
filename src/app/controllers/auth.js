import User from '../models/User'
import { generateToken } from '../../config/jwt'
import { validationResult } from 'express-validator'
import _ from 'lodash'
import 'dotenv/config'
import { sendEmail } from '../../config/mail'
import axios from 'axios'

export const register = async (req, res) => {
  try {
    const { name, username, email, password } = req.body

    const result = validationResult(req)

    if (!result.isEmpty()) {
      return res.status(400).json({ errors: _.groupBy(result.array(), 'path') })
    }

    const existingUser = await User.query().findOne({ email })

    if (existingUser) {
      return res.status(400).json({ message: 'Email already exist' })
    }

    const encryptedPassword = User.generatePassword(password)

    const user = await User.query().insert({
      name,
      username,
      email,
      password_encrypted: encryptedPassword
    })

    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // validate with express validator
    const result = validationResult(req)

    if (!result.isEmpty()) {
      return res.status(400).json({ errors: _.groupBy(result.array(), 'path') })
    }

    // find user
    const user = await User.query().findOne({ email })

    if (!user)
      return res.status(400).json({ message: 'Invalid login credentials' })

    // check password
    const isValid = await user.comparePassword(password)

    if (!isValid)
      return res.status(400).json({ message: 'Invalid login credentials' })

    // generate token
    const token = await generateToken(user)

    res.status(200).json({ token })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const resetPassword = async (req, res) => {
  try {
    const { email } = req.body

    const user = await User.query().findOne({ email })

    if (!user) res.status(404).json({ message: 'Email not found' })

    const link = `${process.env.BASE_URL}/auth/reset-password/${user.id}`

    await sendEmail(user.email, 'Password reset', link)

    res.send('password reset link sent to your email account')
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET

const GOOGLE_REDIRECT_URI = process.env.CALL_BACK_URI + '/google/callback'
const FACEBOOK_REDIRECT_URI = process.env.CALL_BACK_URI + '/facebook/callback'

export const googleLogin = (req, res) => {
  const url = `https://accounts.google.com/o/oauth2/v2/auth?
  client_id=${GOOGLE_CLIENT_ID}
  &redirect_uri=${GOOGLE_REDIRECT_URI}
  &response_type=code
  &scope=profile email`
  res.redirect(url)
}

export const facebookLogin = (req, res) => {
  const url = `https://www.facebook.com/dialog/oauth?
  client_id=${FACEBOOK_APP_ID}
  &redirect_uri=${FACEBOOK_REDIRECT_URI}
  &response_type=code
  &scope=email`
  res.redirect(url)
}

export const googleCallback = async (req, res) => {
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
    const user = await insertUser(profile)

    const token = await generateToken(user)

    res.status(200).json({ token })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const facebookCallback = async (req, res) => {
  const { code } = req.query

  try {
    const { data } = await axios.get(
      `https://graph.facebook.com/v13.0/oauth/access_token?client_id=${FACEBOOK_APP_ID}&client_secret=${FACEBOOK_APP_SECRET}&code=${code}&redirect_uri=${FACEBOOK_REDIRECT_URI}`
    )

    const { access_token } = data

    const { data: profile } = await axios.get(
      `https://graph.facebook.com/v13.0/me?fields=name,email&access_token=${access_token}`
    )

    const user = await insertUser(profile)

    const token = await generateToken(user)

    res.status(200).json({ token })
  } catch (error) {
    res.redirect('../../auth/failed')
  }
}

const insertUser = async profile => {
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

  return user
}
