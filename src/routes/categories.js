import express from 'express'
import * as controller from '../app/controllers/categories'
import { categoryValidator } from '../app/validators/category'
import adminAuth from '../middleware/adminAuth'
import authMiddleware from '../middleware/auth'

const router = express.Router()

router.get('/', controller.list)
router.post(
  '/',
  categoryValidator,
  authMiddleware,
  adminAuth('admin'),
  controller.create
)
router.get('/:id', controller.show)
router.put(
  '/:id',
  categoryValidator,
  authMiddleware,
  adminAuth('admin'),
  controller.update
)
router.delete('/:id', authMiddleware, adminAuth('admin'), controller.destroy)

export default router
