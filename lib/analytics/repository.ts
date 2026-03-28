import 'server-only'

import { InstagramPostType } from '@/lib/content/types'
import { listInstagramPosts } from '@/lib/instagram/repository'

type Summary = {
  totalImpressions: number
  averageEngagement: number
  totalReach: number
  scheduledPosts: number
}

type TrendPoint = {
  date: string
  impressions: number
  engagement: number
}

type ContentTypePoint = {
  name: string
  value: number
  color: string
}

type TopPostPoint = {
  id: string
  title: string
  likes: number
}

export interface AnalyticsSnapshot {
  generatedAt: string
  summary: Summary
  trends: TrendPoint[]
  contentTypes: ContentTypePoint[]
  topPosts: TopPostPoint[]
}

const typeColors: Record<InstagramPostType, string> = {
  image: '#60A5FA',
  video: '#F97316',
  carousel: '#A78BFA',
  reel: '#34D399',
  story: '#FACC15',
}

function getPostDateLabel(value: string): string {
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

function formatTypeLabel(type: InstagramPostType): string {
  return type.charAt(0).toUpperCase() + type.slice(1)
}

export async function getAnalyticsSnapshot(): Promise<AnalyticsSnapshot> {
  const posts = await listInstagramPosts()

  const datedPosts = [...posts].sort((left, right) => {
    const leftDate = left.publishedAt ?? left.scheduledFor ?? left.createdAt
    const rightDate = right.publishedAt ?? right.scheduledFor ?? right.createdAt
    return leftDate.localeCompare(rightDate)
  })

  const trends = datedPosts.map((post) => {
    const value = post.publishedAt ?? post.scheduledFor ?? post.createdAt
    return {
      date: getPostDateLabel(value),
      impressions: post.metrics.impressions,
      engagement: post.metrics.engagementRate,
    }
  })

  const contentTypes = (['image', 'video', 'carousel', 'reel', 'story'] as InstagramPostType[])
    .map((type) => ({
      name: formatTypeLabel(type),
      value: posts.filter((post) => post.postType === type).length,
      color: typeColors[type],
    }))
    .filter((entry) => entry.value > 0)

  const topPosts = [...posts]
    .sort((left, right) => right.metrics.likes - left.metrics.likes)
    .slice(0, 4)
    .map((post) => ({
      id: post.id,
      title: post.title,
      likes: post.metrics.likes,
    }))

  const totalImpressions = posts.reduce((total, post) => total + post.metrics.impressions, 0)
  const averageEngagement = posts.length > 0
    ? posts.reduce((total, post) => total + post.metrics.engagementRate, 0) / posts.length
    : 0
  const totalReach = posts.reduce((total, post) => total + post.metrics.reach, 0)
  const scheduledPosts = posts.filter((post) => post.status === 'scheduled').length

  return {
    generatedAt: new Date().toISOString(),
    summary: {
      totalImpressions,
      averageEngagement: Number(averageEngagement.toFixed(2)),
      totalReach,
      scheduledPosts,
    },
    trends,
    contentTypes,
    topPosts,
  }
}
