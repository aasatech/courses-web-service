import express from 'express'
import * as controller from '../app/controllers/categories'
import { categoryValidator } from '../app/validators/category'
import authMiddleware from '../middleware/auth'
const router = express.Router()

router.get('/', controller.list)
router.post('/', authMiddleware, categoryValidator, controller.create)
router.get('/:id', controller.show)
router.put('/:id', authMiddleware, categoryValidator, controller.update)
router.delete('/:id', authMiddleware, controller.destroy)

export default router
