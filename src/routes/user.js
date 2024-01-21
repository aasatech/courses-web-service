import express from 'express'
import * as controller from '../app/controllers/users'

const router = express.Router()

router.get('/', controller.list)

export default router
