import { NextRequest, NextResponse } from 'next/server'

import { listCompetitorHistory } from '@/lib/competitors/repository'
import { AUTH_REQUIRED_ERROR_MESSAGE } from '@/lib/supabase/config'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const limitParam = request.nextUrl.searchParams.get('limit')
    const limit = limitParam ? Number.parseInt(limitParam, 10) : 30
    const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.min(limit, 120) : 30

    const history = await listCompetitorHistory(params.id, safeLimit)
    return NextResponse.json({ history })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load competitor history'
    return NextResponse.json(
      { error: message },
      { status: message === AUTH_REQUIRED_ERROR_MESSAGE ? 401 : 500 }
    )
  }
}
