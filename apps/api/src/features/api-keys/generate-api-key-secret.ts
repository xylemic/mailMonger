import { randomBytes } from "node:crypto"

export function generateApiKeySecret() {
  return randomBytes(32).toString('base64url')
}


