import { NextRequest, NextResponse } from 'next/server'
import { COMPANIES } from '@/lib/constants/companies'

export async function GET(req: NextRequest) {
  // Vercel cron jobs send a secret header for auth
  const authHeader = req.headers.get('authorization')
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const baseUrl = new URL(req.url).origin
  const results: Record<string, string> = {}

  await Promise.all(
    COMPANIES.map(async (company) => {
      try {
        const res = await fetch(
          `${baseUrl}/api/mnav?ticker=${company.ticker}&days=90`,
          { cache: 'no-store' }
        )
        results[company.ticker] = res.ok ? 'ok' : `error ${res.status}`
      } catch (e) {
        results[company.ticker] = `failed: ${String(e)}`
      }
    })
  )

  return NextResponse.json({ warmed: results, at: new Date().toISOString() })
}
