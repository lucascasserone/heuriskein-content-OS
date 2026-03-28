import { NextRequest, NextResponse } from 'next/server'

import { listSocialAccessMetrics } from '@/lib/social/repository'
import { AUTH_REQUIRED_ERROR_MESSAGE } from '@/lib/supabase/config'

export async function GET(request: NextRequest) {
  try {
    const postId = request.nextUrl.searchParams.get('postId') ?? undefined
    const metrics = await listSocialAccessMetrics(postId)
    return NextResponse.json({ metrics })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch social access metrics'
    return NextResponse.json(
      { error: message },
      { status: message === AUTH_REQUIRED_ERROR_MESSAGE ? 401 : 500 }
    )
  }
}
