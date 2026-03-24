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
  postType: InstagramPostType
  status: InstagramPostStatus
  scheduledFor?: string | null
  publishedAt?: string | null
}

export interface UpdateInstagramPostInput {
  title?: string
  caption?: string
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