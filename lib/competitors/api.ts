import {
  Competitor,
  CompetitorHistoryPoint,
  CreateCompetitorInput,
  IndustryBenchmark,
  UpdateCompetitorInput,
} from '@/lib/content/types'

async function parseResponse<T>(response: Response): Promise<T> {
  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    const message =
      payload && typeof payload === 'object' && 'error' in payload
        ? String(payload.error)
        : 'Request failed'

    throw new Error(message)
  }

  return payload as T
}

export async function fetchCompetitors(): Promise<Competitor[]> {
  const response = await fetch('/api/competitors', {
    cache: 'no-store',
  })

  const payload = await parseResponse<{ competitors: Competitor[] }>(response)
  return payload.competitors
}

export async function fetchCompetitorById(id: string): Promise<Competitor | null> {
  const response = await fetch(`/api/competitors/${id}`, {
    cache: 'no-store',
  })

  if (response.status === 404) {
    return null
  }

  const payload = await parseResponse<{ competitor: Competitor }>(response)
  return payload.competitor
}

export async function fetchIndustryBenchmarks(): Promise<IndustryBenchmark> {
  const response = await fetch('/api/competitors/benchmarks', {
    cache: 'no-store',
  })

  const payload = await parseResponse<{ benchmarks: IndustryBenchmark }>(response)
  return payload.benchmarks
}

export async function fetchCompetitorsByRank(
  metric: 'followers' | 'engagementRate' | 'growthRate',
): Promise<Competitor[]> {
  const response = await fetch(`/api/competitors?metric=${metric}`, {
    cache: 'no-store',
  })

  const payload = await parseResponse<{ competitors: Competitor[] }>(response)
  return payload.competitors
}

export async function createCompetitorRequest(input: CreateCompetitorInput): Promise<Competitor> {
  const response = await fetch('/api/competitors', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  })

  const payload = await parseResponse<{ competitor: Competitor }>(response)
  return payload.competitor
}

export async function updateCompetitorRequest(id: string, input: UpdateCompetitorInput): Promise<Competitor> {
  const response = await fetch(`/api/competitors/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  })

  const payload = await parseResponse<{ competitor: Competitor }>(response)
  return payload.competitor
}

export async function deleteCompetitorRequest(id: string): Promise<void> {
  const response = await fetch(`/api/competitors/${id}`, {
    method: 'DELETE',
  })

  if (response.status === 204) {
    return
  }

  await parseResponse(response)
}

export async function fetchCompetitorHistory(id: string, limit = 30): Promise<CompetitorHistoryPoint[]> {
  const response = await fetch(`/api/competitors/${id}/history?limit=${limit}`, {
    cache: 'no-store',
  })

  const payload = await parseResponse<{ history: CompetitorHistoryPoint[] }>(response)
  return payload.history
}

export async function refreshInstagramIndicatorsRequest(
  competitorIds?: string[],
): Promise<{ competitors: Competitor[]; updatedCount: number; refreshedAt: string }> {
  const response = await fetch('/api/competitors/refresh-instagram', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ competitorIds }),
  })

  return parseResponse<{ competitors: Competitor[]; updatedCount: number; refreshedAt: string }>(response)
}
