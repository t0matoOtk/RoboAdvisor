import { NextResponse } from 'next/server'
import { fetchBtcCurrent } from '@/lib/data-sources/btc-price'
import { cacheGet, cacheSet } from '@/lib/cache/kv-cache'

export async function GET() {
  const CACHE_KEY = 'btc:price:current'

  const cached = await cacheGet<{ price: number; fetchedAt: string }>(CACHE_KEY)
  if (cached) return NextResponse.json(cached)

  const price = await fetchBtcCurrent()
  const result = { price, fetchedAt: new Date().toISOString() }
  await cacheSet(CACHE_KEY, result, 300) // 5 min TTL

  return NextResponse.json(result)
}
