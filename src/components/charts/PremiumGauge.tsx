'use client'

interface PremiumGaugeProps {
  premiumPct: number
}

export function PremiumGauge({ premiumPct }: PremiumGaugeProps) {
  const isPremium = premiumPct >= 0
  const color = isPremium ? '#ef4444' : '#22c55e'
  const label = isPremium ? 'Premium' : 'Discount'

  // Clamp to ±200% for display
  const clampedPct = Math.max(-200, Math.min(200, premiumPct))
  // Map -200..+200 to 0..100 for bar width
  const barWidth = ((clampedPct + 200) / 400) * 100

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>Discount</span>
        <span>Fair Value</span>
        <span>Premium</span>
      </div>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-800">
        {/* center line */}
        <div className="absolute left-1/2 top-0 h-full w-px bg-slate-600" />
        <div
          className="absolute top-0 h-full rounded-full transition-all duration-500"
          style={{
            width: '8px',
            left: `calc(${barWidth}% - 4px)`,
            backgroundColor: color,
          }}
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold" style={{ color }}>
          {isPremium ? '+' : ''}
          {premiumPct.toFixed(1)}%
        </span>
        <span className="text-xs text-slate-500">{label}</span>
      </div>
    </div>
  )
}
