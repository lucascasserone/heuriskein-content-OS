import { NextRequest, NextResponse } from 'next/server'

import { updateCompetitorSchema } from '@/lib/content/schemas'
import { deleteCompetitor, getCompetitorById, updateCompetitor } from '@/lib/competitors/repository'
import { AUTH_REQUIRED_ERROR_MESSAGE } from '@/lib/supabase/config'

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params
    const competitor = await getCompetitorById(id)

    if (!competitor) {
      return NextResponse.json({ error: 'Competitor not found' }, { status: 404 })
    }

    return NextResponse.json({ competitor })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const body = await request.json()
    const payload = updateCompetitorSchema.parse(body)
    const competitor = await updateCompetitor(params.id, payload)

    if (!competitor) {
      return NextResponse.json({ error: 'Competitor not found' }, { status: 404 })
    }

    return NextResponse.json({ competitor })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update competitor'
    return NextResponse.json(
      { error: message },
      { status: message === AUTH_REQUIRED_ERROR_MESSAGE ? 401 : 400 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const deleted = await deleteCompetitor(params.id)

    if (!deleted) {
      return NextResponse.json({ error: 'Competitor not found' }, { status: 404 })
    }

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete competitor'
    return NextResponse.json(
      { error: message },
      { status: message === AUTH_REQUIRED_ERROR_MESSAGE ? 401 : 500 }
    )
  }
}
