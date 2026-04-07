import type { BtcPricePoint } from '@/types'

const COINGECKO_BASE =
  process.env.COINGECKO_BASE_URL ?? 'https://api.coingecko.com/api/v3'

export async function fetchBtcCurrent(): Promise<number> {
  const res = await fetch(
    `${COINGECKO_BASE}/simple/price?ids=bitcoin&vs_currencies=usd`,
    { next: { revalidate: 300 } }
  )
  if (!res.ok) throw new Error(`CoinGecko error: ${res.status}`)
  const data = await res.json()
  return data.bitcoin.usd as number
}

export async function fetchBtcHistory(days: number): Promise<BtcPricePoint[]> {
  const res = await fetch(
    `${COINGECKO_BASE}/coins/bitcoin/market_chart?vs_currency=usd&days=${days}&interval=daily`,
    { next: { revalidate: 3600 } }
  )
  if (!res.ok) throw new Error(`CoinGecko error: ${res.status}`)
  const data = await res.json()

  // CoinGecko returns [[timestamp_ms, price], ...]
  return (data.prices as [number, number][]).map(([ts, price]) => ({
    date: new Date(ts).toISOString().split('T')[0],
    price,
  }))
}

export async function fetchJpyUsdRate(): Promise<number> {
  const res = await fetch('https://api.frankfurter.app/latest?from=JPY&to=USD', {
    next: { revalidate: 3600 },
  })
  if (!res.ok) throw new Error(`Frankfurter FX error: ${res.status}`)
  const data = await res.json()
  return data.rates.USD as number
}
