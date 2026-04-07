export interface StockDayData {
  date: string
  close: number
  sharesOutstanding: number
}

export async function fetchStockHistory(
  yahooTicker: string,
  days: number,
  sharesOutstanding: number
): Promise<StockDayData[]> {
  const encodedTicker = encodeURIComponent(yahooTicker)
  const res = await fetch(
    `https://query1.finance.yahoo.com/v8/finance/chart/${encodedTicker}?range=${days}d&interval=1d`,
    { headers: { 'User-Agent': 'Mozilla/5.0' } }
  )

  if (!res.ok) throw new Error(`Yahoo chart error ${res.status} for ${yahooTicker}`)

  const data = await res.json()
  const result = data?.chart?.result?.[0]
  if (!result) throw new Error(`No chart data for ${yahooTicker}`)

  const timestamps: number[] = result.timestamp ?? []
  const closes: number[] = result.indicators?.quote?.[0]?.close ?? []

  return timestamps
    .map((ts, i) => ({
      date: new Date(ts * 1000).toISOString().split('T')[0],
      close: closes[i],
      sharesOutstanding,
    }))
    .filter((row) => row.close != null && !isNaN(row.close))
}
