import express from 'express'
import * as controller from '../app/controllers/courses'
import authMiddleware from '../middleware/auth'
import { courseValidator } from '../app/validators/course'
import upload from '../config/uploader'
import adminAuth from '../middleware/adminAuth'

const router = express.Router()

router.get('/', authMiddleware, controller.list)
router.post(
  '/',
  authMiddleware,
  courseValidator,
  adminAuth(['admin', 'teacher']),
  upload.any(),
  controller.create
)
router.get('/:id', authMiddleware, controller.show)
router.put(
  '/:id',
  authMiddleware,
  adminAuth(['admin', 'teacher']),
  upload.any(),
  controller.update
)
router.delete(
  '/:id',
  adminAuth(['admin', 'teacher']),
  authMiddleware,
  controller.destroy
)

export default router
