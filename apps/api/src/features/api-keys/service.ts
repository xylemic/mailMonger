import { buildApiKey } from "./build-api-key.js"
import { hashApiKey } from "./hash-api-key.js"
import { createApiKeyRecord } from "./repository.js"


type IssueApiKeyRequest = {
  customerId : string
  name : string
}

export async function issueApiKey(
  request : IssueApiKeyRequest
) {
  const { identifier, secret, apiKey } = buildApiKey()

  const keyHash = await hashApiKey(secret)

  await createApiKeyRecord({
    customerId : request.customerId,
    name : request.name,
    identifier,
    keyHash 
  })

  return { apiKey }
}



