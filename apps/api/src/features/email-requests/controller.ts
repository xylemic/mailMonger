import { Request, Response } from "express"
import { acceptEmailRequest } from "./service.js"

export async function createEmailRequest(
  req : Request,
  res : Response
) {
  const result = await acceptEmailRequest(req.body)

  res.status(202).json(result)
}


