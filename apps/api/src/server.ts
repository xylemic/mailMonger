import express from "express"

const app = express()

const PORT = 3000



app.get("/health", (request, response) => {
  response.status(200).json({
    service : "mailMonger",
    status : "healthy"
  })
})


app.listen(PORT, () => {
  console.log(`mailMonger api is runnung on port ${PORT}`)
})


