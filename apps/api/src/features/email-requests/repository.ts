import { eq, sql } from "drizzle-orm"
import { db } from "../../database/connection.js"
import { emailRequests } from "../../database/schema/email-requests.js"
import { CreateEmailRequest } from "./types.js"
import { EmailRequestStatus } from "./status.js"

export async function createEmailRequestRecord(
  request : CreateEmailRequest
) {
  await db.insert(emailRequests).values(request)
}


export async function findNextQueuedEmailRequest() {
  const [emailRequest] = await db
    .select()
    .from(emailRequests)
    .where(eq(emailRequests.status, EmailRequestStatus.QUEUED))
    .limit(1)

  return emailRequest ?? null
}


export async function markEmailRequestAsProcessing(id : string) {
  await db
    .update(emailRequests)
    .set({
      status : EmailRequestStatus.PROCESSING
    })
    .where(eq(emailRequests.id, id))
}


export async function markEmailRequestAsQueued(id : string) {
  await db
    .update(emailRequests)
    .set({
      status : EmailRequestStatus.QUEUED
    })
    .where(eq(emailRequests.id, id))
}


export async function markEmailRequestAsFailed(id : string) {
  await db
    .update(emailRequests)
    .set({
      status : EmailRequestStatus.FAILED
    })
    .where(eq(emailRequests.id, id))
}


export async function incrementRetryCount(id : string) {
  await db
    .update(emailRequests)
    .set({
      retryCount : sql`${emailRequests.retryCount} + 1`
    })
    .where(eq(emailRequests.id, id))
}


export async function markEmailRequestAsSent(id : string) {
  await db
    .update(emailRequests)
    .set({
      status : EmailRequestStatus.SENT
    })
    .where(eq(emailRequests.id, id))
}


