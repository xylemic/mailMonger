export const EmailRequestStatus = {
  QUEUED : 'queued',
  PROCESSING : 'processing',
  SENT : 'sent',
  FAILED : 'failed'
} as const

export type EmailRequestStatus = 
  (typeof EmailRequestStatus)[keyof typeof EmailRequestStatus]


