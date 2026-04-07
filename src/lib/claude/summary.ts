import Anthropic from '@anthropic-ai/sdk'
import type { SummaryRequest, SummaryResponse } from '@/types'

const MODEL = 'claude-sonnet-4-6'

function buildPrompt(req: SummaryRequest): string {
  const { ticker, latestSnapshot: s, series } = req
  const last30 = series.slice(-30)
  const mNavValues = last30.map((p) => p.mNav)
  const minMNav = Math.min(...mNavValues).toFixed(3)
  const maxMNav = Math.max(...mNavValues).toFixed(3)
  const avgMNav = (mNavValues.reduce((a, b) => a + b, 0) / mNavValues.length).toFixed(3)

  const trend =
    last30.length >= 2
      ? last30[last30.length - 1].mNav > last30[0].mNav
        ? 'increasing'
        : 'decreasing'
      : 'stable'

  return `You are a concise financial analyst specializing in Bitcoin treasury companies.

Company: ${ticker}
Current mNAV: ${s.mNav.toFixed(3)}
Current Premium to NAV: ${s.premiumPct.toFixed(1)}%
BTC Holdings: ${s.btcHoldings.toLocaleString()} BTC
Stock Price (USD): $${s.stockPriceUsd.toFixed(2)}
BTC Price: $${s.btcPrice.toLocaleString()}
Market Cap: $${(s.marketCapUsd / 1e9).toFixed(2)}B
BTC NAV: $${(s.btcNavUsd / 1e9).toFixed(2)}B

30-day mNAV range: ${minMNav} – ${maxMNav} (avg: ${avgMNav})
30-day trend: ${trend}

Write a 3-paragraph analyst note (maximum 150 words total) covering:
1. Current valuation status (premium vs discount, historical context from the 30-day range)
2. Key risk or catalyst to watch given the current mNAV level
3. One-sentence conclusion for a retail investor

Do not give financial advice. Speak in plain English. Do not use bullet points.`
}

export async function generateSummary(
  req: SummaryRequest
): Promise<SummaryResponse> {
  const client = new Anthropic()
  const prompt = buildPrompt(req)

  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 400,
    messages: [{ role: 'user', content: prompt }],
  })

  const summary =
    message.content[0].type === 'text' ? message.content[0].text : ''

  return {
    ticker: req.ticker,
    summary,
    generatedAt: new Date().toISOString(),
    model: MODEL,
  }
}
