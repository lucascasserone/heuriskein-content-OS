import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

import { getSupabaseAnonKey, getSupabaseUrl, isSupabaseConfigured } from '@/lib/supabase/config'

export async function GET(request: NextRequest) {
  const loginUrl = new URL('/login?logout=1', request.url)
  const response = NextResponse.redirect(loginUrl)

  if (!isSupabaseConfigured()) {
    return response
  }

  const supabaseUrl = getSupabaseUrl()
  const anonKey = getSupabaseAnonKey()

  if (!supabaseUrl || !anonKey) {
    return response
  }

  const supabase = createServerClient(supabaseUrl, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options)
        })
      },
    },
  })

  try {
    await supabase.auth.signOut()
  } catch {
    // Redirect anyway so users can leave protected routes.
  }

  // Defensive cleanup for production edge runtimes where the auth helper may
  // not propagate all cookie mutations before redirect.
  request.cookies
    .getAll()
    .filter(({ name }) => name.startsWith('sb-'))
    .forEach(({ name }) => {
      response.cookies.set(name, '', {
        expires: new Date(0),
        path: '/',
      })
    })

  return response
}
