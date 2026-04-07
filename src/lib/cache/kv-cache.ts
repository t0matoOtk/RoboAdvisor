// Vercel KV with in-memory fallback for local dev

const memCache = new Map<string, { value: unknown; expiresAt: number }>()

function isKvConfigured() {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  if (isKvConfigured()) {
    try {
      const { kv } = await import('@vercel/kv')
      return await kv.get<T>(key)
    } catch {
      // fall through to memory cache
    }
  }

  const entry = memCache.get(key)
  if (!entry) return null
  if (Date.now() > entry.expiresAt) {
    memCache.delete(key)
    return null
  }
  return entry.value as T
}

export async function cacheSet<T>(
  key: string,
  value: T,
  ttlSeconds: number
): Promise<void> {
  if (isKvConfigured()) {
    try {
      const { kv } = await import('@vercel/kv')
      await kv.set(key, value, { ex: ttlSeconds })
      return
    } catch {
      // fall through to memory cache
    }
  }

  memCache.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 })
}
