'use client'

import { useEffect, useState } from 'react'

import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Calendar } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { fetchAnalyticsSnapshot } from '@/lib/analytics/api'
import { AnalyticsSnapshot } from '@/lib/analytics/repository'

export default function Analytics() {
  const [snapshot, setSnapshot] = useState<AnalyticsSnapshot | null>(null)
  const [isAutoRefreshEnabled, setIsAutoRefreshEnabled] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function loadAnalytics() {
      try {
        const nextSnapshot = await fetchAnalyticsSnapshot()
        if (active) {
          setSnapshot(nextSnapshot)
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

    loadAnalytics()

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (!isAutoRefreshEnabled) {
      return
    }

    const intervalId = window.setInterval(() => {
      void fetchAnalyticsSnapshot()
        .then((nextSnapshot) => {
          setSnapshot(nextSnapshot)
          setErrorMessage(null)
        })
        .catch((error) => {
          setErrorMessage(error instanceof Error ? error.message : 'Failed to refresh analytics data')
        })
    }, 60_000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [isAutoRefreshEnabled])

  const impressionsData = snapshot?.trends.map((point) => ({
    date: point.date,
    impressions: point.impressions,
  })) ?? []

  const engagementData = snapshot?.trends.map((point) => ({
    date: point.date,
    engagement: point.engagement,
  })) ?? []

  const contentTypeData = snapshot?.contentTypes ?? []
  const topPostsData = snapshot?.topPosts ?? []
  const totalImpressions = snapshot?.summary.totalImpressions ?? 0
  const averageEngagement = snapshot?.summary.averageEngagement ?? 0
  const totalReach = snapshot?.summary.totalReach ?? 0
  const scheduledPosts = snapshot?.summary.scheduledPosts ?? 0

  return (
    <div className="space-y-8 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">Analytics Dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Performance metrics derived directly from the Instagram content data model.
          </p>
          {snapshot?.generatedAt && (
            <p className="mt-1 text-xs text-muted-foreground">
              Last backend snapshot: {new Date(snapshot.generatedAt).toLocaleString()}
            </p>
          )}
        </div>
        <button
          onClick={() => setIsAutoRefreshEnabled((current) => !current)}
          className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          <Calendar className="h-4 w-4" />
          {isAutoRefreshEnabled ? 'Auto refresh: On' : 'Auto refresh: Off'}
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
                    <span className="text-sm font-bold text-primary">{post.likes.toLocaleString()}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-primary"
                      style={{
                        width: `${topPostsData.length > 0 ? (post.likes / Math.max(...topPostsData.map((item) => item.likes || 1))) * 100 : 0}%`,
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
