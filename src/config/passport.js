import passport, { use } from 'passport'
import 'dotenv/config'

import GoogleStrategy from 'passport-google-oauth2'
import FacebookStrategy from 'passport-facebook'

import User from '../app/models/User'
import AuthProvider from '../app/models/AuthenticationProvider'

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((user, done) => {
  done(null, user)
})

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.CALL_BACK_URI + '/google/callback',
      passReqToCallback: true
    },
    (request, accessToken, refreshToken, profile, done) => {
      insertUser(profile)
      done(null, profile)
    }
  )
)

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.CALL_BACK_URI + '/facebook/callback',
      profileFields: ['id', 'displayName', 'photos', 'email']
    },
    (token, refreshToken, profile, done) => {
      insertUser(profile)
      return done(null, profile)
    }
  )
)

const insertUser = async profile => {
  const { email, displayName, provider, id } = profile

  const existingUser = await User.query().findOne({
    email: profile?.email || ''
  })

  let userId

  if (!existingUser) {
    const createdUser = await User.query().insert({
      name: displayName,
      username: displayName,
      email: email || ''
    })

    userId = createdUser.id
  }

  if (existingUser) {
    userId = existingUser.id
  }

  const existingProvderKey = await AuthProvider.query().findById(id)

  if (!existingProvderKey) {
    await AuthProvider.query().insert({
      provider_key: id,
      provider,
      user_id: userId
    })
  }
}
