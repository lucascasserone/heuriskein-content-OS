import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { publishInstagramPost } from '@/lib/social/repository'
import { AUTH_REQUIRED_ERROR_MESSAGE } from '@/lib/supabase/config'

const publishSchema = z.object({
  postId: z.string().trim().min(1),
  platform: z.literal('instagram').default('instagram'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const payload = publishSchema.parse(body)

    const result = await publishInstagramPost(payload.postId)
    return NextResponse.json({ result })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to publish post'
    return NextResponse.json(
      { error: message },
      { status: message === AUTH_REQUIRED_ERROR_MESSAGE ? 401 : 400 }
    )
  }
}
