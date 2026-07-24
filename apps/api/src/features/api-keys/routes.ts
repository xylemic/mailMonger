import { Router } from "express"

import { createApiKey } from "./controller.js"

export const apiKeyRoutes = Router()

apiKeyRoutes.post('/', createApiKey)



