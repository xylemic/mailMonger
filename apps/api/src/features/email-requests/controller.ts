import { Request, Response } from "express"
import { createEmailRequestSchema } from "./email-request-schema.js"
import { acceptEmailRequest } from "./service.js"

export async function createEmailRequest(
  req : Request,
  res : Response
) {
  const validationResult = createEmailRequestSchema.safeParse(req.body)

  if (!validationResult.success) {
    return res.status(400).json({
      message : 'invalid request',
      errors : validationResult.error.issues
    })
  }

  const result = await acceptEmailRequest(validationResult.data)

  return res.status(202).json(result)
}


