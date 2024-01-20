import express from 'express'
import * as controller from '../app/controllers/categories'

const router = express.Router()

router.get('/', controller.list)
router.post('/', controller.create)
router.get('/:id', controller.show)
router.put("/:id",controller.update)
router.delete("/:id",controller.destroy)

export default router