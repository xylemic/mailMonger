import bcrypt from "bcrypt"

export async function verifyApiKey(
  apiKey : string,
  keyHash : string
) {
  return bcrypt.compare(apiKey, keyHash)
}



