'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import type { MNavDataPoint, SummaryRequest, SummaryResponse } from '@/types'

interface AISummaryPanelProps {
  ticker: string
  latestSnapshot: MNavDataPoint
  series: MNavDataPoint[]
}

export function AISummaryPanel({
  ticker,
  latestSnapshot,
  series,
}: AISummaryPanelProps) {
  const [summary, setSummary] = useState<SummaryResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleGenerate() {
    setLoading(true)
    setError(null)
    try {
      const body: SummaryRequest = {
        ticker,
        latestSnapshot,
        series: series.slice(-30),
      }
      const res = await fetch('/api/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? `Error ${res.status}`)
      }
      setSummary(await res.json())
    } catch (e) {
      setError(String(e))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900/60 p-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-white">AI Analyst Summary</h3>
          <p className="text-xs text-slate-500">Powered by Claude</p>
        </div>
        {!summary && (
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-500 disabled:opacity-50"
          >
            {loading ? 'Generating…' : 'Generate Summary'}
          </button>
        )}
      </div>

      {error && (
        <p className="mt-3 text-sm text-red-400">{error}</p>
      )}

      {summary && (
        <div className="mt-4">
          <div className="prose prose-sm prose-invert max-w-none text-slate-300">
            <ReactMarkdown>{summary.summary}</ReactMarkdown>
          </div>
          <p className="mt-3 text-right text-xs text-slate-600">
            {summary.model} ·{' '}
            {new Date(summary.generatedAt).toLocaleString()}
          </p>
          <button
            onClick={() => setSummary(null)}
            className="mt-2 text-xs text-slate-600 hover:text-slate-400"
          >
            Regenerate
          </button>
        </div>
      )}
    </div>
  )
}
