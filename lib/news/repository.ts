import 'server-only'

import { randomUUID } from 'node:crypto'

import { CuratedCollection, NewsItem, NewsSnapshot, TrendingTopic } from '@/lib/news/types'

type NewsTemplate = {
  title: string
  source: string
  category: NewsItem['category']
  summary: string
  url: string
  tags: string[]
}

const AUTO_SYNC_INTERVAL_MS = 60_000
const MAX_NEWS_ITEMS = 30

const seedTemplates: NewsTemplate[] = [
  {
    title: 'Latest Social Media Marketing Trends 2026',
    source: 'TechCrunch',
    category: 'trends',
    summary: 'AI copilots and short-form content experiments are shaping campaign planning across major platforms.',
    url: 'https://example.com/trends-2026',
    tags: ['AI', 'Social Media', 'Marketing'],
  },
  {
    title: 'Instagram Launches New Shopping Features',
    source: 'Meta Blog',
    category: 'product',
    summary: 'Instagram announced upgraded storefront templates and better product recommendation controls.',
    url: 'https://example.com/instagram-shopping',
    tags: ['Instagram', 'E-commerce', 'Features'],
  },
  {
    title: 'TikTok Algorithm Changes Explained',
    source: 'Creator Academy',
    category: 'insights',
    summary: 'A practical breakdown of ranking signals and retention patterns after the latest ranking update.',
    url: 'https://example.com/tiktok-algorithm',
    tags: ['TikTok', 'Algorithm', 'Strategy'],
  },
  {
    title: 'YouTube Adds Collaborative Shorts Editing',
    source: 'YouTube Official',
    category: 'product',
    summary: 'Creators can now publish collaborative drafts and accelerate editing workflows for Shorts content.',
    url: 'https://example.com/youtube-shorts-collab',
    tags: ['YouTube', 'Creators', 'Video'],
  },
  {
    title: 'Micro-Communities Drive Higher Conversion',
    source: 'Forbes',
    category: 'insights',
    summary: 'Brands focused on niche creator communities are reporting stronger engagement and conversion signals.',
    url: 'https://example.com/micro-communities',
    tags: ['Community', 'Conversion', 'Growth'],
  },
  {
    title: 'Social Commerce Spending Climbs in Q1',
    source: 'Insider Intelligence',
    category: 'trends',
    summary: 'Quarterly estimates indicate accelerating social commerce adoption among Gen Z and millennials.',
    url: 'https://example.com/social-commerce-q1',
    tags: ['Social Commerce', 'Retail', 'Q1'],
  },
]

const incrementalTemplates: NewsTemplate[] = [
  {
    title: 'Creators Double Down on Series-Based Content',
    source: 'HubSpot Research',
    category: 'trends',
    summary: 'Serialized content formats are showing stronger watch-through rates than one-off posts this month.',
    url: 'https://example.com/series-content',
    tags: ['Creators', 'Video', 'Retention'],
  },
  {
    title: 'LinkedIn Expands Analytics for Company Pages',
    source: 'LinkedIn Newsroom',
    category: 'product',
    summary: 'New attribution and audience cohort reports are now available for business content teams.',
    url: 'https://example.com/linkedin-analytics',
    tags: ['LinkedIn', 'Analytics', 'B2B'],
  },
  {
    title: 'Benchmark: Reels Hooks in First 2 Seconds',
    source: 'Later Insights',
    category: 'insights',
    summary: 'Top-performing Reels consistently establish visual context and value proposition in under two seconds.',
    url: 'https://example.com/reels-hooks',
    tags: ['Instagram', 'Reels', 'Benchmark'],
  },
]

function buildDate(daysAgo: number): string {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  return date.toISOString().slice(0, 10)
}

function toNewsItem(template: NewsTemplate, daysAgo: number): NewsItem {
  return {
    id: randomUUID(),
    title: template.title,
    source: template.source,
    category: template.category,
    date: buildDate(daysAgo),
    summary: template.summary,
    url: template.url,
    tags: [...template.tags],
    saved: false,
  }
}

function createSeedNews(): NewsItem[] {
  return seedTemplates.map((template, index) => toNewsItem(template, index))
}

let inMemoryNews: NewsItem[] = createSeedNews()
let lastSyncAt = Date.now()
let rollingTemplateIndex = 0

function syncNewsNow(): void {
  const template = incrementalTemplates[rollingTemplateIndex % incrementalTemplates.length]
  rollingTemplateIndex += 1

  const now = new Date().toISOString().slice(0, 10)

  inMemoryNews = [
    {
      id: randomUUID(),
      title: template.title,
      source: template.source,
      category: template.category,
      date: now,
      summary: template.summary,
      url: template.url,
      tags: [...template.tags],
      saved: false,
    },
    ...inMemoryNews,
  ].slice(0, MAX_NEWS_ITEMS)

  lastSyncAt = Date.now()
}

function ensureRecentNews(): void {
  if (Date.now() - lastSyncAt >= AUTO_SYNC_INTERVAL_MS) {
    syncNewsNow()
  }
}

function buildTrendingTopics(items: NewsItem[]): TrendingTopic[] {
  const mentions = new Map<string, number>()

  for (const item of items) {
    for (const tag of item.tags) {
      mentions.set(tag, (mentions.get(tag) ?? 0) + 1)
    }
  }

  return [...mentions.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, 4)
    .map(([topic, count]) => ({
      topic,
      mentions: count * 37,
    }))
}

function buildCollections(items: NewsItem[]): CuratedCollection[] {
  const trendsCount = items.filter((item) => item.category === 'trends').length
  const productCount = items.filter((item) => item.category === 'product').length
  const insightsCount = items.filter((item) => item.category === 'insights').length

  return [
    {
      name: 'Trends Watchlist',
      subscribers: 800 + trendsCount * 25,
    },
    {
      name: 'Product Updates',
      subscribers: 650 + productCount * 25,
    },
    {
      name: 'Creator Insights',
      subscribers: 700 + insightsCount * 25,
    },
    {
      name: 'Cross-Platform Briefing',
      subscribers: 900 + items.length * 10,
    },
  ]
}

export async function listNewsItems(search?: string, category?: 'all' | NewsItem['category']): Promise<NewsSnapshot> {
  ensureRecentNews()

  const normalizedSearch = search?.trim().toLowerCase() ?? ''

  const items = inMemoryNews
    .filter((item) => (category && category !== 'all' ? item.category === category : true))
    .filter((item) => {
      if (!normalizedSearch) {
        return true
      }

      const haystack = [
        item.title,
        item.summary,
        item.source,
        ...item.tags,
      ].join(' ').toLowerCase()

      return haystack.includes(normalizedSearch)
    })
    .sort((left, right) => right.date.localeCompare(left.date))

  return {
    generatedAt: new Date().toISOString(),
    items,
    trendingTopics: buildTrendingTopics(items),
    collections: buildCollections(items),
  }
}

export async function refreshNewsFeed(): Promise<NewsSnapshot> {
  syncNewsNow()
  return listNewsItems()
}

export async function toggleSavedNewsItem(id: string): Promise<NewsItem | null> {
  const existing = inMemoryNews.find((item) => item.id === id)
  if (!existing) {
    return null
  }

  const updated: NewsItem = {
    ...existing,
    saved: !existing.saved,
  }

  inMemoryNews = inMemoryNews.map((item) => (item.id === id ? updated : item))
  return updated
}
