export const CONTENT_PLATFORMS = ['instagram', 'tiktok', 'youtube', 'linkedin'] as const

export type ContentPlatform = (typeof CONTENT_PLATFORMS)[number]

export const INSTAGRAM_POST_TYPES = ['image', 'video', 'carousel', 'reel', 'story'] as const

export type InstagramPostType = (typeof INSTAGRAM_POST_TYPES)[number]

export const INSTAGRAM_POST_STATUSES = ['draft', 'scheduled', 'published', 'backlog'] as const

export type InstagramPostStatus = (typeof INSTAGRAM_POST_STATUSES)[number]

export interface InstagramPostMetrics {
  impressions: number
  engagementRate: number
  likes: number
  comments: number
  shares: number
  reach: number
}

export interface InstagramPost {
  id: string
  platform: 'instagram'
  title: string
  caption: string
  link?: string | null
  attachments?: string[]
  tags?: string[]
  postType: InstagramPostType
  status: InstagramPostStatus
  scheduledFor: string | null
  publishedAt: string | null
  metrics: InstagramPostMetrics
  createdAt: string
  updatedAt: string
}

export interface InstagramPostRecord {
  id: string
  user_id: string | null
  platform: ContentPlatform
  title: string
  caption: string
  external_link?: string | null
  attachments?: string[] | null
  tags?: string[] | null
  post_type: InstagramPostType
  status: InstagramPostStatus
  scheduled_for: string | null
  published_at: string | null
  impression_count: number
  engagement_rate: number
  like_count: number
  comment_count: number
  share_count: number
  reach_count: number
  created_at: string
  updated_at: string
}

export interface CreateInstagramPostInput {
  title?: string
  caption: string
  link?: string | null
  attachments?: string[]
  tags?: string[]
  postType: InstagramPostType
  status: InstagramPostStatus
  scheduledFor?: string | null
  publishedAt?: string | null
}

export interface UpdateInstagramPostInput {
  title?: string
  caption?: string
  link?: string | null
  attachments?: string[]
  tags?: string[]
  postType?: InstagramPostType
  status?: InstagramPostStatus
  scheduledFor?: string | null
  publishedAt?: string | null
}

export function buildInstagramPostTitle(caption: string, title?: string): string {
  const normalizedTitle = title?.trim()
  if (normalizedTitle) {
    return normalizedTitle
  }

  const firstLine = caption.split('\n').find((line) => line.trim().length > 0)?.trim() ?? ''
  return firstLine.slice(0, 72) || 'Untitled post'
}

export function normalizePublishDates(status: InstagramPostStatus, scheduledFor?: string | null, publishedAt?: string | null) {
  return {
    scheduledFor: status === 'scheduled' ? scheduledFor ?? null : null,
    publishedAt: status === 'published' ? publishedAt ?? new Date().toISOString() : null,
  }
}

// ===== COMPETITOR TYPES =====

export interface CompetitorMetrics {
  followers: number
  followerGrowthRate: number // percentage
  monthlyFollowerChange: number
  avgEngagementRate: number // percentage
  avgEngagementCount: number
  totalPosts: number
  avgPostsPerWeek: number
  responseTime: number // in hours
  topPostEngage: number
  topPostCaption: string
}

export interface Competitor {
  id: string
  name: string
  handle: string
  platform: ContentPlatform
  metrics: CompetitorMetrics
  lastUpdated: string
}

export interface CompetitorRanking {
  category: 'followers' | 'engagementRate' | 'growthRate'
  rank: number
  competitorId: string
  competitorName: string
  value: number | string
}

export interface IndustryBenchmark {
  avgFollowerGrowthRate: number
  avgEngagementRate: number
  avgPostsPerWeek: number
  avgResponseTime: number
  avgFollowersIndustry: number
}

export interface CompetitorRecord {
  id: string
  user_id: string | null
  name: string
  handle: string
  platform: ContentPlatform
  follower_count: number
  follower_growth_rate: number
  monthly_follower_change: number
  avg_engagement_rate: number
  avg_engagement_count: number
  total_posts: number
  avg_posts_per_week: number
  response_time_hours: number
  top_post_engage: number
  top_post_caption: string
  last_updated: string
  created_at: string
  updated_at: string
}

export interface CompetitorHistoryRecord {
  id: string
  competitor_id: string
  user_id: string | null
  captured_at: string
  follower_count: number
  follower_growth_rate: number
  monthly_follower_change: number
  avg_engagement_rate: number
  avg_engagement_count: number
  total_posts: number
  avg_posts_per_week: number
  response_time_hours: number
  top_post_engage: number
  top_post_caption: string
  created_at: string
}

export interface CompetitorHistoryPoint {
  id: string
  competitorId: string
  capturedAt: string
  metrics: CompetitorMetrics
}

export interface CreateCompetitorInput {
  name: string
  handle: string
  platform: ContentPlatform
  metrics: CompetitorMetrics
}

export interface UpdateCompetitorInput {
  name?: string
  handle?: string
  platform?: ContentPlatform
  metrics?: Partial<CompetitorMetrics>
}