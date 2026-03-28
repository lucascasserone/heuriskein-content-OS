import { NextRequest, NextResponse } from 'next/server'

import { listNewsItems, refreshNewsFeed } from '@/lib/news/repository'

export async function GET(request: NextRequest) {
  try {
    const search = request.nextUrl.searchParams.get('q') ?? undefined
    const category = request.nextUrl.searchParams.get('category') as 'all' | 'trends' | 'product' | 'insights' | null

    const snapshot = await listNewsItems(search, category ?? undefined)
    return NextResponse.json({ news: snapshot })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load news'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST() {
  try {
    const snapshot = await refreshNewsFeed()
    return NextResponse.json({ news: snapshot })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to refresh news'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
