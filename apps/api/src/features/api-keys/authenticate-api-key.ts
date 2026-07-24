import { parseApiKey } from "./parse-api-key.js"
import { verifyApiKey } from "./verify-api-key.js"
import { findApiKeyByIdentifier } from "./repository.js"

export async function authenticateApiKey(
  apiKey : string
) {
  const parsed = parseApiKey(apiKey)

  const storedApiKey =
    await findApiKeyByIdentifier(parsed.identifier)

  if (!storedApiKey) {
    return null
  }


  const isValid = await verifyApiKey(
    parsed.secret,
    storedApiKey.keyHash
  )

  if (!isValid) {
    return null
  }


  return storedApiKey
}


