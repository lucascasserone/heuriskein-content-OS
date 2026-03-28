'use client'

import { useEffect, useState } from 'react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { Button } from '@/components/ui/Button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { fetchInstagramPosts, updateInstagramPostRequest } from '@/lib/instagram/api'
import { InstagramPost, InstagramPostStatus, InstagramPostType } from '@/lib/content/types'

type CalendarFilter = 'all' | 'scheduled' | 'draft' | 'published'

const statusColors: Record<InstagramPostStatus, string> = {
  draft: 'bg-yellow-900/60 text-yellow-100',
  scheduled: 'bg-green-900/60 text-green-100',
  published: 'bg-emerald-900/60 text-emerald-100',
  backlog: 'bg-slate-700 text-slate-100',
}

function getPostDate(post: InstagramPost): Date | null {
  const value = post.scheduledFor ?? post.publishedAt
  return value ? new Date(value) : null
}

function formatCalendarDate(value: string): string {
  return new Date(value).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function ContentCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [activeFilter, setActiveFilter] = useState<CalendarFilter>('all')
  const [posts, setPosts] = useState<InstagramPost[]>([])
  const [selectedPost, setSelectedPost] = useState<InstagramPost | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formCaption, setFormCaption] = useState('')
  const [formStatus, setFormStatus] = useState<InstagramPostStatus>('draft')
  const [formType, setFormType] = useState<InstagramPostType>('image')
  const [formDate, setFormDate] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const postTypes: InstagramPostType[] = ['image', 'video', 'carousel', 'reel', 'story']
  const statuses: InstagramPostStatus[] = ['draft', 'scheduled', 'backlog', 'published']

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
          setErrorMessage(error instanceof Error ? error.message : 'Failed to load calendar posts')
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

  const openEditDialog = (post: InstagramPost) => {
    setSelectedPost(post)
    setFormCaption(post.caption)
    setFormStatus(post.status)
    setFormType(post.postType)
    setFormDate((post.scheduledFor ?? post.publishedAt ?? '').slice(0, 10))
    setIsDialogOpen(true)
  }

  const handleSavePost = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!selectedPost) {
      return
    }

    try {
      setIsSaving(true)
      const updatedPost = await updateInstagramPostRequest(selectedPost.id, {
        caption: formCaption.trim(),
        postType: formType,
        status: formStatus,
        scheduledFor: formStatus === 'scheduled' && formDate ? formDate : null,
      })

      setPosts((current) => current.map((post) => (post.id === updatedPost.id ? updatedPost : post)))
      setIsDialogOpen(false)
      setSelectedPost(null)
      setErrorMessage(null)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to update post')
    } finally {
      setIsSaving(false)
    }
  }

  const filteredPosts = activeFilter === 'all'
    ? posts
    : posts.filter((post) => post.status === activeFilter)

  const visibleMonthPosts = filteredPosts.filter((post) => {
    const postDate = getPostDate(post)
    return Boolean(
      postDate &&
      postDate.getMonth() === currentMonth.getMonth() &&
      postDate.getFullYear() === currentMonth.getFullYear()
    )
  })

  const schedules: Record<number, InstagramPost[]> = {}
  for (const post of visibleMonthPosts) {
    const postDate = getPostDate(post)
    if (!postDate) {
      continue
    }

    const day = postDate.getDate()
    schedules[day] = [...(schedules[day] ?? []), post]
  }

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()
  const calendarDays: Array<number | null> = []

  for (let index = 0; index < firstDayOfMonth; index += 1) {
    calendarDays.push(null)
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    calendarDays.push(day)
  }

  const upcomingPosts = posts
    .filter((post) => post.status === 'scheduled' && post.scheduledFor)
    .sort((left, right) => (left.scheduledFor ?? '').localeCompare(right.scheduledFor ?? ''))
    .slice(0, 4)

  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="section-title">Content Calendar</h1>
        <p className="mt-2 text-muted-foreground">
          Visualize the posts coming from the Instagram content pipeline.
        </p>
      </div>

      {errorMessage && (
        <div className="rounded-lg border border-red-500/30 bg-red-950/40 px-4 py-3 text-sm text-red-200">
          {errorMessage}
        </div>
      )}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
            className="rounded-lg border border-border p-2 hover:bg-muted"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h2 className="subsection-title min-w-40 text-center">{monthName}</h2>
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
            className="rounded-lg border border-border p-2 hover:bg-muted"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <Tabs value={activeFilter} onValueChange={(value) => setActiveFilter(value as CalendarFilter)} className="w-full max-w-md">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
            <TabsTrigger value="scheduled" className="text-xs">Scheduled</TabsTrigger>
            <TabsTrigger value="draft" className="text-xs">Drafts</TabsTrigger>
            <TabsTrigger value="published" className="text-xs">Published</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Card>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="py-16 text-center text-muted-foreground">Loading calendar...</div>
          ) : (
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((day) => (
                <div key={day} className="p-2 text-center text-sm font-semibold text-muted-foreground">
                  {day}
                </div>
              ))}

              {calendarDays.map((day, index) => (
                <div
                  key={`${day ?? 'empty'}-${index}`}
                  className={`min-h-28 rounded-lg border border-border p-2 ${day ? 'bg-card' : 'bg-muted/30'}`}
                >
                  {day && (
                    <>
                      <p className="mb-2 text-sm font-semibold text-foreground">{day}</p>
                      <div className="space-y-1">
                        {(schedules[day] ?? []).slice(0, 3).map((post) => (
                          <div
                            key={post.id}
                            className={`cursor-pointer rounded px-2 py-1 text-xs font-medium ${statusColors[post.status]}`}
                            onClick={() => openEditDialog(post)}
                          >
                            {post.title}
                          </div>
                        ))}

                        {(schedules[day] ?? []).length > 3 && (
                          <p className="px-1 text-xs text-muted-foreground">
                            +{(schedules[day] ?? []).length - 3} more
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{posts.filter((post) => post.status === 'scheduled').length}</p>
            <p className="text-xs text-muted-foreground">Posts ready to publish</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{posts.filter((post) => post.status === 'draft').length}</p>
            <p className="text-xs text-muted-foreground">Posts needing review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{posts.filter((post) => post.status === 'published').length}</p>
            <p className="text-xs text-muted-foreground">Posts already live</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Posts</CardTitle>
          <CardDescription>Next scheduled Instagram posts from the shared content pipeline</CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingPosts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No scheduled posts yet.</p>
          ) : (
            <div className="space-y-3">
              {upcomingPosts.map((post) => (
                <div key={post.id} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">{post.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {post.scheduledFor ? formatCalendarDate(post.scheduledFor) : 'No date'} • Instagram
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusColors[post.status]}`}>
                      {post.status}
                    </span>
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(post)}>
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Calendar Post</DialogTitle>
            <DialogDescription>Update caption, type, status and schedule directly from calendar.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSavePost} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Caption</label>
              <textarea
                value={formCaption}
                onChange={(event) => setFormCaption(event.target.value)}
                rows={3}
                className="w-full rounded-lg border border-border bg-card px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Post Type</label>
              <select
                value={formType}
                onChange={(event) => setFormType(event.target.value as InstagramPostType)}
                className="w-full rounded-lg border border-border bg-card px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {postTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Status</label>
              <select
                value={formStatus}
                onChange={(event) => setFormStatus(event.target.value as InstagramPostStatus)}
                className="w-full rounded-lg border border-border bg-card px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            {formStatus === 'scheduled' && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Scheduled Date</label>
                <input
                  type="date"
                  value={formDate}
                  onChange={(event) => setFormDate(event.target.value)}
                  className="w-full rounded-lg border border-border bg-card px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
