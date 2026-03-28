import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { connectSocialPlatform, listSocialConnections } from '@/lib/social/repository'
import { AUTH_REQUIRED_ERROR_MESSAGE } from '@/lib/supabase/config'
import { SUPPORTED_SOCIAL_PLATFORMS } from '@/lib/social/types'

const connectSchema = z.object({
  platform: z.enum(SUPPORTED_SOCIAL_PLATFORMS as [
    'instagram',
    'linkedin',
    'youtube',
    'x',
    'facebook',
  ]),
  accountId: z.string().trim().min(1, 'Account ID is required.'),
  accessToken: z.string().trim().min(1, 'Access token is required.'),
})

export async function GET() {
  try {
    const connections = await listSocialConnections()
    return NextResponse.json({ connections })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch connections'
    return NextResponse.json(
      { error: message },
      { status: message === AUTH_REQUIRED_ERROR_MESSAGE ? 401 : 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const payload = connectSchema.parse(body)

    const connection = await connectSocialPlatform(payload)
    return NextResponse.json({ connection })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to connect social account'
    return NextResponse.json(
      { error: message },
      { status: message === AUTH_REQUIRED_ERROR_MESSAGE ? 401 : 400 }
    )
  }
}
