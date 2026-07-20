import { eq } from "drizzle-orm"
import { db } from "../../database/connection.js"
import { emailRequests } from "../../database/schema/email-requests.js"
import { CreateEmailRequest } from "./types.js"

export async function createEmailRequestRecord(
  request : CreateEmailRequest
) {
  await db.insert(emailRequests).values(request)
}


export async function findNextQueuedEmailRequest() {
  const [emailRequest] = await db
    .select()
    .from(emailRequests)
    .where(eq(emailRequests.status, "queued"))
    .limit(1)

  return emailRequest ?? null
}


export async function markEmailRequestAsSent(id : string) {
  await db
    .update(emailRequests)
    .set({
      status : "sent"
    })
    .where(eq(emailRequests.id, id))
}


