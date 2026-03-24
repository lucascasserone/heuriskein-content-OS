import {
  CreateInstagramPostInput,
  InstagramPost,
  UpdateInstagramPostInput,
} from '@/lib/content/types'

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

export async function fetchInstagramPosts(): Promise<InstagramPost[]> {
  const response = await fetch('/api/instagram-posts', {
    cache: 'no-store',
  })

  const payload = await parseResponse<{ posts: InstagramPost[] }>(response)
  return payload.posts
}

export async function createInstagramPostRequest(input: CreateInstagramPostInput): Promise<InstagramPost> {
  const response = await fetch('/api/instagram-posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  })

  const payload = await parseResponse<{ post: InstagramPost }>(response)
  return payload.post
}

export async function updateInstagramPostRequest(id: string, input: UpdateInstagramPostInput): Promise<InstagramPost> {
  const response = await fetch(`/api/instagram-posts/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  })

  const payload = await parseResponse<{ post: InstagramPost }>(response)
  return payload.post
}

export async function deleteInstagramPostRequest(id: string): Promise<void> {
  const response = await fetch(`/api/instagram-posts/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    const payload = await response.json().catch(() => null)
    const message = payload && typeof payload === 'object' && 'error' in payload
      ? String(payload.error)
      : 'Failed to delete post'

    throw new Error(message)
  }
}