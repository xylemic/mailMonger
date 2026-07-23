import { randomBytes } from "node:crypto"

export function generateApiKeyIdentifier() {
  return `mk_${randomBytes(5).toString('hex')}`
}



