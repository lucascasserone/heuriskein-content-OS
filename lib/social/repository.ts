import 'server-only'

import { randomUUID } from 'node:crypto'

import { InstagramPost } from '@/lib/content/types'
import { listInstagramPosts, updateInstagramPost } from '@/lib/instagram/repository'
import {
  ConnectSocialInput,
  ConnectionMode,
  PublishSocialPostResult,
  SocialConnection,
  SocialPlatform,
  SUPPORTED_SOCIAL_PLATFORMS,
} from '@/lib/social/types'

const INSTAGRAM_GRAPH_VERSION = process.env.INSTAGRAM_GRAPH_API_VERSION ?? 'v21.0'
const PUBLISH_MODE = process.env.SOCIAL_PUBLISH_MODE === 'api' ? 'api' : 'mock'

type PlatformConnectionState = {
  accessToken: string
  accountId: string
  connectedAt: string
  updatedAt: string
}

const connectionStore: Partial<Record<SocialPlatform, PlatformConnectionState>> = {}

function buildConnection(platform: SocialPlatform): SocialConnection {
  const state = connectionStore[platform] ?? null

  return {
    platform,
    isConnected: Boolean(state),
    mode: state ? PUBLISH_MODE : 'mock',
    accountId: state?.accountId ?? null,
    instagramUserId: platform === 'instagram' ? (state?.accountId ?? null) : null,
    connectedAt: state?.connectedAt ?? null,
    updatedAt: state?.updatedAt ?? new Date().toISOString(),
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

async function publishToInstagramApi(post: InstagramPost, connection: PlatformConnectionState): Promise<string> {
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
    `https://graph.facebook.com/${INSTAGRAM_GRAPH_VERSION}/${connection.accountId}/media`,
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
    `https://graph.facebook.com/${INSTAGRAM_GRAPH_VERSION}/${connection.accountId}/media_publish`,
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
  return SUPPORTED_SOCIAL_PLATFORMS.map((platform) => buildConnection(platform))
}

export async function connectSocialPlatform(input: ConnectSocialInput): Promise<SocialConnection> {
  const now = new Date().toISOString()

  connectionStore[input.platform] = {
    accessToken: input.accessToken.trim(),
    accountId: input.accountId.trim(),
    connectedAt: connectionStore[input.platform]?.connectedAt ?? now,
    updatedAt: now,
  }

  return buildConnection(input.platform)
}

export async function disconnectSocialPlatform(platform: SocialPlatform): Promise<void> {
  delete connectionStore[platform]
}

export async function publishSocialPost(postId: string, platform: SocialPlatform): Promise<PublishSocialPostResult> {
  const posts = await listInstagramPosts()
  const targetPost = posts.find((post) => post.id === postId)

  if (!targetPost) {
    throw new Error('Post not found.')
  }

  const connection = connectionStore[platform]

  if (!connection) {
    throw new Error(`${platform} account is not connected.`)
  }

  const providerPostId =
    platform === 'instagram' && PUBLISH_MODE === 'api'
      ? await publishToInstagramApi(targetPost, connection)
      : `mock-${platform}-${randomUUID()}`

  const publishedAt = new Date().toISOString()
  await updateInstagramPost(postId, {
    status: 'published',
    publishedAt,
    scheduledFor: null,
  })

  return {
    platform,
    postId,
    publishedAt,
    providerPostId,
    mode: PUBLISH_MODE as ConnectionMode,
    message: platform === 'instagram' && PUBLISH_MODE === 'api'
      ? 'Post published directly to Instagram Graph API.'
      : `Post published to ${platform} in mock mode. Configure provider API credentials to enable direct API publishing.`,
  }
}
