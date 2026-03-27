import { NextResponse } from 'next/server'
import { getIndustryBenchmarks } from '@/lib/competitors/repository'

export async function GET() {
  try {
    const benchmarks = await getIndustryBenchmarks()
    return NextResponse.json({ benchmarks })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
