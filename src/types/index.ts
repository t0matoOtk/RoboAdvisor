export interface Company {
  ticker: string
  name: string
  exchange: 'NASDAQ' | 'NYSE' | 'TSE' | 'AMEX'
  yahooTicker: string
  currency: 'USD' | 'JPY'
  btcHoldings: number
  btcHoldingsAsOf: string // ISO date
  sharesOutstanding: number // update manually after dilutive events
  sharesAsOf: string // ISO date
  logoUrl?: string
}

export interface MNavDataPoint {
  date: string // "YYYY-MM-DD"
  stockPrice: number // in native currency (USD or JPY)
  stockPriceUsd: number // normalized to USD
  sharesOutstanding: number
  marketCapUsd: number
  btcPrice: number // USD
  btcHoldings: number
  btcNavUsd: number // btcHoldings × btcPrice
  mNav: number // marketCapUsd / btcNavUsd
  premiumPct: number // (mNav - 1) × 100
  fxRate?: number // JPY/USD rate, only for TSE stocks
}

export interface MNavResponse {
  ticker: string
  company: Company
  series: MNavDataPoint[]
  latestSnapshot: MNavDataPoint
  generatedAt: string
}

export interface BtcPricePoint {
  date: string
  price: number
}

export interface SummaryRequest {
  ticker: string
  latestSnapshot: MNavDataPoint
  series: MNavDataPoint[] // last 30 days
}

export interface SummaryResponse {
  ticker: string
  summary: string // markdown
  generatedAt: string
  model: string
}

export interface SnapshotResponse {
  ticker: string
  company: Company
  latestSnapshot: MNavDataPoint
  generatedAt: string
}
