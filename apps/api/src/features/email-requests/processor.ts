import { sendEmail } from "./provider.js"
import { 
  findNextQueuedEmailRequest,
  markEmailRequestAsProcessing,
  markEmailRequestAsSent,
  incrementRetryCount,
  markEmailRequestAsQueued,
  markEmailRequestAsFailed
} from "./repository.js"


const MAX_RETRIES = 3

export async function processNextQueuedEmailRequest() {
  const emailRequest = await findNextQueuedEmailRequest()

  if (!emailRequest) {
    return
  }

  console.log(
    `[processor] claimed email request ${emailRequest.id}`
  )

  await markEmailRequestAsProcessing(emailRequest.id)

  try {
    await sendEmail()

    await markEmailRequestAsSent(emailRequest.id)

    console.log(
      `[processor] email request ${emailRequest.id} marked as sent`
    )
  } catch (error) {
    console.error(
      `[processor] failed to send email request ${emailRequest.id}`,
      error
    )

    await incrementRetryCount(emailRequest.id)

    if (emailRequest.retryCount + 1 >= MAX_RETRIES) {
      await markEmailRequestAsFailed(emailRequest.id)

      console.log(
        `[processor] email request ${emailRequest.id} permanently failed`
      )
    } else {
      await markEmailRequestAsQueued(emailRequest.id)

      console.log(
        `[processor] email request ${emailRequest.id} requeued`
      )
    }
  }
}


export function startEmailRequestProcessor() {
  console.log("[processor] email request processor started")

  setInterval(processNextQueuedEmailRequest, 5000)
}


