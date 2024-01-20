import express from "express"

// route
import auth from "./auth"
import account from "./account"
import courses from "./courses"
import categories from "./categories"
import tags from "./tags"

const app = express.Router()

app.use("/auth", auth)
app.use("/account", account)
app.use("/courses", courses)
app.use("/categories", categories)
app.use("/tags", tags)

export default app