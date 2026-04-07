import Link from 'next/link'
import type { SnapshotResponse } from '@/types'
import { PremiumGauge } from '@/components/charts/PremiumGauge'
import { Badge } from '@/components/ui/Badge'

interface CompanyCardProps {
  data: SnapshotResponse
}

export function CompanyCard({ data }: CompanyCardProps) {
  const { company, latestSnapshot: s } = data

  return (
    <Link href={`/company/${company.ticker}`}>
      <div className="group rounded-xl border border-slate-800 bg-slate-900/60 p-5 transition-all hover:border-slate-600 hover:bg-slate-900">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="font-bold text-white group-hover:text-orange-400 transition-colors">
              {company.ticker}
            </h2>
            <p className="text-sm text-slate-500">{company.name}</p>
          </div>
          <Badge premiumPct={s.premiumPct} />
        </div>

        <PremiumGauge premiumPct={s.premiumPct} />

        <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
          <div>
            <p className="text-slate-500">mNAV</p>
            <p className="font-mono font-semibold text-white">
              {s.mNav.toFixed(3)}x
            </p>
          </div>
          <div>
            <p className="text-slate-500">BTC Holdings</p>
            <p className="font-mono font-semibold text-white">
              {s.btcHoldings.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-slate-500">Stock Price</p>
            <p className="font-mono font-semibold text-white">
              ${s.stockPriceUsd.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-slate-500">Market Cap</p>
            <p className="font-mono font-semibold text-white">
              ${(s.marketCapUsd / 1e9).toFixed(2)}B
            </p>
          </div>
        </div>

        <p className="mt-3 text-right text-xs text-slate-600">
          View chart →
        </p>
      </div>
    </Link>
  )
}
