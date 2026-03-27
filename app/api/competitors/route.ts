import { NextRequest, NextResponse } from 'next/server'
import { createCompetitorSchema } from '@/lib/content/schemas'
import { createCompetitor, listCompetitors, getCompetitorsByRank } from '@/lib/competitors/repository'
import { AUTH_REQUIRED_ERROR_MESSAGE } from '@/lib/supabase/config'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const metric = searchParams.get('metric') as 'followers' | 'engagementRate' | 'growthRate' | null

    if (metric) {
      // Handle ranked request
      const metricMap: Record<string, keyof import('@/lib/content/types').Competitor['metrics']> = {
        followers: 'followers',
        engagementRate: 'avgEngagementRate',
        growthRate: 'followerGrowthRate',
      }

      const dbMetric = metricMap[metric]
      if (!dbMetric) {
        return NextResponse.json({ error: 'Invalid metric' }, { status: 400 })
      }

      const competitors = await getCompetitorsByRank(dbMetric, 'desc')
      return NextResponse.json({ competitors })
    }

    // Return all competitors
    const competitors = await listCompetitors()
    return NextResponse.json({ competitors })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const payload = createCompetitorSchema.parse(body)
    const competitor = await createCompetitor(payload)

    return NextResponse.json({ competitor }, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create competitor'
    return NextResponse.json(
      { error: message },
      { status: message === AUTH_REQUIRED_ERROR_MESSAGE ? 401 : 400 }
    )
  }
}
