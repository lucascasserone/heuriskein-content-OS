export type SocialPlatform = 'instagram' | 'linkedin' | 'youtube' | 'x' | 'facebook'

export type ConnectionMode = 'mock' | 'api'

export interface SocialConnection {
  platform: SocialPlatform
  isConnected: boolean
  mode: ConnectionMode
  accountId: string | null
  instagramUserId: string | null
  connectedAt: string | null
  updatedAt: string
}

export interface ConnectSocialInput {
  platform: SocialPlatform
  accountId: string
  accessToken: string
}

export interface PublishSocialPostInput {
  platform: SocialPlatform
  postId: string
}

export interface PublishSocialPostResult {
  platform: SocialPlatform
  postId: string
  publishedAt: string
  providerPostId: string
  mode: ConnectionMode
  message: string
}

export const SUPPORTED_SOCIAL_PLATFORMS: SocialPlatform[] = [
  'instagram',
  'linkedin',
  'youtube',
  'x',
  'facebook',
]
