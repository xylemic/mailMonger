import express from "express"
import { emailRequestRouter } from "./features/email-requests/routes.js"
import { apiKeyRoutes } from "./features/api-keys/routes.js"

export const app = express()

app.use(express.json())
app.use("/email-requests", emailRequestRouter)
app.use("/api-keys", apiKeyRoutes)

app.get("/health", (_, res) => {
  res.send("mailmonger api is running")
})


