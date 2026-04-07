# DAT.co mNAV Monitor

A web-based platform that tracks the **mNAV (Modified Net Asset Value)** premium/discount for Bitcoin Treasury Companies (DAT.co).

## Live Demo

🔗 [roboadvisor.vercel.app](https://roboadvisor.vercel.app) *(update after deployment)*

## What is mNAV?

**mNAV** measures how much premium (or discount) investors pay for a company's stock relative to the Bitcoin it holds.

```
BTC NAV    = BTC Holdings × BTC Price (USD)
mNAV       = Market Cap / BTC NAV
Premium %  = (mNAV − 1) × 100%
```

- **mNAV > 1** → Stock trades at a **premium** to its BTC holdings
- **mNAV < 1** → Stock trades at a **discount** to its BTC holdings
- **mNAV = 1** → Stock is fairly valued relative to BTC

## Tracked Companies

| Company | Ticker | Exchange | Why |
|---------|--------|----------|-----|
| MicroStrategy | MSTR | NASDAQ | Largest BTC holder, the benchmark DAT.co |
| MARA Holdings | MARA | NASDAQ | Largest Bitcoin miner, production-based DAT.co |
| Metaplanet | 3350.T | TSE | Asia's MicroStrategy, JPY-denominated |

## Features

- **Live BTC price** from CoinGecko
- **Historical mNAV chart** with 30d / 90d / 180d / 1Y / 2Y time ranges
- **BTC price overlay** to visualize correlation
- **AI-generated analyst summary** powered by Claude (optional)
- Hourly cache warm-up via Vercel Cron

## Tech Stack

- **Next.js 14** (App Router, TypeScript)
- **Recharts** for time-series visualization
- **CoinGecko API** for BTC price history
- **Yahoo Finance API** for stock price history
- **Vercel KV** for caching (falls back to in-memory locally)
- **Claude API** for AI summaries (optional)

## Local Development

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | Optional | Claude API key for AI summaries |
| `ENABLE_AI_SUMMARY` | Optional | Set `true` to enable AI summary backend |
| `NEXT_PUBLIC_ENABLE_AI_SUMMARY` | Optional | Set `true` to show AI summary button in UI |
| `KV_REST_API_URL` | Optional | Vercel KV URL (auto-injected on Vercel) |
| `KV_REST_API_TOKEN` | Optional | Vercel KV token (auto-injected on Vercel) |

## Relationship Between mNAV and Bitcoin

The mNAV premium of DAT.co stocks tends to **rise with BTC bull markets** and **compress during corrections**, because:

1. Investor sentiment drives speculative premium on top of BTC NAV
2. Companies like MSTR use leverage to acquire BTC, amplifying both upside and downside
3. The premium reflects the market's belief in the company's ability to continue accumulating BTC

MSTR historically trades at 1.5x–3x mNAV during bull markets, and can compress toward or below 1x during severe bear markets.
