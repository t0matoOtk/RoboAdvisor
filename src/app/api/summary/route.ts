import { NextRequest, NextResponse } from 'next/server'
import { getCompany } from '@/lib/constants/companies'
import { generateSummary } from '@/lib/claude/summary'
import { cacheGet, cacheSet } from '@/lib/cache/kv-cache'
import type { SummaryRequest, SummaryResponse } from '@/types'

export async function POST(req: NextRequest) {
  if (process.env.ENABLE_AI_SUMMARY !== 'true') {
    return NextResponse.json({ error: 'AI summary is disabled' }, { status: 403 })
  }

  const body: SummaryRequest = await req.json()

  if (!body.ticker || !body.latestSnapshot || !body.series) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const company = getCompany(body.ticker)
  if (!company) {
    return NextResponse.json({ error: `Unknown ticker: ${body.ticker}` }, { status: 400 })
  }

  const CACHE_KEY = `summary:${body.ticker}`
  const cached = await cacheGet<SummaryResponse>(CACHE_KEY)
  if (cached) return NextResponse.json(cached)

  const result = await generateSummary(body)
  await cacheSet(CACHE_KEY, result, 86400) // 24 hr TTL

  return NextResponse.json(result)
}
