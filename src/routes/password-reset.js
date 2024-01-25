import express from 'express'
const router = express.Router()
import * as controller from '../app/controllers/auth'

router.post('/', controller.resetPassword)
router.post('/:id', controller.resetPassword)

export default router
