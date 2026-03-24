'use client'

import { useEffect, useState } from 'react'

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
import { Plus, Calendar, FileText, CheckCircle, Archive } from 'lucide-react'
import { InstagramPost, InstagramPostStatus, InstagramPostType } from '@/lib/content/types'
import {
  createInstagramPostRequest,
  deleteInstagramPostRequest,
  fetchInstagramPosts,
  updateInstagramPostRequest,
} from '@/lib/instagram/api'

type PostFormState = {
  caption: string
  type: InstagramPostType
  status: InstagramPostStatus
  date: string
}

const emptyFormState: PostFormState = {
  caption: '',
  type: 'image',
  status: 'draft',
  date: '',
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
  const [formData, setFormData] = useState<PostFormState>(emptyFormState)
  const [editingPostId, setEditingPostId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

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
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to save post')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeletePost = async (id: string) => {
    try {
      setErrorMessage(null)
      await deleteInstagramPostRequest(id)
      setPosts((currentPosts) => currentPosts.filter((post) => post.id !== id))
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to delete post')
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
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4" />
              New Post
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
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

              {/* Caption */}
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

              {/* Post Type */}
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

              {/* Status */}
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
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-foreground">{formatPostDate(post)}</p>
                          <div className="mt-3 flex gap-2">
                            <button
                              onClick={() => openEditDialog(post)}
                              className="px-3 py-1 rounded text-sm bg-primary/20 hover:bg-primary/30 text-primary-foreground"
                            >
                              Edit
                            </button>
                            <button className="px-3 py-1 rounded text-sm bg-muted hover:bg-muted/80 text-foreground">
                              Preview
                            </button>
                            <button
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
