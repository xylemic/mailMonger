import { Request, Response } from "express"

import { issueApiKeySchema } from "./dto/issue-api-key.dto.js"
import { issueApiKey } from "./service.js"


export async function createApiKey(
  request : Request,
  response : Response
) {
  const apiKeyrequest = issueApiKeySchema.parse(request.body)

  const result = await issueApiKey(apiKeyrequest)

  response.status(201).json({
    message : "store this api key securely. you won't be able to see it again",
    apiKey : result.apiKey
  })
}



