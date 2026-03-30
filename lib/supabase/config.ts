export const AUTH_REQUIRED_ERROR_MESSAGE = 'Authentication required.'

function normalizeEnvValue(value: string | undefined): string | undefined {
  if (!value) {
    return undefined
  }

  const trimmed = value.trim()
  if (!trimmed) {
    return undefined
  }

  // Accept values accidentally pasted with wrapping quotes in env providers.
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim() || undefined
  }

  return trimmed
}

function isValidHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

export function getSupabaseUrl(): string | undefined {
  const normalized = normalizeEnvValue(process.env.NEXT_PUBLIC_SUPABASE_URL)
  if (!normalized || !isValidHttpUrl(normalized)) {
    return undefined
  }

  return normalized
}

export function getSupabaseAnonKey(): string | undefined {
  return normalizeEnvValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

export function getSupabaseServiceRoleKey(): string | undefined {
  return normalizeEnvValue(process.env.SUPABASE_SERVICE_ROLE_KEY)
}

export function isSupabaseConfigured(): boolean {
  return Boolean(getSupabaseUrl() && getSupabaseAnonKey())
}

export function isSupabaseAdminConfigured(): boolean {
  return Boolean(getSupabaseUrl() && getSupabaseServiceRoleKey())
}
