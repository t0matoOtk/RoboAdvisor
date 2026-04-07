import { NextRequest, NextResponse } from 'next/server'
import { getCompany } from '@/lib/constants/companies'
import { fetchStockHistory } from '@/lib/data-sources/yahoo-finance'
import { fetchBtcHistory, fetchJpyUsdRate } from '@/lib/data-sources/btc-price'
import { computeMNavSeries } from '@/lib/calculations/mnav'
import { cacheGet, cacheSet } from '@/lib/cache/kv-cache'
import type { MNavResponse } from '@/types'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const ticker = searchParams.get('ticker')?.toUpperCase()
  const days = Math.min(parseInt(searchParams.get('days') ?? '90', 10), 730)

  if (!ticker) {
    return NextResponse.json({ error: 'ticker is required' }, { status: 400 })
  }

  const company = getCompany(ticker)
  if (!company) {
    return NextResponse.json({ error: `Unknown ticker: ${ticker}` }, { status: 400 })
  }

  const CACHE_KEY = `mnav:${ticker}:${days}`
  const cached = await cacheGet<MNavResponse>(CACHE_KEY)
  if (cached) return NextResponse.json(cached)

  // Fetch all data in parallel
  const [stockHistory, btcHistory, fxRate] = await Promise.all([
    fetchStockHistory(company.yahooTicker, days, company.sharesOutstanding),
    fetchBtcHistory(days),
    company.currency === 'JPY' ? fetchJpyUsdRate() : Promise.resolve(undefined),
  ])

  const series = computeMNavSeries(
    stockHistory,
    btcHistory,
    company.btcHoldings,
    company.currency,
    fxRate
  )

  if (series.length === 0) {
    return NextResponse.json({ error: 'No data available' }, { status: 502 })
  }

  const latestSnapshot = series[series.length - 1]
  const result: MNavResponse = {
    ticker,
    company,
    series,
    latestSnapshot,
    generatedAt: new Date().toISOString(),
  }

  await cacheSet(CACHE_KEY, result, 3600) // 1 hr TTL
  return NextResponse.json(result)
}
