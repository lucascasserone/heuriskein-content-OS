import { NextResponse } from 'next/server'

import { getAnalyticsSnapshot } from '@/lib/analytics/repository'
import { AUTH_REQUIRED_ERROR_MESSAGE } from '@/lib/supabase/config'

export async function GET() {
  try {
    const analytics = await getAnalyticsSnapshot()
    return NextResponse.json({ analytics })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load analytics'
    return NextResponse.json(
      { error: message },
      { status: message === AUTH_REQUIRED_ERROR_MESSAGE ? 401 : 500 },
    )
  }
}
