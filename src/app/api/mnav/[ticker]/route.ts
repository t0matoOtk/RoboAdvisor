import { NextRequest, NextResponse } from 'next/server'

// Delegates to the main /api/mnav route and returns only the snapshot
export async function GET(
  req: NextRequest,
  { params }: { params: { ticker: string } }
) {
  const ticker = params.ticker.toUpperCase()
  const baseUrl = new URL(req.url).origin
  const res = await fetch(`${baseUrl}/api/mnav?ticker=${ticker}&days=90`)

  if (!res.ok) {
    const err = await res.json()
    return NextResponse.json(err, { status: res.status })
  }

  const data = await res.json()
  return NextResponse.json({
    ticker: data.ticker,
    company: data.company,
    latestSnapshot: data.latestSnapshot,
    generatedAt: data.generatedAt,
  })
}
