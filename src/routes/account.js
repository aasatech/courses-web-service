import express from 'express'
import * as controller from '../app/controllers/accounts'
import authMiddleware from '../middleware/auth'

const router = express.Router()

router.get('/profile', authMiddleware, controller.profile)
router.put('/profile', authMiddleware, controller.updateProfile)
router.delete('/profile', authMiddleware, controller.deleteProfile)

export default router
