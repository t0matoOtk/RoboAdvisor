import { COMPANIES } from '@/lib/constants/companies'
import { DashboardGrid } from '@/components/dashboard/DashboardGrid'
import { MarketStatusBanner } from '@/components/dashboard/MarketStatusBanner'
import { fetchStockHistory } from '@/lib/data-sources/yahoo-finance'
import { fetchBtcCurrent, fetchBtcHistory, fetchJpyUsdRate } from '@/lib/data-sources/btc-price'
import { computeMNavSeries } from '@/lib/calculations/mnav'
import { cacheGet, cacheSet } from '@/lib/cache/kv-cache'
import type { MNavResponse, SnapshotResponse } from '@/types'

async function getSnapshot(company: typeof COMPANIES[0]): Promise<SnapshotResponse | null> {
  const CACHE_KEY = `mnav:${company.ticker}:90`
  const cached = await cacheGet<MNavResponse>(CACHE_KEY)
  if (cached) {
    return {
      ticker: cached.ticker,
      company: cached.company,
      latestSnapshot: cached.latestSnapshot,
      generatedAt: cached.generatedAt,
    }
  }

  try {
    const [stockHistory, btcHistory, fxRate] = await Promise.all([
      fetchStockHistory(company.yahooTicker, 90, company.sharesOutstanding),
      fetchBtcHistory(90),
      company.currency === 'JPY' ? fetchJpyUsdRate() : Promise.resolve(undefined),
    ])

    const series = computeMNavSeries(
      stockHistory,
      btcHistory,
      company.btcHoldings,
      company.currency,
      fxRate
    )

    if (!series.length) return null

    const result: MNavResponse = {
      ticker: company.ticker,
      company,
      series,
      latestSnapshot: series[series.length - 1],
      generatedAt: new Date().toISOString(),
    }

    await cacheSet(CACHE_KEY, result, 3600)

    return {
      ticker: result.ticker,
      company: result.company,
      latestSnapshot: result.latestSnapshot,
      generatedAt: result.generatedAt,
    }
  } catch (e) {
    console.error(`[getSnapshot] ${company.ticker}:`, e)
    return null
  }
}

export default async function HomePage() {
  const [snapshotResults, btcPrice] = await Promise.all([
    Promise.all(COMPANIES.map(getSnapshot)),
    fetchBtcCurrent(),
  ])

  const snapshots = snapshotResults.filter((s): s is SnapshotResponse => s !== null)

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">mNAV Dashboard</h2>
        <p className="mt-1 text-sm text-slate-500">
          Premium/discount of Bitcoin treasury companies relative to their BTC
          Net Asset Value
        </p>
      </div>

      <MarketStatusBanner btcPrice={btcPrice} fetchedAt={new Date().toISOString()} />
      <DashboardGrid snapshots={snapshots} />

      <p className="mt-8 text-center text-xs text-slate-700">
        BTC holdings data as of each company&apos;s latest disclosure.
        Not financial advice.
      </p>
    </>
  )
}
