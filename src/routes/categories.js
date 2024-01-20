import express from 'express'
import * as controller from '../app/controllers/categories'
import { categoryValidator } from '../app/validators/category'

const router = express.Router()

router.get('/', controller.list)
router.post('/',categoryValidator , controller.create)
router.get('/:id', controller.show)
router.put("/:id",categoryValidator ,controller.update)
router.delete("/:id",controller.destroy)

export default router