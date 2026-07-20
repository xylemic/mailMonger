import { 
  findNextQueuedEmailRequest,
  markEmailRequestAsSent
} from "./repository.js"

export async function processNextQueuedEmailRequest() {
  const emailRequest = await findNextQueuedEmailRequest()

  if (!emailRequest) {
    return
  }

  console.log(
    `[processor] processing email request ${emailRequest.id}`
  )

  await markEmailRequestAsSent(emailRequest.id)

  console.log(
    `[processor] email request ${emailRequest.id} marked as sent`
  )
}


export function startEmailRequestProcessor() {
  console.log("[processor] email request processor started")

  setInterval(processNextQueuedEmailRequest, 5000)
}


