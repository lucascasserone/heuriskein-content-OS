import 'server-only'

import { mockCompetitors } from '@/lib/content/mock-competitors'
import { randomUUID } from 'node:crypto'

import {
  Competitor,
  CompetitorHistoryPoint,
  CompetitorHistoryRecord,
  CompetitorRecord,
  CreateCompetitorInput,
  IndustryBenchmark,
  UpdateCompetitorInput,
} from '@/lib/content/types'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import { getAuthenticatedUser } from '@/lib/supabase/server'

let inMemoryCompetitors = [...mockCompetitors]
let inMemoryCompetitorHistory: CompetitorHistoryPoint[] = []

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

function round2(value: number): number {
  return Math.round(value * 100) / 100
}

function buildInstagramMetricsUpdate(competitor: Competitor): Competitor {
  const now = new Date().toISOString()
  const currentFollowers = Math.max(1, competitor.metrics.followers)
  const hasNegativeSwing = Math.random() < 0.15
  const driftMultiplier = hasNegativeSwing
    ? -(Math.random() * 0.004 + 0.001)
    : Math.random() * 0.018 + 0.001

  const followerDelta = Math.floor(currentFollowers * driftMultiplier)
  const nextFollowers = Math.max(0, competitor.metrics.followers + followerDelta)
  const nextMonthlyChange = Math.round(competitor.metrics.monthlyFollowerChange * 0.85 + followerDelta * 18)
  const nextGrowthRate = clamp(round2((nextMonthlyChange / currentFollowers) * 100), -100, 100)
  const nextEngagementRate = clamp(
    round2(competitor.metrics.avgEngagementRate + (Math.random() - 0.45) * 0.7),
    0,
    100,
  )
  const engagementBase = Math.round((nextFollowers * nextEngagementRate) / 100)
  const nextEngagementCount = Math.max(
    0,
    Math.round(competitor.metrics.avgEngagementCount * 0.7 + engagementBase * 0.3),
  )
  const nextTotalPosts = Math.max(0, competitor.metrics.totalPosts + Math.floor(Math.random() * 3))
  const nextAvgPostsPerWeek = clamp(
    round2(competitor.metrics.avgPostsPerWeek + (Math.random() - 0.5) * 0.2),
    0,
    50,
  )
  const nextResponseTime = clamp(
    round2(competitor.metrics.responseTime + (Math.random() - 0.5) * 0.3),
    0,
    240,
  )
  const nextTopPostEngage = Math.max(
    competitor.metrics.topPostEngage,
    Math.round(nextEngagementCount * (1.15 + Math.random() * 0.55)),
  )

  return {
    ...competitor,
    metrics: {
      ...competitor.metrics,
      followers: nextFollowers,
      monthlyFollowerChange: nextMonthlyChange,
      followerGrowthRate: nextGrowthRate,
      avgEngagementRate: nextEngagementRate,
      avgEngagementCount: nextEngagementCount,
      totalPosts: nextTotalPosts,
      avgPostsPerWeek: nextAvgPostsPerWeek,
      responseTime: nextResponseTime,
      topPostEngage: nextTopPostEngage,
    },
    lastUpdated: now,
  }
}

function mapRecordToCompetitor(record: CompetitorRecord): Competitor {
  return {
    id: record.id,
    name: record.name,
    handle: record.handle,
    platform: record.platform,
    metrics: {
      followers: record.follower_count,
      followerGrowthRate: record.follower_growth_rate,
      monthlyFollowerChange: record.monthly_follower_change,
      avgEngagementRate: record.avg_engagement_rate,
      avgEngagementCount: record.avg_engagement_count,
      totalPosts: record.total_posts,
      avgPostsPerWeek: record.avg_posts_per_week,
      responseTime: record.response_time_hours,
      topPostEngage: record.top_post_engage,
      topPostCaption: record.top_post_caption,
    },
    lastUpdated: record.last_updated,
  }
}

function mapCompetitorToInsertPayload(competitor: Competitor) {
  return {
    id: competitor.id,
    name: competitor.name,
    handle: competitor.handle,
    platform: competitor.platform,
    follower_count: competitor.metrics.followers,
    follower_growth_rate: competitor.metrics.followerGrowthRate,
    monthly_follower_change: competitor.metrics.monthlyFollowerChange,
    avg_engagement_rate: competitor.metrics.avgEngagementRate,
    avg_engagement_count: competitor.metrics.avgEngagementCount,
    total_posts: competitor.metrics.totalPosts,
    avg_posts_per_week: competitor.metrics.avgPostsPerWeek,
    response_time_hours: competitor.metrics.responseTime,
    top_post_engage: competitor.metrics.topPostEngage,
    top_post_caption: competitor.metrics.topPostCaption,
    last_updated: competitor.lastUpdated,
  }
}

function mapHistoryRecordToPoint(record: CompetitorHistoryRecord): CompetitorHistoryPoint {
  return {
    id: record.id,
    competitorId: record.competitor_id,
    capturedAt: record.captured_at,
    metrics: {
      followers: record.follower_count,
      followerGrowthRate: record.follower_growth_rate,
      monthlyFollowerChange: record.monthly_follower_change,
      avgEngagementRate: record.avg_engagement_rate,
      avgEngagementCount: record.avg_engagement_count,
      totalPosts: record.total_posts,
      avgPostsPerWeek: record.avg_posts_per_week,
      responseTime: record.response_time_hours,
      topPostEngage: record.top_post_engage,
      topPostCaption: record.top_post_caption,
    },
  }
}

function buildHistoryInsertPayload(competitor: Competitor, capturedAt?: string) {
  return {
    competitor_id: competitor.id,
    captured_at: capturedAt ?? new Date().toISOString(),
    follower_count: competitor.metrics.followers,
    follower_growth_rate: competitor.metrics.followerGrowthRate,
    monthly_follower_change: competitor.metrics.monthlyFollowerChange,
    avg_engagement_rate: competitor.metrics.avgEngagementRate,
    avg_engagement_count: competitor.metrics.avgEngagementCount,
    total_posts: competitor.metrics.totalPosts,
    avg_posts_per_week: competitor.metrics.avgPostsPerWeek,
    response_time_hours: competitor.metrics.responseTime,
    top_post_engage: competitor.metrics.topPostEngage,
    top_post_caption: competitor.metrics.topPostCaption,
  }
}

async function ensureCompetitorSeedForUser() {
  const { supabase, user } = await getAuthenticatedUser()

  const { count, error: countError } = await supabase
    .from('competitor_metrics')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)

  if (countError) {
    throw new Error(countError.message)
  }

  if ((count ?? 0) > 0) {
    return { supabase, user }
  }

  const seedPayload = mockCompetitors.map((competitor) => ({
    user_id: user.id,
    ...mapCompetitorToInsertPayload({
      ...competitor,
      id: randomUUID(),
      lastUpdated: new Date().toISOString(),
    }),
  }))

  const { error: seedError } = await supabase
    .from('competitor_metrics')
    .insert(seedPayload)

  if (seedError) {
    throw new Error(seedError.message)
  }

  return { supabase, user }
}

async function snapshotCompetitorMetrics(competitor: Competitor) {
  if (!isSupabaseConfigured()) {
    inMemoryCompetitorHistory = [
      {
        id: randomUUID(),
        competitorId: competitor.id,
        capturedAt: new Date().toISOString(),
        metrics: competitor.metrics,
      },
      ...inMemoryCompetitorHistory,
    ]
    return
  }

  const { supabase, user } = await getAuthenticatedUser()
  const { error } = await supabase
    .from('competitor_metrics_history')
    .insert({
      user_id: user.id,
      ...buildHistoryInsertPayload(competitor),
    })

  if (error) {
    throw new Error(error.message)
  }
}

export async function listCompetitors(): Promise<Competitor[]> {
  if (!isSupabaseConfigured()) {
    return inMemoryCompetitors
  }

  const { supabase, user } = await ensureCompetitorSeedForUser()

  const { data, error } = await supabase
    .from('competitor_metrics')
    .select('*')
    .eq('user_id', user.id)
    .order('follower_count', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return (data as CompetitorRecord[]).map(mapRecordToCompetitor)
}

export async function getCompetitorById(id: string): Promise<Competitor | null> {
  if (!isSupabaseConfigured()) {
    return inMemoryCompetitors.find((competitor) => competitor.id === id) ?? null
  }

  const { supabase, user } = await ensureCompetitorSeedForUser()
  const { data, error } = await supabase
    .from('competitor_metrics')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  return data ? mapRecordToCompetitor(data as CompetitorRecord) : null
}

export async function getIndustryBenchmarks(): Promise<IndustryBenchmark> {
  const competitors = await listCompetitors()

  if (competitors.length === 0) {
    return {
      avgFollowerGrowthRate: 0,
      avgEngagementRate: 0,
      avgPostsPerWeek: 0,
      avgResponseTime: 0,
      avgFollowersIndustry: 0,
    }
  }

  const count = competitors.length

  const totalFollowers = competitors.reduce((sum, competitor) => sum + competitor.metrics.followers, 0)
  const totalFollowerGrowth = competitors.reduce((sum, competitor) => sum + competitor.metrics.followerGrowthRate, 0)
  const totalEngagement = competitors.reduce((sum, competitor) => sum + competitor.metrics.avgEngagementRate, 0)
  const totalPostsPerWeek = competitors.reduce((sum, competitor) => sum + competitor.metrics.avgPostsPerWeek, 0)
  const totalResponseTime = competitors.reduce((sum, competitor) => sum + competitor.metrics.responseTime, 0)

  return {
    avgFollowerGrowthRate: +(totalFollowerGrowth / count).toFixed(2),
    avgEngagementRate: +(totalEngagement / count).toFixed(2),
    avgPostsPerWeek: +(totalPostsPerWeek / count).toFixed(2),
    avgResponseTime: +(totalResponseTime / count).toFixed(1),
    avgFollowersIndustry: Math.floor(totalFollowers / count),
  }
}

export async function getCompetitorsByRank(
  metricKey: keyof Competitor['metrics'],
  order: 'asc' | 'desc' = 'desc',
): Promise<Competitor[]> {
  const competitors = await listCompetitors()

  return [...competitors].sort((a, b) => {
    const aValue = a.metrics[metricKey]
    const bValue = b.metrics[metricKey]

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return order === 'desc' ? bValue - aValue : aValue - bValue
    }

    return 0
  })
}

export async function createCompetitor(input: CreateCompetitorInput): Promise<Competitor> {
  const competitor: Competitor = {
    id: randomUUID(),
    name: input.name,
    handle: input.handle,
    platform: input.platform,
    metrics: input.metrics,
    lastUpdated: new Date().toISOString(),
  }

  if (!isSupabaseConfigured()) {
    inMemoryCompetitors = [competitor, ...inMemoryCompetitors]
    await snapshotCompetitorMetrics(competitor)
    return competitor
  }

  const { supabase, user } = await ensureCompetitorSeedForUser()
  const { data, error } = await supabase
    .from('competitor_metrics')
    .insert({
      user_id: user.id,
      ...mapCompetitorToInsertPayload(competitor),
    })
    .select('*')
    .single()

  if (error) {
    throw new Error(error.message)
  }

  const createdCompetitor = mapRecordToCompetitor(data as CompetitorRecord)
  await snapshotCompetitorMetrics(createdCompetitor)
  return createdCompetitor
}

export async function updateCompetitor(id: string, input: UpdateCompetitorInput): Promise<Competitor | null> {
  if (!isSupabaseConfigured()) {
    const existing = inMemoryCompetitors.find((competitor) => competitor.id === id)
    if (!existing) {
      return null
    }

    const updated: Competitor = {
      ...existing,
      name: input.name ?? existing.name,
      handle: input.handle ?? existing.handle,
      platform: input.platform ?? existing.platform,
      metrics: {
        ...existing.metrics,
        ...(input.metrics ?? {}),
      },
      lastUpdated: new Date().toISOString(),
    }

    inMemoryCompetitors = inMemoryCompetitors.map((competitor) => (competitor.id === id ? updated : competitor))
    await snapshotCompetitorMetrics(updated)
    return updated
  }

  const existing = await getCompetitorById(id)
  if (!existing) {
    return null
  }

  const merged: Competitor = {
    ...existing,
    name: input.name ?? existing.name,
    handle: input.handle ?? existing.handle,
    platform: input.platform ?? existing.platform,
    metrics: {
      ...existing.metrics,
      ...(input.metrics ?? {}),
    },
    lastUpdated: new Date().toISOString(),
  }

  const { supabase, user } = await getAuthenticatedUser()
  const { data, error } = await supabase
    .from('competitor_metrics')
    .update(mapCompetitorToInsertPayload(merged))
    .eq('id', id)
    .eq('user_id', user.id)
    .select('*')
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  if (!data) {
    return null
  }

  const updated = mapRecordToCompetitor(data as CompetitorRecord)
  await snapshotCompetitorMetrics(updated)
  return updated
}

export async function deleteCompetitor(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    const originalLength = inMemoryCompetitors.length
    inMemoryCompetitors = inMemoryCompetitors.filter((competitor) => competitor.id !== id)
    inMemoryCompetitorHistory = inMemoryCompetitorHistory.filter((point) => point.competitorId !== id)
    return inMemoryCompetitors.length < originalLength
  }

  const { supabase, user } = await getAuthenticatedUser()
  const { count, error } = await supabase
    .from('competitor_metrics')
    .delete({ count: 'exact' })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    throw new Error(error.message)
  }

  return Boolean(count)
}

export async function listCompetitorHistory(competitorId: string, limit = 30): Promise<CompetitorHistoryPoint[]> {
  if (!isSupabaseConfigured()) {
    return inMemoryCompetitorHistory
      .filter((point) => point.competitorId === competitorId)
      .sort((left, right) => right.capturedAt.localeCompare(left.capturedAt))
      .slice(0, limit)
  }

  const { supabase, user } = await getAuthenticatedUser()
  const { data, error } = await supabase
    .from('competitor_metrics_history')
    .select('*')
    .eq('competitor_id', competitorId)
    .eq('user_id', user.id)
    .order('captured_at', { ascending: false })
    .limit(limit)

  if (error) {
    throw new Error(error.message)
  }

  return (data as CompetitorHistoryRecord[]).map(mapHistoryRecordToPoint)
}

export async function refreshInstagramIndicators(
  competitorIds?: string[],
): Promise<{ competitors: Competitor[]; updatedCount: number; refreshedAt: string }> {
  const refreshedAt = new Date().toISOString()

  if (!isSupabaseConfigured()) {
    const idFilter = competitorIds && competitorIds.length > 0 ? new Set(competitorIds) : null
    const candidates = inMemoryCompetitors.filter(
      (competitor) =>
        competitor.platform === 'instagram' &&
        (idFilter ? idFilter.has(competitor.id) : true),
    )

    if (candidates.length === 0) {
      return {
        competitors: inMemoryCompetitors,
        updatedCount: 0,
        refreshedAt,
      }
    }

    const updatedById = new Map(candidates.map((competitor) => [competitor.id, buildInstagramMetricsUpdate(competitor)]))

    inMemoryCompetitors = inMemoryCompetitors.map((competitor) => {
      const updated = updatedById.get(competitor.id)
      return updated ?? competitor
    })

    const historyEntries = [...updatedById.values()].map((competitor) => ({
      id: randomUUID(),
      competitorId: competitor.id,
      capturedAt: refreshedAt,
      metrics: competitor.metrics,
    }))

    inMemoryCompetitorHistory = [...historyEntries, ...inMemoryCompetitorHistory]

    return {
      competitors: inMemoryCompetitors,
      updatedCount: updatedById.size,
      refreshedAt,
    }
  }

  const { supabase, user } = await ensureCompetitorSeedForUser()
  let query = supabase
    .from('competitor_metrics')
    .select('*')
    .eq('user_id', user.id)
    .eq('platform', 'instagram')

  if (competitorIds && competitorIds.length > 0) {
    query = query.in('id', competitorIds)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(error.message)
  }

  const competitors = (data as CompetitorRecord[]).map(mapRecordToCompetitor)
  if (competitors.length === 0) {
    return {
      competitors: await listCompetitors(),
      updatedCount: 0,
      refreshedAt,
    }
  }

  const updatedCompetitors = competitors.map(buildInstagramMetricsUpdate)

  await Promise.all(
    updatedCompetitors.map(async (competitor) => {
      const { error: updateError } = await supabase
        .from('competitor_metrics')
        .update(mapCompetitorToInsertPayload(competitor))
        .eq('id', competitor.id)
        .eq('user_id', user.id)

      if (updateError) {
        throw new Error(updateError.message)
      }
    }),
  )

  const historyPayload = updatedCompetitors.map((competitor) => ({
    user_id: user.id,
    ...buildHistoryInsertPayload(competitor, refreshedAt),
  }))

  const { error: historyError } = await supabase
    .from('competitor_metrics_history')
    .insert(historyPayload)

  if (historyError) {
    throw new Error(historyError.message)
  }

  return {
    competitors: await listCompetitors(),
    updatedCount: updatedCompetitors.length,
    refreshedAt,
  }
}

export function updateCompetitorMetrics(
  competitors: Competitor[],
  competitorId: string,
  updates: Partial<Competitor['metrics']>,
): Competitor[] {
  return competitors.map((c) =>
    c.id === competitorId
      ? {
          ...c,
          metrics: { ...c.metrics, ...updates },
          lastUpdated: new Date().toISOString(),
        }
      : c,
  )
}

export function simulateMetricsUpdate(competitors: Competitor[]): Competitor[] {
  return competitors.map((c) => ({
    ...c,
    metrics: {
      ...c.metrics,
      followers: c.metrics.followers + Math.floor(Math.random() * 500 - 250),
      monthlyFollowerChange: Math.floor(Math.random() * 5000 - 2500),
      followerGrowthRate: +(Math.random() * 8 - 2).toFixed(2),
      avgEngagementRate: +(c.metrics.avgEngagementRate + (Math.random() - 0.5) * 2).toFixed(2),
    },
    lastUpdated: new Date().toISOString(),
  }))
}
