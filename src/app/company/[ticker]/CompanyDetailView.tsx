'use client'

import { useState } from 'react'
import useSWR from 'swr'
import type { MNavResponse } from '@/types'
import { MNavChart } from '@/components/charts/MNavChart'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { AISummaryPanel } from '@/components/ai/AISummaryPanel'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const TIME_RANGES = [
  { label: '30d', days: 30 },
  { label: '90d', days: 90 },
  { label: '180d', days: 180 },
  { label: '1Y', days: 365 },
  { label: '2Y', days: 730 },
]

interface CompanyDetailViewProps {
  ticker: string
  fallbackData: MNavResponse
}

export function CompanyDetailView({ ticker, fallbackData }: CompanyDetailViewProps) {
  const [days, setDays] = useState(90)
  const [showBtc, setShowBtc] = useState(false)

  const { data, isLoading } = useSWR<MNavResponse>(
    `/api/mnav?ticker=${ticker}&days=${days}`,
    fetcher,
    { fallbackData: days === 90 ? fallbackData : undefined }
  )

  const s = data?.latestSnapshot
  const company = data?.company ?? fallbackData.company

  // Stats
  const mNavValues = data?.series.map((p) => p.mNav) ?? []
  const minMNav = mNavValues.length ? Math.min(...mNavValues) : 0
  const maxMNav = mNavValues.length ? Math.max(...mNavValues) : 0
  const avgMNav = mNavValues.length
    ? mNavValues.reduce((a, b) => a + b, 0) / mNavValues.length
    : 0

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">{ticker}</h1>
            {s && <Badge premiumPct={s.premiumPct} />}
          </div>
          <p className="text-slate-500">{company.name} · {company.exchange}</p>
          <p className="mt-1 text-xs text-slate-600">
            BTC Holdings: {company.btcHoldings.toLocaleString()} BTC
            <span className="ml-2 text-slate-700">
              (as of {company.btcHoldingsAsOf})
            </span>
          </p>
        </div>
      </div>

      {/* Stats Row */}
      {s ? (
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {[
            { label: 'Current mNAV', value: `${s.mNav.toFixed(3)}x` },
            { label: 'Premium', value: `${s.premiumPct >= 0 ? '+' : ''}${s.premiumPct.toFixed(1)}%` },
            { label: `${days}d Low`, value: `${minMNav.toFixed(3)}x` },
            { label: `${days}d Avg`, value: `${avgMNav.toFixed(3)}x` },
            { label: `${days}d High`, value: `${maxMNav.toFixed(3)}x` },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2"
            >
              <p className="text-xs text-slate-500">{label}</p>
              <p className="font-mono text-sm font-semibold text-white">{value}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12" />
          ))}
        </div>
      )}

      {/* Chart controls */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex gap-1">
          {TIME_RANGES.map(({ label, days: d }) => (
            <button
              key={label}
              onClick={() => setDays(d)}
              className={`rounded px-3 py-1 text-sm transition-colors ${
                days === d
                  ? 'bg-orange-600 text-white'
                  : 'text-slate-500 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowBtc((v) => !v)}
          className={`rounded px-3 py-1 text-sm transition-colors ${
            showBtc ? 'bg-amber-900/50 text-amber-400' : 'text-slate-500 hover:text-white'
          }`}
        >
          BTC Overlay
        </button>
      </div>

      {/* Chart */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        {isLoading || !data ? (
          <Skeleton className="h-[380px]" />
        ) : (
          <MNavChart series={data.series} showBtcOverlay={showBtc} />
        )}
      </div>

      {/* AI Summary */}
      {s && data && process.env.NEXT_PUBLIC_ENABLE_AI_SUMMARY === 'true' && (
        <AISummaryPanel
          ticker={ticker}
          latestSnapshot={s}
          series={data.series}
        />
      )}
    </div>
  )
}
