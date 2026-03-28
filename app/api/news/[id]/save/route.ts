import { NextResponse } from 'next/server'

import { toggleSavedNewsItem } from '@/lib/news/repository'

export async function POST(
  _request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const item = await toggleSavedNewsItem(params.id)

    if (!item) {
      return NextResponse.json({ error: 'News item not found' }, { status: 404 })
    }

    return NextResponse.json({ item })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to toggle saved state'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
