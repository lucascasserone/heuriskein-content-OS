import 'server-only'

import { randomUUID } from 'node:crypto'

import { InstagramPost } from '@/lib/content/types'
import { listInstagramPosts, updateInstagramPost } from '@/lib/instagram/repository'
import {
  ConnectInstagramInput,
  ConnectionMode,
  PublishSocialPostResult,
  SocialConnection,
  SocialPlatform,
} from '@/lib/social/types'

const INSTAGRAM_GRAPH_VERSION = process.env.INSTAGRAM_GRAPH_API_VERSION ?? 'v21.0'
const PUBLISH_MODE = process.env.SOCIAL_PUBLISH_MODE === 'api' ? 'api' : 'mock'

type InstagramConnectionState = {
  accessToken: string
  instagramUserId: string
  connectedAt: string
  updatedAt: string
}

let instagramConnection: InstagramConnectionState | null = null

function buildConnection(): SocialConnection {
  return {
    platform: 'instagram',
    isConnected: Boolean(instagramConnection),
    mode: instagramConnection ? PUBLISH_MODE : 'mock',
    instagramUserId: instagramConnection?.instagramUserId ?? null,
    connectedAt: instagramConnection?.connectedAt ?? null,
    updatedAt: instagramConnection?.updatedAt ?? new Date().toISOString(),
  }
}

function getMediaUrl(post: InstagramPost): string | null {
  const firstAttachment = post.attachments?.[0] ?? null
  if (!firstAttachment) {
    return null
  }

  const value = firstAttachment.trim()
  if (!value.startsWith('http://') && !value.startsWith('https://')) {
    return null
  }

  return value
}

async function publishToInstagramApi(post: InstagramPost, connection: InstagramConnectionState): Promise<string> {
  const mediaUrl = getMediaUrl(post)

  if (!mediaUrl) {
    throw new Error('Instagram direct publish requires at least one attachment URL (public image URL).')
  }

  const createMediaParams = new URLSearchParams({
    image_url: mediaUrl,
    caption: post.caption,
    access_token: connection.accessToken,
  })

  const createMediaResponse = await fetch(
    `https://graph.facebook.com/${INSTAGRAM_GRAPH_VERSION}/${connection.instagramUserId}/media`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: createMediaParams.toString(),
      cache: 'no-store',
    }
  )

  const createMediaPayload = await createMediaResponse.json().catch(() => null)

  if (!createMediaResponse.ok || !createMediaPayload || typeof createMediaPayload.id !== 'string') {
    const errorMessage =
      createMediaPayload && typeof createMediaPayload === 'object' && 'error' in createMediaPayload
        ? JSON.stringify(createMediaPayload.error)
        : 'Failed to create Instagram media container.'

    throw new Error(errorMessage)
  }

  const publishParams = new URLSearchParams({
    creation_id: createMediaPayload.id,
    access_token: connection.accessToken,
  })

  const publishResponse = await fetch(
    `https://graph.facebook.com/${INSTAGRAM_GRAPH_VERSION}/${connection.instagramUserId}/media_publish`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: publishParams.toString(),
      cache: 'no-store',
    }
  )

  const publishPayload = await publishResponse.json().catch(() => null)

  if (!publishResponse.ok || !publishPayload || typeof publishPayload.id !== 'string') {
    const errorMessage =
      publishPayload && typeof publishPayload === 'object' && 'error' in publishPayload
        ? JSON.stringify(publishPayload.error)
        : 'Failed to publish Instagram media container.'

    throw new Error(errorMessage)
  }

  return publishPayload.id
}

export async function listSocialConnections(): Promise<SocialConnection[]> {
  return [buildConnection()]
}

export async function connectInstagram(input: ConnectInstagramInput): Promise<SocialConnection> {
  const now = new Date().toISOString()

  instagramConnection = {
    accessToken: input.accessToken.trim(),
    instagramUserId: input.instagramUserId.trim(),
    connectedAt: instagramConnection?.connectedAt ?? now,
    updatedAt: now,
  }

  return buildConnection()
}

export async function disconnectSocialPlatform(platform: SocialPlatform): Promise<void> {
  if (platform === 'instagram') {
    instagramConnection = null
  }
}

export async function publishInstagramPost(postId: string): Promise<PublishSocialPostResult> {
  const posts = await listInstagramPosts()
  const targetPost = posts.find((post) => post.id === postId)

  if (!targetPost) {
    throw new Error('Post not found.')
  }

  if (!instagramConnection) {
    throw new Error('Instagram account is not connected.')
  }

  const providerPostId = PUBLISH_MODE === 'api'
    ? await publishToInstagramApi(targetPost, instagramConnection)
    : `mock-${randomUUID()}`

  const publishedAt = new Date().toISOString()
  await updateInstagramPost(postId, {
    status: 'published',
    publishedAt,
    scheduledFor: null,
  })

  return {
    platform: 'instagram',
    postId,
    publishedAt,
    providerPostId,
    mode: PUBLISH_MODE as ConnectionMode,
    message: PUBLISH_MODE === 'api'
      ? 'Post published directly to Instagram Graph API.'
      : 'Post published in mock mode. Set SOCIAL_PUBLISH_MODE=api to publish to Instagram Graph API.',
  }
}
