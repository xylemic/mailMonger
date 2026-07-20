import { CreateEmailRequestDto } from "./dto/create-email-request.dto.js"
import { createEmailRequestRecord } from "./repository.js"
import { CreateEmailRequest } from "./types.js"

export async function acceptEmailRequest(
  request : CreateEmailRequestDto
) {
  const emailRequest : CreateEmailRequest = {
    // customerId : "demo-customer",
    // domainId : "demo-domain",

    recipient : request.to,
    subject : request.subject,
    body : request.body,
    status : "queued"
  }

  await createEmailRequestRecord(emailRequest)

  return {
    message : "email request accepted"
  }
}


