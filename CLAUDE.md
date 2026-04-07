# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install          # install dependencies
npm run dev          # start dev server at localhost:3000
npm run build        # production build
npm run lint         # ESLint
npm run type-check   # TypeScript check (no emit)
```

## Architecture

Next.js 14 App Router project. All API routes live under `src/app/api/`. Pages use React Server Components for initial data fetch; client components use SWR for interactive re-fetching.

### Data flow

```
Yahoo Finance (stock price/shares)  ─┐
CoinGecko (BTC price history)       ─┼─► /api/mnav ─► Vercel KV cache ─► frontend
Static registry (BTC holdings)      ─┘
                                              └─► /api/summary ─► Claude API ─► AI panel
```

### Key files

| File | Role |
|------|------|
| `src/types/index.ts` | All shared TypeScript interfaces |
| `src/lib/constants/companies.ts` | Company registry — BTC holdings must be updated manually after each disclosure |
| `src/lib/calculations/mnav.ts` | Pure mNAV computation — no I/O, easy to unit test |
| `src/lib/cache/kv-cache.ts` | Vercel KV wrapper with in-memory fallback for local dev |
| `src/app/api/mnav/route.ts` | Orchestration: fetches stock + BTC data, computes mNAV series, caches result |

### mNAV formula

```
btcNav      = btcHoldings × btcPrice (USD)
mNav        = marketCap (USD) / btcNav
premiumPct  = (mNav − 1) × 100
```

MetaPlanet (TSE) prices are in JPY — `src/lib/calculations/mnav.ts` normalises to USD via Frankfurter FX API before computing.

### Cache TTLs

| Key pattern | TTL |
|-------------|-----|
| `btc:price:current` | 5 min |
| `mnav:{ticker}:{days}` | 60 min |
| `summary:{ticker}` | 24 hr |

Vercel cron at `/api/cron/warm-cache` fires hourly to pre-warm all tickers.

## Environment variables

Copy `.env.example` to `.env.local` and fill in:
- `ANTHROPIC_API_KEY` — required for AI summary feature
- `ENABLE_AI_SUMMARY=true` — also set `NEXT_PUBLIC_ENABLE_AI_SUMMARY=true` to show the button in the UI
- `KV_REST_API_URL` / `KV_REST_API_TOKEN` — auto-injected by Vercel when a KV store is linked; in local dev the cache falls back to in-memory

## Updating BTC holdings

Edit `src/lib/constants/companies.ts` — update `btcHoldings` and `btcHoldingsAsOf` after each company's quarterly disclosure. The UI shows `btcHoldingsAsOf` as a disclosure note.
