import { NextResponse } from 'next/server'

import { refreshInstagramIndicators } from '@/lib/competitors/repository'
import { AUTH_REQUIRED_ERROR_MESSAGE } from '@/lib/supabase/config'

export async function POST() {
  try {
    const result = await refreshInstagramIndicators()

    return NextResponse.json({
      updatedCount: result.updatedCount,
      refreshedAt: result.refreshedAt,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to auto-sync competitors'
    return NextResponse.json(
      { error: message },
      { status: message === AUTH_REQUIRED_ERROR_MESSAGE ? 401 : 500 },
    )
  }
}
