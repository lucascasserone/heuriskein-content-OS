import { NextResponse } from 'next/server'

import { disconnectSocialPlatform } from '@/lib/social/repository'
import { SocialPlatform } from '@/lib/social/types'
import { AUTH_REQUIRED_ERROR_MESSAGE } from '@/lib/supabase/config'

type RouteContext = {
  params: {
    platform: SocialPlatform
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    await disconnectSocialPlatform(params.platform)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to disconnect social account'
    return NextResponse.json(
      { error: message },
      { status: message === AUTH_REQUIRED_ERROR_MESSAGE ? 401 : 400 }
    )
  }
}
