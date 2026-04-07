import type { MNavDataPoint, BtcPricePoint } from '@/types'
import type { StockDayData } from '@/lib/data-sources/yahoo-finance'

export function computeMNavSeries(
  stockHistory: StockDayData[],
  btcHistory: BtcPricePoint[],
  btcHoldings: number,
  currency: 'USD' | 'JPY',
  fxRate?: number // JPY → USD, required when currency === 'JPY'
): MNavDataPoint[] {
  // Build BTC price lookup by date (normalize to YYYY-MM-DD)
  const btcByDate = new Map(
    btcHistory.map((p) => [p.date.slice(0, 10), p.price])
  )

  const results: MNavDataPoint[] = []

  for (const stock of stockHistory) {
    const btcPrice = btcByDate.get(stock.date)
    if (!btcPrice) continue // no BTC data for this trading day

    const stockPriceUsd =
      currency === 'JPY' && fxRate
        ? stock.close * fxRate
        : stock.close

    const marketCapUsd = stockPriceUsd * stock.sharesOutstanding
    const btcNavUsd = btcHoldings * btcPrice
    const mNav = marketCapUsd / btcNavUsd
    const premiumPct = (mNav - 1) * 100

    results.push({
      date: stock.date,
      stockPrice: stock.close,
      stockPriceUsd,
      sharesOutstanding: stock.sharesOutstanding,
      marketCapUsd,
      btcPrice,
      btcHoldings,
      btcNavUsd,
      mNav,
      premiumPct,
      ...(currency === 'JPY' && fxRate ? { fxRate } : {}),
    })
  }

  return results.sort((a, b) => a.date.localeCompare(b.date))
}
