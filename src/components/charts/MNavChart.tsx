'use client'

import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { MNavDataPoint } from '@/types'

interface MNavChartProps {
  series: MNavDataPoint[]
  showBtcOverlay?: boolean
}

function tickInterval(count: number): number {
  if (count <= 60) return 7
  if (count <= 180) return 14
  if (count <= 365) return 30
  return 60
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  const d: MNavDataPoint = payload[0]?.payload
  if (!d) return null
  return (
    <div className="rounded-lg border border-slate-700 bg-slate-900 p-3 text-xs shadow-xl">
      <p className="mb-2 font-semibold text-slate-300">{label}</p>
      <p>
        mNAV:{' '}
        <span className="font-mono text-white">{d.mNav.toFixed(3)}x</span>
      </p>
      <p>
        Premium:{' '}
        <span
          className="font-mono font-semibold"
          style={{ color: d.premiumPct >= 0 ? '#ef4444' : '#22c55e' }}
        >
          {d.premiumPct >= 0 ? '+' : ''}
          {d.premiumPct.toFixed(1)}%
        </span>
      </p>
      <p>
        Stock: <span className="font-mono text-white">${d.stockPriceUsd.toFixed(2)}</span>
      </p>
      <p>
        BTC:{' '}
        <span className="font-mono text-white">
          ${d.btcPrice.toLocaleString()}
        </span>
      </p>
    </div>
  )
}

export function MNavChart({ series, showBtcOverlay = false }: MNavChartProps) {
  const data = series.map((p) => ({
    ...p,
    date: formatDate(p.date),
    btcPriceK: p.btcPrice / 1000,
  }))

  const interval = tickInterval(data.length)

  return (
    <ResponsiveContainer width="100%" height={380}>
      <ComposedChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="premiumGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="discountGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22c55e" stopOpacity={0} />
            <stop offset="95%" stopColor="#22c55e" stopOpacity={0.3} />
          </linearGradient>
        </defs>

        <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tick={{ fill: '#64748b', fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          interval={interval}
        />
        <YAxis
          yAxisId="mnav"
          tick={{ fill: '#64748b', fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `${v.toFixed(1)}x`}
          domain={['auto', 'auto']}
        />
        {showBtcOverlay && (
          <YAxis
            yAxisId="btc"
            orientation="right"
            tick={{ fill: '#64748b', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `$${v}K`}
          />
        )}

        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: 12, color: '#94a3b8' }}
          iconType="line"
        />

        {/* Fair value reference line */}
        <ReferenceLine
          yAxisId="mnav"
          y={1}
          stroke="#475569"
          strokeDasharray="4 4"
          label={{ value: 'Fair Value (1x)', fill: '#475569', fontSize: 11 }}
        />

        {/* mNAV area */}
        <Area
          yAxisId="mnav"
          type="monotone"
          dataKey="mNav"
          name="mNAV"
          stroke="#f97316"
          strokeWidth={2}
          fill="url(#premiumGradient)"
          dot={false}
          activeDot={{ r: 4, fill: '#f97316' }}
        />

        {showBtcOverlay && (
          <Line
            yAxisId="btc"
            type="monotone"
            dataKey="btcPriceK"
            name="BTC Price ($K)"
            stroke="#f59e0b"
            strokeWidth={1.5}
            dot={false}
            strokeDasharray="4 2"
          />
        )}
      </ComposedChart>
    </ResponsiveContainer>
  )
}
