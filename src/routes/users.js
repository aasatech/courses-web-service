import express from 'express'
import * as controller from '../app/controllers/users'
import adminAuth from '../middleware/adminAuth'
import authMiddleware from '../middleware/auth'
const router = express.Router()

router.get('/', authMiddleware, adminAuth('admin'), controller.list)
router.put('/:id', authMiddleware, adminAuth('admin'), controller.update)
router.delete('/:id', authMiddleware, adminAuth('admin'), controller.destroy)

export default router
