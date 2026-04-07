import type { SnapshotResponse } from '@/types'
import { CompanyCard } from './CompanyCard'

interface DashboardGridProps {
  snapshots: SnapshotResponse[]
}

export function DashboardGrid({ snapshots }: DashboardGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {snapshots.map((s) => (
        <CompanyCard key={s.ticker} data={s} />
      ))}
    </div>
  )
}
