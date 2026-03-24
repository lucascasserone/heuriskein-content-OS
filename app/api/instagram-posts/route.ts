import { NextRequest, NextResponse } from 'next/server'

import { createInstagramPostSchema } from '@/lib/content/schemas'
import { createInstagramPost, listInstagramPosts } from '@/lib/instagram/repository'
import { AUTH_REQUIRED_ERROR_MESSAGE } from '@/lib/supabase/config'

export async function GET() {
  try {
    const posts = await listInstagramPosts()
    return NextResponse.json({ posts })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch posts'
    return NextResponse.json(
      { error: message },
      { status: message === AUTH_REQUIRED_ERROR_MESSAGE ? 401 : 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const payload = createInstagramPostSchema.parse(body)
    const post = await createInstagramPost(payload)

    return NextResponse.json({ post }, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create post'
    return NextResponse.json(
      { error: message },
      { status: message === AUTH_REQUIRED_ERROR_MESSAGE ? 401 : 400 }
    )
  }
}