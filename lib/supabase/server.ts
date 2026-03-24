import 'server-only'

import { cookies } from 'next/headers'

import { createServerClient } from '@supabase/ssr'
import { createClient, SupabaseClient, User } from '@supabase/supabase-js'

import {
  AUTH_REQUIRED_ERROR_MESSAGE,
  getSupabaseAnonKey,
  getSupabaseServiceRoleKey,
  getSupabaseUrl,
  isSupabaseAdminConfigured,
  isSupabaseConfigured,
} from '@/lib/supabase/config'

export async function createSupabaseServerClient(): Promise<SupabaseClient> {
  const supabaseUrl = getSupabaseUrl()
  const anonKey = getSupabaseAnonKey()

  if (!isSupabaseConfigured() || !supabaseUrl || !anonKey) {
    throw new Error('Supabase auth environment variables are missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.')
  }

  const cookieStore = cookies()

  return createServerClient(supabaseUrl, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        } catch {
          // Cookies can't always be mutated from server components.
        }
      },
    },
  })
}

export function createSupabaseAdminClient(): SupabaseClient {
  const supabaseUrl = getSupabaseUrl()
  const serviceRoleKey = getSupabaseServiceRoleKey()

  if (!isSupabaseAdminConfigured() || !supabaseUrl || !serviceRoleKey) {
    throw new Error('Supabase admin environment variables are missing. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.')
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

export async function getAuthenticatedUser(): Promise<{ supabase: SupabaseClient; user: User }> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase.auth.getUser()

  if (error) {
    throw new Error(error.message)
  }

  if (!data.user) {
    throw new Error(AUTH_REQUIRED_ERROR_MESSAGE)
  }

  return {
    supabase,
    user: data.user,
  }
}
