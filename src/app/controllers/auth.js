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

    const token = await generateToken(user)

    res.status(200).json({user,token})
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

    res.status(200).json({ token, user })
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

const clientID = process.env.GOOGLE_CLIENT_ID
const clientSecret = process.env.GOOGLE_CLIENT_SECRET
const appId = process.env.FACEBOOK_APP_ID
const appSecret = process.env.FACEBOOK_APP_SECRET

const google_url = process.env.CALL_BACK_URI + '/auth/google/callback'
const facebook_url = process.env.CALL_BACK_URI + '/auth/facebook/callback'

export const googleLogin = async (req, res) => {
  try {
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientID}&redirect_uri=${google_url}&response_type=code&scope=profile email`
    res.redirect(url)
  } catch (error) {
    res.status(500).json(error.message)
  }
}

export const googleCallBack = async (req, res) => {
  const { code } = req.query
  try {
    const { data } = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: clientID,
      client_secret: clientSecret,
      code,
      redirect_uri: google_url,
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
    res.status(500).json(error.message)
  }
}

export const facebookLogin = async (req, res) => {
  const url = `https://www.facebook.com/v13.0/dialog/oauth?client_id=${appId}&redirect_uri=${facebook_url}&scope=email`
  res.redirect(url)
}

export const facebookCallBack = async (req, res) => {
  const { code } = req.query

  try {
    const { data } = await axios.get(
      `https://graph.facebook.com/v13.0/oauth/access_token?client_id=${appId}&client_secret=${appSecret}&code=${code}&redirect_uri=${facebook_url}`
    )

    const { access_token } = data

    const { data: profile } = await axios.get(
      `https://graph.facebook.com/v13.0/me?fields=name,email&access_token=${access_token}`
    )

    const user = await insertUser(profile)

    const token = await generateToken(user)

    res.status(200).json({ token })
  } catch (error) {
    console.error('Error:', error.response.data.error)
  }
}

const insertUser = async profile => {
  const existingUser = await User.query().findOne({ email: profile.email })

  let user = await existingUser

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
