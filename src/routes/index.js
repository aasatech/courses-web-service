import express from "express"
import auth from "./auth"
import account from "./account"
const app = express.Router()

app.use("/auth", auth)
app.use("/account", account)

export default app