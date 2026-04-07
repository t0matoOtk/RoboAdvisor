'use client'

interface BadgeProps {
  premiumPct: number
}

export function Badge({ premiumPct }: BadgeProps) {
  const isPremium = premiumPct >= 0
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        isPremium
          ? 'bg-red-900/40 text-red-400'
          : 'bg-green-900/40 text-green-400'
      }`}
    >
      {isPremium ? '+' : ''}
      {premiumPct.toFixed(1)}%
    </span>
  )
}
