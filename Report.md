# DAT.co mNAV Monitor — Project Report

**Course Assignment: Financial Indicator Web Platform**
**Student:** *(your name)*
**Date:** April 2026

---

## 1. Selected Indicator

### What Indicator Did You Choose?

This project implements the **mNAV (Modified Net Asset Value) Premium/Discount** indicator for Digital Asset Treasury companies (DAT.co) — publicly listed companies that hold Bitcoin as a primary treasury asset.

The mNAV is calculated as follows:

```
BTC NAV    = BTC Holdings × BTC Price (USD)
mNAV       = Market Capitalization (USD) / BTC NAV
Premium %  = (mNAV − 1) × 100%
```

For example, if MicroStrategy holds Bitcoin worth $30B but its market cap is $45B, its mNAV is 1.5x, meaning investors pay a **50% premium** over the underlying BTC value. Conversely, an mNAV below 1.0x represents a discount.

### Why Did You Choose It?

The mNAV was selected for three reasons:

1. **Direct quantifiability.** Unlike qualitative sentiment indicators, mNAV is precisely calculable from public data: stock price, BTC holdings (from company filings), and BTC market price. This makes it ideal for time-series visualization.

2. **Decision relevance.** The premium/discount level has real investment implications. A historically high mNAV premium may signal overvaluation relative to BTC holdings, while a discount may represent a buying opportunity for investors who want BTC exposure through equities.

3. **Cross-market exposure.** mNAV bridges traditional equity markets and the crypto market, making it an interesting case study at the intersection of both asset classes.

---

## 2. Relationship with Bitcoin (BTC)

### How Is mNAV Related to BTC?

The mNAV indicator is **structurally dependent on BTC price**. Since the denominator of mNAV is `btcHoldings × btcPrice`, any change in BTC price directly affects the NAV baseline:

- When **BTC price rises**, the denominator increases, which compresses the mNAV ratio (all else equal).
- When **BTC price falls**, the denominator decreases, which expands the mNAV ratio.

However, the relationship is more nuanced in practice because **stock price also reacts to BTC price movements**, often amplifying them. The net mNAV direction depends on whether the market re-rates the equity faster or slower than BTC itself moves.

### Insights and Hypotheses

**Hypothesis 1: mNAV premium expands during BTC bull markets.**
During periods of strong BTC appreciation, investor sentiment toward DAT.co stocks becomes speculative, bidding up equity prices faster than the NAV rises. This is evidenced by MSTR trading at 2x–3x mNAV during the 2024–2025 bull cycle, compared to near-parity (1x) in bear markets.

**Hypothesis 2: mNAV is a sentiment proxy.**
The premium above 1.0x reflects the market's willingness to pay for: (a) management's BTC acquisition strategy, (b) leverage embedded in the corporate structure, and (c) regulatory accessibility for institutional investors who cannot hold BTC directly. When BTC sentiment turns negative, this speculative premium collapses, often faster than BTC itself falls — making DAT.co stocks higher-beta instruments than BTC.

**Hypothesis 3: Cross-company divergence reflects business model differences.**
MSTR (pure treasury strategy) consistently trades at a higher mNAV premium than MARA (mining operations). This suggests the market prices MARA's operational cost and cash-flow risk separately, reducing the "BTC treasury premium." Metaplanet (TSE) exhibits similar dynamics to MSTR but with additional JPY/USD currency risk embedded in its valuation.

---

## 3. Deployed Website URL

🔗 **[https://roboadvisor.vercel.app](https://roboadvisor.vercel.app)** *(update with your actual Vercel URL)*

The platform provides:
- A real-time dashboard showing mNAV premium/discount for MSTR, MARA, and Metaplanet
- Interactive time-series charts (30d / 90d / 180d / 1Y / 2Y) with BTC price overlay
- An optional AI-generated analyst summary powered by the Claude API

---

## 4. Data Collection

Stock price history is collected from the **Yahoo Finance public API** (`query1.finance.yahoo.com/v8/finance/chart`), which provides daily OHLCV data. BTC price history is sourced from the **CoinGecko API** (`/coins/bitcoin/market_chart`), which provides free daily close prices up to two years back. BTC holdings are maintained manually in the codebase registry, updated from each company's official quarterly disclosures.

To avoid exceeding API rate limits, computed mNAV series are cached server-side (1-hour TTL) with a daily warm-up cron job on Vercel.

---

## 5. Technical Implementation Summary

The platform is built with **Next.js 14** (App Router) and deployed on **Vercel**. Server components handle initial data fetching; client components use SWR for interactive time-range switching. The mNAV calculation is implemented as a pure function that aligns stock trading days with BTC daily prices by date, normalizing JPY-denominated prices (Metaplanet) to USD via the Frankfurter FX API before computing the ratio.
