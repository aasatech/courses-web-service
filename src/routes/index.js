import express from 'express'

// route
import auth from './auth'
import account from './account'
import courses from './courses'
import categories from './categories'
import tags from './tags'
import users from './users'
import contact from './contact'
import passwordReset from './password-reset'
const app = express.Router()

app.use('/auth', auth)
app.use('/account', account)
app.use('/courses', courses)
app.use('/categories', categories)
app.use('/tags', tags)
app.use('/users', users)
app.use('/contact', contact)
app.use('/password-reset', passwordReset)

export default app
