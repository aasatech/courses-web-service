import express from 'express'
import * as controller from '../app/controllers/courses'
import authMiddleware from '../middleware/auth'
import { courseValidator } from '../app/validators/course'
import upload from '../config/uploader'
import adminAuth from '../middleware/adminAuth'

const router = express.Router()


// router.get('/search',controller.searchCourse)
router.get('/', controller.list)
router.get('/:id', controller.show)

router.post(
  '/',
  authMiddleware,
  adminAuth(['admin', 'teacher']),
  courseValidator,
  upload.any(),
  controller.create
)
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
