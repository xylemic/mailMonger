import { z } from "zod"

export const createEmailRequestSchema = z.object({
  to : z.email(),
  subject : z.string().min(1),
  body : z.string().min(1)
})


