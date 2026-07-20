import { app } from "./app.js"
import { env } from "./config/env.js"
import { connectDatabase } from "./database/connection.js"


function startHttpServer() {
  app.listen(env.PORT, () => console.log(`server running on port ${env.PORT}`))
}


async function start() {
  try {
    console.log("connecting to postgresql...")

    await connectDatabase()

    console.log("database connection established")

    startHttpServer()

  } catch (error) {
    console.error("")
    console.error("mailmonger failed to start")
    console.error("")
    console.error("reason")
    console.error(error)
    console.error("")
    console.error("the application cannot accept requests without a database connection")
    console.error("")

    process.exit(1)
  }
}


start()


