import { NextResponse } from 'next/server'
import { COMPANIES } from '@/lib/constants/companies'

export async function GET() {
  return NextResponse.json(COMPANIES)
}
