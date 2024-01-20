import express from "express"
import auth from "./auth"

const app = express.Router()

app.use("/auth", auth)

export default app