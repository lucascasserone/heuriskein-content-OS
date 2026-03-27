import { NextRequest, NextResponse } from 'next/server'

import { refreshInstagramIndicators } from '@/lib/competitors/repository'
import { AUTH_REQUIRED_ERROR_MESSAGE } from '@/lib/supabase/config'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const competitorIds = Array.isArray(body?.competitorIds)
      ? body.competitorIds.filter((id: unknown): id is string => typeof id === 'string' && id.length > 0)
      : undefined

    const result = await refreshInstagramIndicators(competitorIds)

    return NextResponse.json({
      competitors: result.competitors,
      updatedCount: result.updatedCount,
      refreshedAt: result.refreshedAt,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to refresh Instagram indicators'
    return NextResponse.json(
      { error: message },
      { status: message === AUTH_REQUIRED_ERROR_MESSAGE ? 401 : 500 },
    )
  }
}
