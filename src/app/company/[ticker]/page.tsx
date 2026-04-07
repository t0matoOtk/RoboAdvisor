import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCompany } from '@/lib/constants/companies'
import { CompanyDetailView } from './CompanyDetailView'
import { fetchStockHistory } from '@/lib/data-sources/yahoo-finance'
import { fetchBtcHistory, fetchJpyUsdRate } from '@/lib/data-sources/btc-price'
import { computeMNavSeries } from '@/lib/calculations/mnav'
import { cacheGet, cacheSet } from '@/lib/cache/kv-cache'
import type { MNavResponse } from '@/types'

interface PageProps {
  params: { ticker: string }
}

async function getMNavData(ticker: string): Promise<MNavResponse | null> {
  const company = getCompany(ticker)
  if (!company) return null

  const CACHE_KEY = `mnav:${ticker}:90`
  const cached = await cacheGet<MNavResponse>(CACHE_KEY)
  if (cached) return cached

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
      ticker,
      company,
      series,
      latestSnapshot: series[series.length - 1],
      generatedAt: new Date().toISOString(),
    }

    await cacheSet(CACHE_KEY, result, 3600)
    return result
  } catch {
    return null
  }
}

export default async function CompanyPage({ params }: PageProps) {
  const ticker = params.ticker.toUpperCase()
  const company = getCompany(ticker)
  if (!company) notFound()

  const data = await getMNavData(ticker)
  if (!data) {
    return (
      <div className="py-20 text-center text-slate-500">
        Failed to load data for {ticker}. Please try again.
      </div>
    )
  }

  return (
    <>
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-white"
      >
        ← Back to Dashboard
      </Link>
      <CompanyDetailView ticker={ticker} fallbackData={data} />
    </>
  )
}

export async function generateStaticParams() {
  const { COMPANIES } = await import('@/lib/constants/companies')
  return COMPANIES.map((c) => ({ ticker: c.ticker }))
}
