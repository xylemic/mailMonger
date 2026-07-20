import { db } from "../../database/connection.js"
import { emailRequests } from "../../database/schema/email-requests.js"
import { CreateEmailRequest } from "./types.js"

export async function createEmailRequestRecord(
  request : CreateEmailRequest
) {
  await db.insert(emailRequests).values(request)
}


