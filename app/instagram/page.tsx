'use client'

import { useEffect, useState } from 'react'
import * as XLSX from 'xlsx'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/Dialog'
import { Plus, Calendar, FileText, CheckCircle, Archive, Upload, Eye, Download, Send, Link2, Unplug } from 'lucide-react'
import { InstagramPost, InstagramPostStatus, InstagramPostType } from '@/lib/content/types'
import {
  createInstagramPostRequest,
  deleteInstagramPostRequest,
  fetchInstagramPosts,
  updateInstagramPostRequest,
} from '@/lib/instagram/api'
import {
  connectInstagramAccount,
  disconnectSocialPlatform,
  fetchSocialConnections,
  publishPostToSocial,
} from '@/lib/social/api'
import { SocialConnection } from '@/lib/social/types'

type PostFormState = {
  caption: string
  link: string
  attachments: string
  tags: string
  type: InstagramPostType
  status: InstagramPostStatus
  date: string
}

const emptyFormState: PostFormState = {
  caption: '',
  link: '',
  attachments: '',
  tags: '',
  type: 'image',
  status: 'draft',
  date: '',
}

function parseCsvValues(raw: string): string[] {
  return raw
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
}

function normalizeRowStatus(value: unknown): InstagramPostStatus {
  const raw = String(value ?? '').trim().toLowerCase()
  if (raw === 'scheduled' || raw === 'draft' || raw === 'published' || raw === 'backlog') {
    return raw
  }

  return 'draft'
}

function normalizeRowType(value: unknown): InstagramPostType {
  const raw = String(value ?? '').trim().toLowerCase()
  if (raw === 'image' || raw === 'video' || raw === 'carousel' || raw === 'reel' || raw === 'story') {
    return raw
  }

  return 'image'
}

function toDateInputValue(value: string | null): string {
  return value ? value.slice(0, 10) : ''
}

function formatPostType(value: InstagramPostType): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function formatPostDate(post: InstagramPost): string {
  const relevantDate = post.scheduledFor ?? post.publishedAt
  if (!relevantDate) {
    return '-'
  }

  return new Date(relevantDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function InstagramManager() {
  const [posts, setPosts] = useState<InstagramPost[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [previewPost, setPreviewPost] = useState<InstagramPost | null>(null)
  const [formData, setFormData] = useState<PostFormState>(emptyFormState)
  const [editingPostId, setEditingPostId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [connection, setConnection] = useState<SocialConnection | null>(null)
  const [connectionUserId, setConnectionUserId] = useState('')
  const [connectionToken, setConnectionToken] = useState('')
  const [isConnecting, setIsConnecting] = useState(false)
  const [publishingPostId, setPublishingPostId] = useState<string | null>(null)

  const postTypes: InstagramPostType[] = ['image', 'video', 'carousel', 'reel', 'story']
  const statuses: InstagramPostStatus[] = ['draft', 'scheduled', 'backlog', 'published']

  const tabs = [
    {
      id: 'scheduled',
      label: 'Scheduled',
      icon: Calendar,
    },
    {
      id: 'draft',
      label: 'Drafts',
      icon: FileText,
    },
    {
      id: 'published',
      label: 'Published',
      icon: CheckCircle,
    },
    {
      id: 'backlog',
      label: 'Backlog',
      icon: Archive,
    },
  ] as const

  useEffect(() => {
    let active = true

    async function loadPosts() {
      try {
        const nextPosts = await fetchInstagramPosts()
        if (active) {
          setPosts(nextPosts)
          setErrorMessage(null)
        }
      } catch (error) {
        if (active) {
          setErrorMessage(error instanceof Error ? error.message : 'Failed to load posts')
        }
      } finally {
        if (active) {
          setIsLoading(false)
        }
      }
    }

    loadPosts()

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    let active = true

    async function loadConnections() {
      try {
        const connections = await fetchSocialConnections()
        const instagramConnection = connections.find((item) => item.platform === 'instagram') ?? null

        if (active) {
          setConnection(instagramConnection)
        }
      } catch (error) {
        if (active) {
          setErrorMessage(error instanceof Error ? error.message : 'Failed to load social connections')
        }
      }
    }

    void loadConnections()

    return () => {
      active = false
    }
  }, [])

  const resetForm = () => {
    setFormData(emptyFormState)
    setEditingPostId(null)
  }

  const openCreateDialog = () => {
    resetForm()
    setErrorMessage(null)
    setIsModalOpen(true)
  }

  const openEditDialog = (post: InstagramPost) => {
    setEditingPostId(post.id)
    setFormData({
      caption: post.caption,
      link: post.link ?? '',
      attachments: (post.attachments ?? []).join(', '),
      tags: (post.tags ?? []).join(', '),
      type: post.postType,
      status: post.status,
      date: toDateInputValue(post.scheduledFor ?? post.publishedAt),
    })
    setErrorMessage(null)
    setIsModalOpen(true)
  }

  const getTabCount = (tabId: string) => {
    return posts.filter((post) => post.status === tabId).length
  }

  const getTabPosts = (tabId: string) => {
    return posts.filter((post) => post.status === tabId)
  }

  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.caption.trim()) {
      setErrorMessage('Please enter a caption')
      return
    }

    try {
      setIsSaving(true)
      setErrorMessage(null)

      const payload = {
        caption: formData.caption.trim(),
        link: formData.link.trim() || null,
        attachments: parseCsvValues(formData.attachments),
        tags: parseCsvValues(formData.tags),
        postType: formData.type,
        status: formData.status,
        scheduledFor: formData.status === 'scheduled' && formData.date ? formData.date : null,
      }

      const savedPost = editingPostId
        ? await updateInstagramPostRequest(editingPostId, payload)
        : await createInstagramPostRequest(payload)

      setPosts((currentPosts) => {
        if (editingPostId) {
          return currentPosts.map((post) => (post.id === editingPostId ? savedPost : post))
        }

        return [savedPost, ...currentPosts]
      })

      resetForm()
      setIsModalOpen(false)
      setSuccessMessage(editingPostId ? 'Post updated successfully.' : 'Post created successfully.')
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to save post')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeletePost = async (id: string) => {
    const post = posts.find((item) => item.id === id)
    const confirmed = window.confirm(`Delete post \"${post?.title ?? 'Untitled'}\"? This action cannot be undone.`)
    if (!confirmed) {
      return
    }

    try {
      setErrorMessage(null)
      await deleteInstagramPostRequest(id)
      setPosts((currentPosts) => currentPosts.filter((post) => post.id !== id))
      setSuccessMessage('Post deleted successfully.')
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to delete post')
    }
  }

  const handlePreviewPost = (post: InstagramPost) => {
    setPreviewPost(post)
    setIsPreviewOpen(true)
  }

  const handleImportPosts = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    try {
      setIsSaving(true)
      setErrorMessage(null)

      const buffer = await file.arrayBuffer()
      const workbook = XLSX.read(buffer, { type: 'array' })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, { defval: '' })

      let importedCount = 0
      for (const row of rows) {
        const caption = String(row.caption ?? row.Caption ?? '').trim()
        if (!caption) {
          continue
        }

        const payload = {
          caption,
          postType: normalizeRowType(row.postType ?? row.type ?? row.Type),
          status: normalizeRowStatus(row.status ?? row.Status),
          scheduledFor: String(row.scheduledFor ?? row.date ?? row.Date ?? '').trim() || null,
          link: String(row.link ?? row.Link ?? '').trim() || null,
          attachments: parseCsvValues(String(row.attachments ?? row.Attachments ?? '')),
          tags: parseCsvValues(String(row.tags ?? row.Tags ?? '')),
        }

        const created = await createInstagramPostRequest(payload)
        setPosts((current) => [created, ...current])
        importedCount += 1
      }

      setErrorMessage(importedCount > 0 ? null : 'No valid rows found to import.')
      setSuccessMessage(importedCount > 0 ? `${importedCount} post(s) imported successfully.` : null)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to import posts')
    } finally {
      setIsSaving(false)
      event.target.value = ''
    }
  }

  const handleConnectInstagram = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!connectionUserId.trim() || !connectionToken.trim()) {
      setErrorMessage('Instagram User ID and access token are required.')
      return
    }

    try {
      setIsConnecting(true)
      const nextConnection = await connectInstagramAccount({
        instagramUserId: connectionUserId.trim(),
        accessToken: connectionToken.trim(),
      })

      setConnection(nextConnection)
      setConnectionToken('')
      setErrorMessage(null)
      setSuccessMessage('Instagram connection configured successfully.')
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to connect Instagram account')
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnectInstagram = async () => {
    try {
      setIsConnecting(true)
      await disconnectSocialPlatform('instagram')
      setConnection((current) => (current ? { ...current, isConnected: false, instagramUserId: null } : null))
      setErrorMessage(null)
      setSuccessMessage('Instagram connection disconnected.')
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to disconnect Instagram account')
    } finally {
      setIsConnecting(false)
    }
  }

  const handlePublishPost = async (postId: string) => {
    try {
      setPublishingPostId(postId)
      const result = await publishPostToSocial(postId, 'instagram')

      setPosts((currentPosts) =>
        currentPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                status: 'published',
                publishedAt: result.publishedAt,
                scheduledFor: null,
              }
            : post
        )
      )

      setErrorMessage(null)
      setSuccessMessage(result.message)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to publish post')
    } finally {
      setPublishingPostId(null)
    }
  }

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">Instagram Manager</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your Instagram content, schedules, and drafts
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/templates/instagram-posts-import-template.csv"
            download
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium hover:bg-muted"
          >
            <Download className="h-4 w-4" />
            Download Template
          </a>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium hover:bg-muted">
            <Upload className="h-4 w-4" />
            Import Excel
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              className="hidden"
              onChange={handleImportPosts}
            />
          </label>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4" />
              New Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingPostId ? 'Edit Post' : 'Create New Post'}</DialogTitle>
              <DialogDescription>
                {editingPostId ? 'Update an existing Instagram post in your content library' : 'Add a new Instagram post to your content library'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddPost} className="space-y-4">
              {errorMessage && (
                <div className="rounded-lg border border-red-500/30 bg-red-950/40 px-4 py-3 text-sm text-red-200">
                  {errorMessage}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Caption
                </label>
                <textarea
                  value={formData.caption}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, caption: e.target.value }))
                  }
                  placeholder="Write your post caption here..."
                  className="w-full rounded-lg border border-border bg-card px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  rows={3}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Post Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, type: e.target.value as InstagramPostType }))
                    }
                    className="w-full rounded-lg border border-border bg-card px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {postTypes.map((type) => (
                      <option key={type} value={type} className="bg-card text-foreground">
                        {formatPostType(type)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, status: e.target.value as InstagramPostStatus }))
                    }
                    className="w-full rounded-lg border border-border bg-card px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status} className="bg-card text-foreground">
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  External Link
                </label>
                <input
                  type="url"
                  value={formData.link}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, link: e.target.value }))
                  }
                  placeholder="https://example.com"
                  className="w-full rounded-lg border border-border bg-card px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Attachments (comma separated URLs)
                </label>
                <input
                  value={formData.attachments}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, attachments: e.target.value }))
                  }
                  placeholder="https://cdn.site/file1.jpg, https://cdn.site/file2.pdf"
                  className="w-full rounded-lg border border-border bg-card px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Tags (comma separated)
                </label>
                <input
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, tags: e.target.value }))
                  }
                  placeholder="campaign, launch, q2"
                  className="w-full rounded-lg border border-border bg-card px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Scheduled Date */}
              {formData.status === 'scheduled' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Scheduled Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, date: e.target.value }))
                    }
                    className="w-full rounded-lg border border-border bg-card px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required={formData.status === 'scheduled'}
                  />
                </div>
              )}

              {/* Form Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setIsModalOpen(false)
                    resetForm()
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isSaving ? 'Saving...' : editingPostId ? 'Save Changes' : 'Create Post'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      {errorMessage && (
        <div className="rounded-lg border border-red-500/30 bg-red-950/40 px-4 py-3 text-sm text-red-200">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/40 px-4 py-3 text-sm text-emerald-200">
          {successMessage}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Link2 className="h-4 w-4" />
            Social Connection and Direct Publishing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="text-muted-foreground">Status:</span>
            <span
              className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${
                connection?.isConnected
                  ? 'bg-emerald-900/30 text-emerald-200'
                  : 'bg-yellow-900/30 text-yellow-200'
              }`}
            >
              {connection?.isConnected ? 'Connected' : 'Not connected'}
            </span>
            {connection?.instagramUserId && (
              <span className="text-xs text-muted-foreground">User ID: {connection.instagramUserId}</span>
            )}
            {connection?.mode && (
              <span className="text-xs text-muted-foreground">Publish mode: {connection.mode}</span>
            )}
          </div>

          <form onSubmit={handleConnectInstagram} className="grid gap-3 md:grid-cols-3">
            <input
              value={connectionUserId}
              onChange={(event) => setConnectionUserId(event.target.value)}
              placeholder="Instagram User ID"
              className="w-full rounded-lg border border-border bg-card px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="password"
              value={connectionToken}
              onChange={(event) => setConnectionToken(event.target.value)}
              placeholder="Access Token"
              className="w-full rounded-lg border border-border bg-card px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="flex gap-2">
              <Button type="submit" disabled={isConnecting} className="flex-1">
                {isConnecting ? 'Connecting...' : 'Connect'}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={isConnecting || !connection?.isConnected}
                onClick={() => void handleDisconnectInstagram()}
                className="gap-1"
              >
                <Unplug className="h-3.5 w-3.5" />
                Disconnect
              </Button>
            </div>
          </form>
          <p className="text-xs text-muted-foreground">
            To publish directly via Instagram Graph API, set SOCIAL_PUBLISH_MODE=api and configure a valid Instagram User ID + Access Token.
          </p>
        </CardContent>
      </Card>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Post Preview</DialogTitle>
            <DialogDescription>Visual preview of selected Instagram post.</DialogDescription>
          </DialogHeader>

          {previewPost && (
            <div className="space-y-3 rounded-lg border border-border bg-card p-4">
              <p className="text-sm font-semibold text-foreground">{previewPost.title}</p>
              <p className="whitespace-pre-wrap text-sm text-foreground">{previewPost.caption}</p>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">{previewPost.postType}</span>
                <span className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">{previewPost.status}</span>
              </div>
              {previewPost.link && (
                <a href={previewPost.link} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline">
                  {previewPost.link}
                </a>
              )}
              {Boolean(previewPost.tags?.length) && (
                <div className="flex flex-wrap gap-1">
                  {(previewPost.tags ?? []).map((tag) => (
                    <span key={`${previewPost.id}-preview-${tag}`} className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Tabs */}
      <Tabs defaultValue="scheduled" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-4">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="ml-1 inline-flex items-center justify-center rounded-full bg-muted px-2 py-1 text-xs font-medium">
                  {getTabCount(tab.id)}
                </span>
              </TabsTrigger>
            )
          })}
        </TabsList>

        {/* Tab Contents */}
        {tabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="space-y-4">
            {isLoading ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  Loading posts...
                </CardContent>
              </Card>
            ) : getTabPosts(tab.id).length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-muted-foreground">No posts yet in this section</p>
                  <Button
                    onClick={openCreateDialog}
                    className="mt-4 gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Plus className="h-4 w-4" />
                    Create First Post
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {getTabPosts(tab.id).map((post) => (
                  <Card key={post.id} className="hover:border-primary/50 transition-colors">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-2 flex-1">
                          <h3 className="font-semibold text-foreground">{post.caption}</h3>
                          <div className="flex flex-wrap gap-2">
                            <span className="inline-flex items-center rounded-full bg-blue-900/30 px-3 py-1 text-sm font-medium text-blue-200">
                              {formatPostType(post.postType)}
                            </span>
                            <span
                              className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                                post.status === 'scheduled'
                                  ? 'bg-green-900/30 text-green-200'
                                  : post.status === 'published'
                                    ? 'bg-emerald-900/30 text-emerald-200'
                                    : post.status === 'draft'
                                      ? 'bg-yellow-900/30 text-yellow-200'
                                      : 'bg-gray-700/30 text-gray-300'
                              }`}
                            >
                              {post.status}
                            </span>
                          </div>
                          {post.link && (
                            <a
                              href={post.link}
                              target="_blank"
                              rel="noreferrer"
                              className="block text-xs text-primary underline-offset-4 hover:underline"
                            >
                              Open linked URL
                            </a>
                          )}
                          {Boolean(post.tags?.length) && (
                            <div className="flex flex-wrap gap-1">
                              {(post.tags ?? []).slice(0, 5).map((tag) => (
                                <span key={`${post.id}-${tag}`} className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                          {Boolean(post.attachments?.length) && (
                            <p className="text-xs text-muted-foreground">
                              Attachments: {post.attachments?.length}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-foreground">{formatPostDate(post)}</p>
                          <div className="mt-3 flex gap-2">
                            {post.status !== 'published' && (
                              <button
                                type="button"
                                disabled={!connection?.isConnected || publishingPostId === post.id}
                                onClick={() => void handlePublishPost(post.id)}
                                className="inline-flex items-center gap-1 rounded px-3 py-1 text-sm bg-emerald-900/20 hover:bg-emerald-900/40 text-emerald-200 disabled:opacity-60"
                              >
                                <Send className="h-3.5 w-3.5" />
                                {publishingPostId === post.id ? 'Publishing...' : 'Publish Now'}
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => openEditDialog(post)}
                              className="px-3 py-1 rounded text-sm bg-primary/20 hover:bg-primary/30 text-primary-foreground"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handlePreviewPost(post)}
                              className="inline-flex items-center gap-1 px-3 py-1 rounded text-sm bg-muted hover:bg-muted/80 text-foreground"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              Preview
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeletePost(post.id)}
                              className="px-2 py-1 rounded text-sm bg-red-900/20 hover:bg-red-900/40 text-red-200"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Stats Footer */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{posts.length}</div>
            <p className="text-xs text-muted-foreground">Across all categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Avg. Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {posts.length > 0
                ? `${(posts.reduce((total, post) => total + post.metrics.engagementRate, 0) / posts.length).toFixed(1)}%`
                : '0.0%'}
            </div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Best Performer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {posts.length > 0
                ? `${Math.max(...posts.map((post) => post.metrics.likes)).toLocaleString()}`
                : '0'}
            </div>
            <p className="text-xs text-muted-foreground">Likes on top post</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
