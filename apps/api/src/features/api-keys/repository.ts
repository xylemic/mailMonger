import { db } from "../../database/connection.js"
import { eq } from "drizzle-orm"
import { apiKeys } from "../../database/schema/api-keys.js"
import { CreateApiKey } from "./types.js"

export async function createApiKeyRecord(
  apiKey : CreateApiKey
) {
  await db.insert(apiKeys).values(apiKey)
}


export async function findApiKeyByIdentifier(
  identifier : string
) {
  const [apiKey] = await db
    .select()
    .from(apiKeys)
    .where(eq(apiKeys.identifier, identifier))
    .limit(1)

  return apiKey ?? null
}



