import { connectDatabase, disconnectDatabase } from "../../database/connection.js"
import { authenticateApiKey } from "./authenticate-api-key.js"

await connectDatabase()

const result = await authenticateApiKey(
 "mm_live_mk_37c57bbbe7.l9W_XlxGdDXiMGYoqf5prtElW1NfJwcaKl3YFBA7ai0"
)

console.log(result)

await disconnectDatabase()

