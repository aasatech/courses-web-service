import express from 'express'
import * as controller from '../app/controllers/users'
import authMiddleware from '../middleware/auth'

const router = express.Router()

router.get('/profile', authMiddleware, controller.profile)

export default router
