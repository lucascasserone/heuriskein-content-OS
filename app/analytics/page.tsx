'use client'

import { useEffect, useState } from 'react'

import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Calendar } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { InstagramPost, InstagramPostType } from '@/lib/content/types'
import { fetchInstagramPosts } from '@/lib/instagram/api'

const typeColors: Record<InstagramPostType, string> = {
  image: '#60A5FA',
  video: '#F97316',
  carousel: '#A78BFA',
  reel: '#34D399',
  story: '#FACC15',
}

function getPostDateLabel(post: InstagramPost): string {
  const value = post.publishedAt ?? post.scheduledFor ?? post.createdAt
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

function formatTypeLabel(type: InstagramPostType): string {
  return type.charAt(0).toUpperCase() + type.slice(1)
}

export default function Analytics() {
  const [posts, setPosts] = useState<InstagramPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

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
          setErrorMessage(error instanceof Error ? error.message : 'Failed to load analytics data')
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

  const datedPosts = [...posts].sort((left, right) => {
    const leftDate = left.publishedAt ?? left.scheduledFor ?? left.createdAt
    const rightDate = right.publishedAt ?? right.scheduledFor ?? right.createdAt
    return leftDate.localeCompare(rightDate)
  })

  const impressionsData = datedPosts.map((post) => ({
    date: getPostDateLabel(post),
    impressions: post.metrics.impressions,
  }))

  const engagementData = datedPosts.map((post) => ({
    date: getPostDateLabel(post),
    engagement: post.metrics.engagementRate,
  }))

  const contentTypeData = (['image', 'video', 'carousel', 'reel', 'story'] as InstagramPostType[])
    .map((type) => ({
      name: formatTypeLabel(type),
      value: posts.filter((post) => post.postType === type).length,
      color: typeColors[type],
    }))
    .filter((entry) => entry.value > 0)

  const topPostsData = [...posts]
    .sort((left, right) => right.metrics.likes - left.metrics.likes)
    .slice(0, 4)

  const totalImpressions = posts.reduce((total, post) => total + post.metrics.impressions, 0)
  const averageEngagement = posts.length > 0
    ? posts.reduce((total, post) => total + post.metrics.engagementRate, 0) / posts.length
    : 0
  const totalReach = posts.reduce((total, post) => total + post.metrics.reach, 0)
  const scheduledPosts = posts.filter((post) => post.status === 'scheduled').length

  return (
    <div className="space-y-8 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">Analytics Dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Performance metrics derived directly from the Instagram content data model.
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-muted">
          <Calendar className="h-4 w-4" />
          Shared Content Metrics
        </button>
      </div>

      {errorMessage && (
        <div className="rounded-lg border border-red-500/30 bg-red-950/40 px-4 py-3 text-sm text-red-200">
          {errorMessage}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Impressions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalImpressions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all Instagram posts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Avg. Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageEngagement.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Average engagement rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Scheduled Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scheduledPosts}</div>
            <p className="text-xs text-muted-foreground">Posts in the publishing queue</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReach.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Measured from post metrics</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Impressions Trend</CardTitle>
            <CardDescription>Impressions pulled from the shared Instagram posts</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-16 text-center text-muted-foreground">Loading analytics...</div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={impressionsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.5rem',
                    }}
                  />
                  <Bar dataKey="impressions" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Engagement Rate</CardTitle>
            <CardDescription>Engagement rate per post</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-16 text-center text-muted-foreground">Loading analytics...</div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.5rem',
                    }}
                  />
                  <Line type="monotone" dataKey="engagement" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: 'hsl(var(--primary))' }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content Type Distribution</CardTitle>
            <CardDescription>How the Instagram pipeline is split by format</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-16 text-center text-muted-foreground">Loading analytics...</div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={contentTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}`}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {contentTypeData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.5rem',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performing Posts</CardTitle>
            <CardDescription>Ranking based on likes from the shared post metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPostsData.map((post) => (
                <div key={post.id} className="space-y-2 border-b border-border pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-medium text-sm">{post.title}</span>
                    <span className="text-sm font-bold text-primary">{post.metrics.likes.toLocaleString()}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-primary"
                      style={{
                        width: `${topPostsData.length > 0 ? (post.metrics.likes / Math.max(...topPostsData.map((item) => item.metrics.likes || 1))) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              ))}

              {!isLoading && topPostsData.length === 0 && (
                <p className="text-sm text-muted-foreground">No performance data available yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
