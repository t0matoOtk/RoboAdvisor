import type { Company } from '@/types'

export const COMPANIES: Company[] = [
  {
    ticker: 'MSTR',
    name: 'MicroStrategy',
    exchange: 'NASDAQ',
    yahooTicker: 'MSTR',
    currency: 'USD',
    btcHoldings: 763447,
    btcHoldingsAsOf: '2026-03-31',
    sharesOutstanding: 244000000,
    sharesAsOf: '2026-03-31',
  },
  {
    ticker: 'MARA',
    name: 'MARA Holdings',
    exchange: 'NASDAQ',
    yahooTicker: 'MARA',
    currency: 'USD',
    btcHoldings: 47531,
    btcHoldingsAsOf: '2025-03-31',
    sharesOutstanding: 467000000,
    sharesAsOf: '2026-03-31',
  },
  {
    ticker: '3350T',
    name: 'Metaplanet',
    exchange: 'TSE',
    yahooTicker: '3350.T',
    currency: 'JPY',
    btcHoldings: 4855,
    btcHoldingsAsOf: '2026-03-31',
    sharesOutstanding: 4200000000,
    sharesAsOf: '2026-03-31',
  },
]

export const COMPANY_MAP = Object.fromEntries(
  COMPANIES.map((c) => [c.ticker, c])
) as Record<string, Company>

export function getCompany(ticker: string): Company | undefined {
  return COMPANY_MAP[ticker.toUpperCase()]
}
