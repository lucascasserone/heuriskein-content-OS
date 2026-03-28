import { PublishSocialPostResult, SocialConnection, SocialPlatform } from '@/lib/social/types'

async function parseResponse<T>(response: Response): Promise<T> {
  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    const message = payload && typeof payload === 'object' && 'error' in payload
      ? String(payload.error)
      : 'Request failed'

    throw new Error(message)
  }

  return payload as T
}

export async function fetchSocialConnections(): Promise<SocialConnection[]> {
  const response = await fetch('/api/social/connections', { cache: 'no-store' })
  const payload = await parseResponse<{ connections: SocialConnection[] }>(response)
  return payload.connections
}

export async function connectInstagramAccount(input: { instagramUserId: string; accessToken: string }): Promise<SocialConnection> {
  const response = await fetch('/api/social/connections', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      platform: 'instagram',
      ...input,
    }),
  })

  const payload = await parseResponse<{ connection: SocialConnection }>(response)
  return payload.connection
}

export async function disconnectSocialPlatform(platform: SocialPlatform): Promise<void> {
  const response = await fetch(`/api/social/connections/${platform}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    const payload = await response.json().catch(() => null)
    const message = payload && typeof payload === 'object' && 'error' in payload
      ? String(payload.error)
      : 'Failed to disconnect platform'

    throw new Error(message)
  }
}

export async function publishPostToSocial(postId: string, platform: SocialPlatform = 'instagram'): Promise<PublishSocialPostResult> {
  const response = await fetch('/api/social/publish', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ postId, platform }),
  })

  const payload = await parseResponse<{ result: PublishSocialPostResult }>(response)
  return payload.result
}
