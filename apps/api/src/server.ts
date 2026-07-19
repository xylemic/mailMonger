import { app } from "./app.js"
import { env } from "./config/env.js"
import { connectDatabase } from "./database/connection.js"


async function start() {
  await connectDatabase()

  app.listen(env.PORT, () => console.log(`server running on port ${env.PORT}`))
}


start()


