import { z } from "zod"

export const issueApiKeySchema = z.object({
  customerId : z.uuid(),
  name : z.string().min(1).max(100)
})


export type IssueApiKeyDto =
  z.infer<typeof issueApiKeySchema>



