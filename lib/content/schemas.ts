import { z } from 'zod'

import { CONTENT_PLATFORMS, INSTAGRAM_POST_STATUSES, INSTAGRAM_POST_TYPES } from '@/lib/content/types'

function normalizeOptionalDateValue(value: unknown): string | null {
  if (value === null || value === undefined || value === '') {
    return null
  }

  const raw = String(value).trim()
  if (!raw) {
    return null
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    return raw
  }

  if (/^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}(:\d{2})?$/.test(raw)) {
    const parsed = new Date(raw.replace(' ', 'T'))
    return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString()
  }

  const parsed = new Date(raw)
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString()
}

const optionalDateField = z.preprocess(
  normalizeOptionalDateValue,
  z.union([
    z.string().datetime(),
    z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    z.null(),
  ])
).optional()

export const createInstagramPostSchema = z.object({
  title: z.string().trim().max(72).optional(),
  caption: z.string().trim().min(1, 'Caption is required'),
  link: z.union([z.string().trim().url(), z.literal(''), z.null()]).optional().transform((value) => (value === '' ? null : value)),
  attachments: z.array(z.string().trim().min(1)).max(10).optional(),
  tags: z.array(z.string().trim().min(1).max(40)).max(20).optional(),
  postType: z.enum(INSTAGRAM_POST_TYPES),
  status: z.enum(INSTAGRAM_POST_STATUSES),
  scheduledFor: optionalDateField,
  publishedAt: optionalDateField,
})

export const updateInstagramPostSchema = createInstagramPostSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  'At least one field is required to update a post'
)

const competitorMetricsSchema = z.object({
  followers: z.number().int().min(0),
  followerGrowthRate: z.number().min(-100).max(100),
  monthlyFollowerChange: z.number().int(),
  avgEngagementRate: z.number().min(0).max(100),
  avgEngagementCount: z.number().int().min(0),
  totalPosts: z.number().int().min(0),
  avgPostsPerWeek: z.number().min(0),
  responseTime: z.number().min(0),
  topPostEngage: z.number().int().min(0),
  topPostCaption: z.string().trim().min(1).max(280),
})

export const createCompetitorSchema = z.object({
  name: z.string().trim().min(1).max(120),
  handle: z.string().trim().min(1).max(120),
  platform: z.enum(CONTENT_PLATFORMS),
  metrics: competitorMetricsSchema,
})

export const updateCompetitorSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  handle: z.string().trim().min(1).max(120).optional(),
  platform: z.enum(CONTENT_PLATFORMS).optional(),
  metrics: competitorMetricsSchema.partial().optional(),
}).refine(
  (value) => Object.keys(value).length > 0,
  'At least one field is required to update a competitor'
)