import { NextRequest, NextResponse } from 'next/server'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/config'

export async function GET(request: NextRequest) {
  const loginUrl = new URL('/login', request.url)

  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(loginUrl)
  }

  try {
    const supabase = await createSupabaseServerClient()
    await supabase.auth.signOut()
  } catch {
    // Redirect anyway so users can leave protected routes.
  }

  return NextResponse.redirect(loginUrl)
}
