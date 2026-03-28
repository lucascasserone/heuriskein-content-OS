import { AnalyticsSnapshot } from '@/lib/analytics/repository'

async function parseResponse<T>(response: Response): Promise<T> {
  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    const message = payload && typeof payload === 'object' && 'error' in payload
      ? String(payload.error)
      : 'Request failed'

    throw new Error(message)
  }

  return payload as T
}

export async function fetchAnalyticsSnapshot(): Promise<AnalyticsSnapshot> {
  const response = await fetch('/api/analytics', {
    cache: 'no-store',
  })

  const payload = await parseResponse<{ analytics: AnalyticsSnapshot }>(response)
  return payload.analytics
}
