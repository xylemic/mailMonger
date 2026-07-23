import { generateApiKeyIdentifier } from "./generate-api-key-identifier.js"
import { generateApiKeySecret } from "./generate-api-key-secret.js"


export function buildApiKey() {
  const identifier = generateApiKeyIdentifier()
  const secret = generateApiKeySecret()

  return {
    identifier,
    secret,
    apiKey : `mm_live_${identifier}.${secret}`
  }
}


