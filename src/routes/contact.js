import express from 'express'
import * as controller from '../app/controllers/contact'

const router = express.Router()

router.post('/', controller.contact)

export default router
