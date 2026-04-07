'use client'

interface MarketStatusBannerProps {
  btcPrice: number
  fetchedAt: string
}

export function MarketStatusBanner({ btcPrice, fetchedAt }: MarketStatusBannerProps) {
  const date = new Date(fetchedAt)
  const minutesAgo = Math.floor((Date.now() - date.getTime()) / 60000)
  const timeLabel = minutesAgo === 0 ? 'just now' : `${minutesAgo}m ago`

  return (
    <div className="mb-6 flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/60 px-4 py-2 text-sm">
      <span className="h-2 w-2 rounded-full bg-orange-400 animate-pulse" />
      <span className="font-medium text-orange-400">
        BTC ${btcPrice.toLocaleString()}
      </span>
      <span className="text-slate-500">Updated {timeLabel}</span>
    </div>
  )
}
