import express from 'express'
import * as controller from '../app/controllers/tags'

const router = express.Router()

router.get('/', controller.list)

export default router