import 'server-only'

import { randomUUID } from 'node:crypto'

import { mockInstagramPosts } from '@/lib/content/mock-instagram-posts'
import {
  buildInstagramPostTitle,
  CreateInstagramPostInput,
  InstagramPost,
  InstagramPostRecord,
  normalizePublishDates,
  UpdateInstagramPostInput,
} from '@/lib/content/types'
import { getAuthenticatedUser } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/config'

let inMemoryInstagramPosts = [...mockInstagramPosts]

function mapRecordToInstagramPost(record: InstagramPostRecord): InstagramPost {
  return {
    id: record.id,
    platform: 'instagram',
    title: record.title,
    caption: record.caption,
    link: record.external_link ?? null,
    attachments: record.attachments ?? [],
    tags: record.tags ?? [],
    postType: record.post_type,
    status: record.status,
    scheduledFor: record.scheduled_for,
    publishedAt: record.published_at,
    metrics: {
      impressions: record.impression_count,
      engagementRate: record.engagement_rate,
      likes: record.like_count,
      comments: record.comment_count,
      shares: record.share_count,
      reach: record.reach_count,
    },
    createdAt: record.created_at,
    updatedAt: record.updated_at,
  }
}

function buildInsertPayload(input: CreateInstagramPostInput | UpdateInstagramPostInput) {
  const normalizedStatus = input.status
  const publishDates = normalizedStatus
    ? normalizePublishDates(normalizedStatus, input.scheduledFor, input.publishedAt)
    : {
        scheduledFor: input.scheduledFor,
        publishedAt: input.publishedAt,
      }

  // Only include optional columns when they have values to avoid
  // PostgREST schema cache errors on databases where migrations are pending.
  const payload: Record<string, unknown> = {
    title: input.caption ? buildInstagramPostTitle(input.caption, input.title) : input.title,
    caption: input.caption,
    post_type: input.postType,
    status: input.status,
    scheduled_for: publishDates.scheduledFor,
    published_at: publishDates.publishedAt,
  }

  if (input.link) payload.external_link = input.link
  if (input.attachments?.length) payload.attachments = input.attachments
  if (input.tags?.length) payload.tags = input.tags

  return payload
}

function sortPosts(posts: InstagramPost[]): InstagramPost[] {
  return [...posts].sort((left, right) => right.createdAt.localeCompare(left.createdAt))
}

export async function listInstagramPosts(): Promise<InstagramPost[]> {
  if (!isSupabaseConfigured()) {
    return sortPosts(inMemoryInstagramPosts)
  }

  const { supabase, user } = await getAuthenticatedUser()
  const { data, error } = await supabase
    .from('content_posts')
    .select('*')
    .eq('user_id', user.id)
    .eq('platform', 'instagram')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return (data as InstagramPostRecord[]).map(mapRecordToInstagramPost)
}

export async function createInstagramPost(input: CreateInstagramPostInput): Promise<InstagramPost> {
  const normalizedInput = {
    ...input,
    title: buildInstagramPostTitle(input.caption, input.title),
    link: input.link ?? null,
    attachments: input.attachments ?? [],
    tags: input.tags ?? [],
    ...normalizePublishDates(input.status, input.scheduledFor, input.publishedAt),
  }

  if (!isSupabaseConfigured()) {
    const timestamp = new Date().toISOString()
    const createdPost: InstagramPost = {
      id: randomUUID(),
      platform: 'instagram',
      title: normalizedInput.title,
      caption: normalizedInput.caption,
      link: normalizedInput.link,
      attachments: normalizedInput.attachments,
      tags: normalizedInput.tags,
      postType: normalizedInput.postType,
      status: normalizedInput.status,
      scheduledFor: normalizedInput.scheduledFor,
      publishedAt: normalizedInput.publishedAt,
      metrics: {
        impressions: 0,
        engagementRate: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        reach: 0,
      },
      createdAt: timestamp,
      updatedAt: timestamp,
    }

    inMemoryInstagramPosts = [createdPost, ...inMemoryInstagramPosts]
    return createdPost
  }

  const { supabase, user } = await getAuthenticatedUser()
  const { data, error } = await supabase
    .from('content_posts')
    .insert({
      user_id: user.id,
      platform: 'instagram',
      ...buildInsertPayload(normalizedInput),
    })
    .select('*')
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return mapRecordToInstagramPost(data as InstagramPostRecord)
}

export async function updateInstagramPost(id: string, input: UpdateInstagramPostInput): Promise<InstagramPost | null> {
  if (!isSupabaseConfigured()) {
    const currentPost = inMemoryInstagramPosts.find((post) => post.id === id)
    if (!currentPost) {
      return null
    }

    const normalizedStatus = input.status ?? currentPost.status
    const publishDates = normalizePublishDates(
      normalizedStatus,
      input.scheduledFor ?? currentPost.scheduledFor,
      input.publishedAt ?? currentPost.publishedAt
    )

    const updatedPost: InstagramPost = {
      ...currentPost,
      title: buildInstagramPostTitle(input.caption ?? currentPost.caption, input.title ?? currentPost.title),
      caption: input.caption ?? currentPost.caption,
      link: input.link ?? currentPost.link ?? null,
      attachments: input.attachments ?? currentPost.attachments ?? [],
      tags: input.tags ?? currentPost.tags ?? [],
      postType: input.postType ?? currentPost.postType,
      status: normalizedStatus,
      scheduledFor: publishDates.scheduledFor,
      publishedAt: publishDates.publishedAt,
      updatedAt: new Date().toISOString(),
    }

    inMemoryInstagramPosts = inMemoryInstagramPosts.map((post) => (post.id === id ? updatedPost : post))
    return updatedPost
  }

  const { supabase, user } = await getAuthenticatedUser()
  const { data, error } = await supabase
    .from('content_posts')
    .update(buildInsertPayload(input))
    .eq('id', id)
    .eq('user_id', user.id)
    .eq('platform', 'instagram')
    .select('*')
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  return data ? mapRecordToInstagramPost(data as InstagramPostRecord) : null
}

export async function deleteInstagramPost(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    const initialCount = inMemoryInstagramPosts.length
    inMemoryInstagramPosts = inMemoryInstagramPosts.filter((post) => post.id !== id)
    return inMemoryInstagramPosts.length < initialCount
  }

  const { supabase, user } = await getAuthenticatedUser()
  const { error, count } = await supabase
    .from('content_posts')
    .delete({ count: 'exact' })
    .eq('id', id)
    .eq('user_id', user.id)
    .eq('platform', 'instagram')

  if (error) {
    throw new Error(error.message)
  }

  return Boolean(count)
}