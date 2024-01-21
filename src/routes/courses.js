import express from 'express'
import * as controller from '../app/controllers/courses'
import authMiddleware from '../middleware/auth'
import { courseValidator } from '../app/validators/course'

const router = express.Router()

router.get('/', authMiddleware, controller.list)
router.post('/', authMiddleware, courseValidator, controller.create)
router.get('/:id', authMiddleware, controller.show)
router.put('/:id', authMiddleware, controller.update)
router.delete('/:id', authMiddleware, controller.destroy)

export default router
