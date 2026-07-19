import { Router } from "express"
import { createEmailRequest } from "./controller.js"

export const emailRequestRouter = Router()


emailRequestRouter.post('/', createEmailRequest)


