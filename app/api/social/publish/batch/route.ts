import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { publishSocialPostBatch } from '@/lib/social/repository'
import { AUTH_REQUIRED_ERROR_MESSAGE } from '@/lib/supabase/config'
import { SUPPORTED_SOCIAL_PLATFORMS } from '@/lib/social/types'

const publishBatchSchema = z.object({
  postId: z.string().trim().min(1),
  platforms: z.array(
    z.enum(SUPPORTED_SOCIAL_PLATFORMS as ['instagram', 'linkedin', 'youtube', 'x', 'facebook'])
  ).min(1, 'Select at least one social platform.'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const payload = publishBatchSchema.parse(body)

    const result = await publishSocialPostBatch(payload.postId, payload.platforms)
    return NextResponse.json({ result })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to publish post to selected platforms'
    return NextResponse.json(
      { error: message },
      { status: message === AUTH_REQUIRED_ERROR_MESSAGE ? 401 : 400 }
    )
  }
}
