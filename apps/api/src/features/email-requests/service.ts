import { createEmailRequestRecord } from "./repository.js"
import { CreateEmailRequest } from "./types.js"


export async function acceptEmailRequest(
  request : CreateEmailRequest
) {
  await createEmailRequestRecord(request)

  return {
    message : "email request accepted"
  }
}


