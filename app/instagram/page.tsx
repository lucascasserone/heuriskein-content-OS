'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
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
import { useState } from 'react'

interface Post {
  id: number
  caption: string
  type: string
  status: string
  date: string
}

export default function InstagramManager() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      caption: 'Beautiful sunset over the mountains',
      type: 'Image',
      status: 'scheduled',
      date: '2024-04-15',
    },
    {
      id: 2,
      caption: 'Product launch announcement',
      type: 'Carousel',
      status: 'draft',
      date: '-',
    },
    {
      id: 3,
      caption: 'Monthly business update',
      type: 'Video',
      status: 'published',
      date: '2024-04-08',
    },
    {
      id: 4,
      caption: 'Team culture highlights',
      type: 'Reel',
      status: 'scheduled',
      date: '2024-04-16',
    },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    caption: '',
    type: 'Image',
    status: 'draft',
    date: '',
  })

  const postTypes = ['Image', 'Video', 'Carousel', 'Reel', 'Story']
  const statuses = ['draft', 'scheduled', 'backlog', 'published']

  const tabs = [
    {
      id: 'scheduled',
      label: 'Scheduled',
      icon: Calendar,
    },
    {
      id: 'drafts',
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
  ]

  const getTabCount = (tabId: string) => {
    return posts.filter((post) => post.status === tabId).length
  }

  const getTabPosts = (tabId: string) => {
    return posts.filter((post) => post.status === tabId)
  }

  const handleAddPost = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.caption.trim()) {
      alert('Please enter a caption')
      return
    }

    const newPost: Post = {
      id: Math.max(...posts.map((p) => p.id), 0) + 1,
      caption: formData.caption,
      type: formData.type,
      status: formData.status,
      date: formData.status === 'draft' || formData.status === 'backlog' ? '-' : formData.date,
    }

    setPosts([...posts, newPost])
    setFormData({ caption: '', type: 'Image', status: 'draft', date: '' })
    setIsModalOpen(false)
  }

  const handleDeletePost = (id: number) => {
    setPosts(posts.filter((post) => post.id !== id))
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
            <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4" />
              New Post
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Post</DialogTitle>
              <DialogDescription>
                Add a new Instagram post to your content library
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddPost} className="space-y-4">
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
                    setFormData((prev) => ({ ...prev, type: e.target.value }))
                  }
                  className="w-full rounded-lg border border-border bg-card px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {postTypes.map((type) => (
                    <option key={type} value={type} className="bg-card text-foreground">
                      {type}
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
                    setFormData((prev) => ({ ...prev, status: e.target.value }))
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
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Create Post
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
            {getTabPosts(tab.id).length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-muted-foreground">No posts yet in this section</p>
                  <Button
                    onClick={() => setIsModalOpen(true)}
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
                              {post.type}
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
                          <p className="text-sm font-medium text-foreground">{post.date}</p>
                          <div className="mt-3 flex gap-2">
                            <button className="px-3 py-1 rounded text-sm bg-primary/20 hover:bg-primary/30 text-primary-foreground">
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
            <div className="text-2xl font-bold">4.2%</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Best Performer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.8K</div>
            <p className="text-xs text-muted-foreground">Likes on top post</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
