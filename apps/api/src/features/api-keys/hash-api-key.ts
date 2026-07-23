import bcrypt from "bcrypt"

const SALT_ROUNDS = 12

export async function hashApiKey(apiKey : string) {
  return bcrypt.hash(apiKey, SALT_ROUNDS)
}

