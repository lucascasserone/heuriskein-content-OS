export type NewsCategory = 'trends' | 'product' | 'insights'

export interface NewsItem {
  id: string
  title: string
  source: string
  category: NewsCategory
  date: string
  summary: string
  url: string
  tags: string[]
  saved?: boolean
}

export interface TrendingTopic {
  topic: string
  mentions: number
}

export interface CuratedCollection {
  name: string
  subscribers: number
}

export interface NewsSnapshot {
  generatedAt: string
  items: NewsItem[]
  trendingTopics: TrendingTopic[]
  collections: CuratedCollection[]
}
