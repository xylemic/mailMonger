import { db } from "../../database/connection.js"
import { apiKeys } from "../../database/schema/api-keys.js"
import { CreateApiKey } from "./types.js"

export async function createApiKeyRecord(
  apiKey : CreateApiKey
) {
  await db.insert(apiKeys).values(apiKey)
}



