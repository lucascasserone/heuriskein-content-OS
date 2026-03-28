import { NewsItem, NewsSnapshot } from '@/lib/news/types'

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

export async function fetchNews(q?: string, category?: 'all' | 'trends' | 'product' | 'insights'): Promise<NewsSnapshot> {
  const params = new URLSearchParams()
  if (q) {
    params.set('q', q)
  }

  if (category && category !== 'all') {
    params.set('category', category)
  }

  const query = params.toString()
  const response = await fetch(`/api/news${query ? `?${query}` : ''}`, { cache: 'no-store' })

  const payload = await parseResponse<{ news: NewsSnapshot }>(response)
  return payload.news
}

export async function refreshNews(): Promise<NewsSnapshot> {
  const response = await fetch('/api/news', {
    method: 'POST',
    cache: 'no-store',
  })

  const payload = await parseResponse<{ news: NewsSnapshot }>(response)
  return payload.news
}

export async function toggleSaveNews(id: string): Promise<NewsItem> {
  const response = await fetch(`/api/news/${id}/save`, {
    method: 'POST',
  })

  const payload = await parseResponse<{ item: NewsItem }>(response)
  return payload.item
}
