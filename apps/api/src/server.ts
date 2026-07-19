import express from "express"
import { env } from "./config/env.js"

const app = express()

const PORT = env.PORT




app.get("/health", (request, response) => {
  response.status(200).json({
    service : "mailMonger",
    status : "healthy"
  })
})


app.listen(PORT, () => {
  console.log(`mailMonger api is runnung on port ${PORT}`)
})


