import express from "express"
const router = express.Router()
import * as controller from "../app/controllers/auth"

router.post("/register", controller.register)
router.post("/login", controller.login)

export default router