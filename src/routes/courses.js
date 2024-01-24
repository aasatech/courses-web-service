import express from 'express'
import * as controller from '../app/controllers/courses'
import authMiddleware from '../middleware/auth'
import { courseValidator } from '../app/validators/course'
import upload from '../config/uploader'
import adminAuth from '../middleware/adminAuth'

const router = express.Router()

router.get('/profile', authMiddleware, controller.listTeacherCourse)
router.get('/profile/:id', authMiddleware, controller.showTeacherCourse)

router.get('/', controller.list)
router.get('/:id', controller.show)

router.post(
  '/profile',
  authMiddleware,
  courseValidator,
  adminAuth(['admin', 'teacher']),
  upload.any(),
  controller.create
)
router.put(
  '/profile/:id',
  authMiddleware,
  adminAuth(['admin', 'teacher']),
  upload.any(),
  controller.update
)
router.delete(
  '/profile/:id',
  adminAuth(['admin', 'teacher']),
  authMiddleware,
  controller.destroy
)

export default router
