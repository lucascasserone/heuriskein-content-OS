export type SocialPlatform = 'instagram'

export type ConnectionMode = 'mock' | 'api'

export interface SocialConnection {
  platform: SocialPlatform
  isConnected: boolean
  mode: ConnectionMode
  instagramUserId: string | null
  connectedAt: string | null
  updatedAt: string
}

export interface ConnectInstagramInput {
  instagramUserId: string
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
