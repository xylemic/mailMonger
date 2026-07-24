type ParsedApiKey = {
  identifier : string
  secret : string
}

const API_KEY_PREFIX = "mm_live_"

export function parseApiKey(
  apiKey : string
) : ParsedApiKey {
  if (!apiKey.startsWith(API_KEY_PREFIX)) {
    throw new Error('invalid api key')
  }

  const rawKey = apiKey.slice(API_KEY_PREFIX.length)

  const separatorIndex = rawKey.indexOf(".")

  if (separatorIndex === -1) {
    throw new Error('invalid api key')
  }

  const identifier = rawKey.slice(0, separatorIndex)
  const secret = rawKey.slice(separatorIndex + 1)

  if (!identifier || !secret) {
    throw new Error('invalid api key')
  }

  return {
    identifier,
    secret
  }
}



