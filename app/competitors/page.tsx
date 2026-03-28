'use client'

import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { TrendingDown, TrendingUp, RefreshCw } from 'lucide-react'
import {
  Competitor,
  CompetitorHistoryPoint,
  CreateCompetitorInput,
  IndustryBenchmark,
  UpdateCompetitorInput,
} from '@/lib/content/types'
import {
  createCompetitorRequest,
  deleteCompetitorRequest,
  fetchCompetitorHistory,
  fetchCompetitors,
  fetchIndustryBenchmarks,
  refreshInstagramIndicatorsRequest,
  updateCompetitorRequest,
} from '@/lib/competitors/api'

type FormState = {
  name: string
  handle: string
  platform: 'instagram' | 'tiktok' | 'youtube' | 'linkedin'
  followers: string
  followerGrowthRate: string
  monthlyFollowerChange: string
  avgEngagementRate: string
  avgEngagementCount: string
  totalPosts: string
  avgPostsPerWeek: string
  responseTime: string
  topPostEngage: string
  topPostCaption: string
}

const emptyFormState: FormState = {
  name: '',
  handle: '',
  platform: 'instagram',
  followers: '0',
  followerGrowthRate: '0',
  monthlyFollowerChange: '0',
  avgEngagementRate: '0',
  avgEngagementCount: '0',
  totalPosts: '0',
  avgPostsPerWeek: '0',
  responseTime: '0',
  topPostEngage: '0',
  topPostCaption: '',
}

function toFormState(competitor: Competitor): FormState {
  return {
    name: competitor.name,
    handle: competitor.handle,
    platform: competitor.platform,
    followers: String(competitor.metrics.followers),
    followerGrowthRate: String(competitor.metrics.followerGrowthRate),
    monthlyFollowerChange: String(competitor.metrics.monthlyFollowerChange),
    avgEngagementRate: String(competitor.metrics.avgEngagementRate),
    avgEngagementCount: String(competitor.metrics.avgEngagementCount),
    totalPosts: String(competitor.metrics.totalPosts),
    avgPostsPerWeek: String(competitor.metrics.avgPostsPerWeek),
    responseTime: String(competitor.metrics.responseTime),
    topPostEngage: String(competitor.metrics.topPostEngage),
    topPostCaption: competitor.metrics.topPostCaption,
  }
}

function parseInteger(value: string): number {
  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) ? parsed : 0
}

function parseFloatSafe(value: string): number {
  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function buildCreatePayload(form: FormState): CreateCompetitorInput {
  return {
    name: form.name.trim(),
    handle: form.handle.trim(),
    platform: form.platform,
    metrics: {
      followers: parseInteger(form.followers),
      followerGrowthRate: parseFloatSafe(form.followerGrowthRate),
      monthlyFollowerChange: parseInteger(form.monthlyFollowerChange),
      avgEngagementRate: parseFloatSafe(form.avgEngagementRate),
      avgEngagementCount: parseInteger(form.avgEngagementCount),
      totalPosts: parseInteger(form.totalPosts),
      avgPostsPerWeek: parseFloatSafe(form.avgPostsPerWeek),
      responseTime: parseFloatSafe(form.responseTime),
      topPostEngage: parseInteger(form.topPostEngage),
      topPostCaption: form.topPostCaption.trim(),
    },
  }
}

function buildUpdatePayload(form: FormState): UpdateCompetitorInput {
  const createPayload = buildCreatePayload(form)
  return {
    name: createPayload.name,
    handle: createPayload.handle,
    platform: createPayload.platform,
    metrics: createPayload.metrics,
  }
}

export default function CompetitorTracker() {
  const AUTO_REFRESH_INTERVALS = [
    { label: '1 min', value: 60_000 },
    { label: '5 min', value: 300_000 },
    { label: '15 min', value: 900_000 },
  ] as const

  const [competitors, setCompetitors] = useState<Competitor[]>([])
  const [benchmarks, setBenchmarks] = useState<IndustryBenchmark | null>(null)
  const [history, setHistory] = useState<CompetitorHistoryPoint[]>([])
  const [selectedCompetitorId, setSelectedCompetitorId] = useState<string | null>(null)
  const [editingCompetitorId, setEditingCompetitorId] = useState<string | null>(null)
  const [formState, setFormState] = useState<FormState>(emptyFormState)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isRefreshingInstagram, setIsRefreshingInstagram] = useState(false)
  const [isAutoRefreshEnabled, setIsAutoRefreshEnabled] = useState(false)
  const [autoRefreshIntervalMs, setAutoRefreshIntervalMs] = useState<number>(300_000)
  const [isPageVisible, setIsPageVisible] = useState(true)
  const [isBrowserOnline, setIsBrowserOnline] = useState(true)
  const [lastInstagramRefreshAt, setLastInstagramRefreshAt] = useState<string | null>(null)
  const [lastAutoRefreshAt, setLastAutoRefreshAt] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'followers' | 'engagement' | 'growth'>('followers')

  const loadData = async () => {
    try {
      setIsLoading(true)
      const competitorsData = await fetchCompetitors()
      const benchmarksData = await fetchIndustryBenchmarks()
      setCompetitors(competitorsData)
      setBenchmarks(benchmarksData)
      setError(null)

      if (selectedCompetitorId) {
        const exists = competitorsData.some((competitor) => competitor.id === selectedCompetitorId)
        if (exists) {
          const historyData = await fetchCompetitorHistory(selectedCompetitorId, 30)
          setHistory(historyData)
        } else {
          setSelectedCompetitorId(null)
          setHistory([])
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setIsPageVisible(document.visibilityState === 'visible')
    setIsBrowserOnline(window.navigator.onLine)

    const handleVisibilityChange = () => {
      setIsPageVisible(document.visibilityState === 'visible')
    }

    const handleOnline = () => {
      setIsBrowserOnline(true)
    }

    const handleOffline = () => {
      setIsBrowserOnline(false)
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleSelectCompetitor = async (competitorId: string) => {
    try {
      setSelectedCompetitorId(competitorId)
      const historyData = await fetchCompetitorHistory(competitorId, 30)
      setHistory(historyData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load competitor history')
    }
  }

  const handleStartCreate = () => {
    setEditingCompetitorId(null)
    setFormState(emptyFormState)
  }

  const handleRefreshInstagramIndicators = async (source: 'manual' | 'auto' = 'manual') => {
    try {
      setIsRefreshingInstagram(true)
      const instagramIds = competitors
        .filter((competitor) => competitor.platform === 'instagram')
        .map((competitor) => competitor.id)

      const result = await refreshInstagramIndicatorsRequest(instagramIds)
      setLastInstagramRefreshAt(result.refreshedAt)
      if (source === 'auto') {
        setLastAutoRefreshAt(result.refreshedAt)
      }

      if (source === 'manual') {
        setSuccessMessage(
          result.updatedCount > 0
            ? `${result.updatedCount} Instagram competitor indicator(s) updated.`
            : 'No Instagram competitors found to refresh.',
        )
      }

      await loadData()
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh Instagram indicators')
      if (source === 'manual') {
        setSuccessMessage(null)
      }
    } finally {
      setIsRefreshingInstagram(false)
    }
  }

  useEffect(() => {
    if (!isAutoRefreshEnabled) {
      return
    }

    if (!isPageVisible || !isBrowserOnline) {
      return
    }

    const hasInstagramCompetitors = competitors.some((competitor) => competitor.platform === 'instagram')
    if (!hasInstagramCompetitors) {
      return
    }

    const intervalId = window.setInterval(() => {
      if (isLoading || isSaving || isRefreshingInstagram) {
        return
      }

      void handleRefreshInstagramIndicators('auto')
    }, autoRefreshIntervalMs)

    return () => {
      window.clearInterval(intervalId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isAutoRefreshEnabled,
    autoRefreshIntervalMs,
    competitors,
    isLoading,
    isSaving,
    isRefreshingInstagram,
    isPageVisible,
    isBrowserOnline,
  ])

  const handleStartEdit = (competitor: Competitor) => {
    setEditingCompetitorId(competitor.id)
    setFormState(toFormState(competitor))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      setIsSaving(true)

      if (editingCompetitorId) {
        await updateCompetitorRequest(editingCompetitorId, buildUpdatePayload(formState))
        await handleSelectCompetitor(editingCompetitorId)
      } else {
        const created = await createCompetitorRequest(buildCreatePayload(formState))
        await handleSelectCompetitor(created.id)
      }

      await loadData()
      handleStartCreate()
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save competitor')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (competitor: Competitor) => {
    const confirmed = window.confirm(`Delete ${competitor.name}? This action cannot be undone.`)
    if (!confirmed) {
      return
    }

    try {
      await deleteCompetitorRequest(competitor.id)
      if (selectedCompetitorId === competitor.id) {
        setSelectedCompetitorId(null)
        setHistory([])
      }

      if (editingCompetitorId === competitor.id) {
        handleStartCreate()
      }

      await loadData()
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete competitor')
    }
  }

  const sortedCompetitors = useMemo(() => {
    return [...competitors].sort((left, right) => {
      if (sortBy === 'followers') return right.metrics.followers - left.metrics.followers
      if (sortBy === 'engagement') return right.metrics.avgEngagementRate - left.metrics.avgEngagementRate
      return right.metrics.followerGrowthRate - left.metrics.followerGrowthRate
    })
  }, [competitors, sortBy])

  const historyChartData = useMemo(() => {
    return [...history]
      .sort((left, right) => left.capturedAt.localeCompare(right.capturedAt))
      .map((point) => ({
        date: new Date(point.capturedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        followers: point.metrics.followers,
        engagement: point.metrics.avgEngagementRate,
      }))
  }, [history])

  const selectedCompetitor = competitors.find((competitor) => competitor.id === selectedCompetitorId) ?? null

  const industryBenchmarks = benchmarks && [
    { metric: 'Avg. Engagement Rate', value: `${benchmarks.avgEngagementRate}%` },
    { metric: 'Avg. Posts/Week', value: benchmarks.avgPostsPerWeek.toFixed(1) },
    { metric: 'Avg. Follower Growth Rate', value: `${benchmarks.avgFollowerGrowthRate}%` },
    { metric: 'Avg. Response Time', value: `${benchmarks.avgResponseTime}h` },
  ]

  return (
    <div className="space-y-8 p-6 lg:p-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="section-title">Competitor Tracker</h1>
          <p className="mt-2 text-muted-foreground">Monitor competitor performance and industry benchmarks</p>
        </div>
        <Button onClick={loadData} disabled={isLoading} className="gap-2">
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Loading...' : 'Refresh'}
        </Button>
      </div>

      {error && (
        <Card className="border-red-500/50 bg-red-500/5">
          <CardContent className="pt-6">
            <p className="text-red-500">{error}</p>
          </CardContent>
        </Card>
      )}

      {successMessage && (
        <Card className="border-green-500/40 bg-green-500/5">
          <CardContent className="pt-6">
            <p className="text-green-500">{successMessage}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
      <Card className="h-fit xl:sticky xl:top-6">
        <CardHeader>
          <CardTitle>{editingCompetitorId ? 'Edit Competitor' : 'Add Competitor'}</CardTitle>
          <CardDescription>Create or update a competitor profile and metrics.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-3">
            <input
              className="h-10 rounded-md border border-border bg-background px-3 text-sm"
              placeholder="Competitor name"
              value={formState.name}
              onChange={(event) => setFormState((prev) => ({ ...prev, name: event.target.value }))}
              required
            />
            <input
              className="h-10 rounded-md border border-border bg-background px-3 text-sm"
              placeholder="@handle"
              value={formState.handle}
              onChange={(event) => setFormState((prev) => ({ ...prev, handle: event.target.value }))}
              required
            />
            <select
              className="h-10 rounded-md border border-border bg-background px-3 text-sm"
              value={formState.platform}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, platform: event.target.value as FormState['platform'] }))
              }
            >
              <option value="instagram">Instagram</option>
              <option value="tiktok">TikTok</option>
              <option value="youtube">YouTube</option>
              <option value="linkedin">LinkedIn</option>
            </select>
            <input
              className="h-10 rounded-md border border-border bg-background px-3 text-sm"
              type="number"
              placeholder="Followers"
              value={formState.followers}
              onChange={(event) => setFormState((prev) => ({ ...prev, followers: event.target.value }))}
            />
            <input
              className="h-10 rounded-md border border-border bg-background px-3 text-sm"
              type="number"
              step="0.01"
              placeholder="Growth Rate %"
              value={formState.followerGrowthRate}
              onChange={(event) => setFormState((prev) => ({ ...prev, followerGrowthRate: event.target.value }))}
            />
            <input
              className="h-10 rounded-md border border-border bg-background px-3 text-sm"
              type="number"
              placeholder="Monthly Follower Change"
              value={formState.monthlyFollowerChange}
              onChange={(event) => setFormState((prev) => ({ ...prev, monthlyFollowerChange: event.target.value }))}
            />
            <input
              className="h-10 rounded-md border border-border bg-background px-3 text-sm"
              type="number"
              step="0.01"
              placeholder="Avg Engagement Rate %"
              value={formState.avgEngagementRate}
              onChange={(event) => setFormState((prev) => ({ ...prev, avgEngagementRate: event.target.value }))}
            />
            <input
              className="h-10 rounded-md border border-border bg-background px-3 text-sm"
              type="number"
              placeholder="Avg Engagement Count"
              value={formState.avgEngagementCount}
              onChange={(event) => setFormState((prev) => ({ ...prev, avgEngagementCount: event.target.value }))}
            />
            <input
              className="h-10 rounded-md border border-border bg-background px-3 text-sm"
              type="number"
              placeholder="Total Posts"
              value={formState.totalPosts}
              onChange={(event) => setFormState((prev) => ({ ...prev, totalPosts: event.target.value }))}
            />
            <input
              className="h-10 rounded-md border border-border bg-background px-3 text-sm"
              type="number"
              step="0.01"
              placeholder="Avg Posts per Week"
              value={formState.avgPostsPerWeek}
              onChange={(event) => setFormState((prev) => ({ ...prev, avgPostsPerWeek: event.target.value }))}
            />
            <input
              className="h-10 rounded-md border border-border bg-background px-3 text-sm"
              type="number"
              step="0.01"
              placeholder="Response Time (hours)"
              value={formState.responseTime}
              onChange={(event) => setFormState((prev) => ({ ...prev, responseTime: event.target.value }))}
            />
            <input
              className="h-10 rounded-md border border-border bg-background px-3 text-sm"
              type="number"
              placeholder="Top Post Engagement"
              value={formState.topPostEngage}
              onChange={(event) => setFormState((prev) => ({ ...prev, topPostEngage: event.target.value }))}
            />
            <input
              className="h-10 rounded-md border border-border bg-background px-3 text-sm"
              placeholder="Top post caption"
              value={formState.topPostCaption}
              onChange={(event) => setFormState((prev) => ({ ...prev, topPostCaption: event.target.value }))}
              required
            />
            <div className="flex gap-2 pt-2">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? 'Saving...' : editingCompetitorId ? 'Update Competitor' : 'Create Competitor'}
              </Button>
              <Button type="button" variant="outline" onClick={handleStartCreate}>
                Reset
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-6">

      {industryBenchmarks && (
        <div className="grid gap-4 md:grid-cols-4">
          {industryBenchmarks.map((benchmark) => (
            <Card key={benchmark.metric}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">{benchmark.metric}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{benchmark.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSortBy('followers')}
          className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
            sortBy === 'followers'
              ? 'bg-primary text-primary-foreground'
              : 'border border-border text-foreground hover:bg-muted'
          }`}
        >
          By Followers
        </button>
        <button
          onClick={() => setSortBy('engagement')}
          className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
            sortBy === 'engagement'
              ? 'bg-primary text-primary-foreground'
              : 'border border-border text-foreground hover:bg-muted'
          }`}
        >
          By Engagement
        </button>
        <button
          onClick={() => setSortBy('growth')}
          className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
            sortBy === 'growth'
              ? 'bg-primary text-primary-foreground'
              : 'border border-border text-foreground hover:bg-muted'
          }`}
        >
          By Growth
        </button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Competitor Overview</CardTitle>
          <CardDescription>
            Manage competitors and monitor ranking ({competitors.length} tracked).
            {lastInstagramRefreshAt
              ? ` Instagram indicators last refreshed at ${new Date(lastInstagramRefreshAt).toLocaleString()}.`
              : ''}
            {lastAutoRefreshAt
              ? ` Auto-refresh last ran at ${new Date(lastAutoRefreshAt).toLocaleString()}.`
              : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-muted-foreground">
              Refreshing Instagram indicators updates follower and engagement signals using the latest trend model.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAutoRefreshEnabled((current) => !current)}
                className={`rounded-md px-3 py-2 text-xs font-medium transition-colors ${
                  isAutoRefreshEnabled
                    ? 'bg-primary text-primary-foreground'
                    : 'border border-border text-foreground hover:bg-muted'
                }`}
              >
                {isAutoRefreshEnabled ? 'Auto-refresh On' : 'Auto-refresh Off'}
              </button>

              <select
                value={autoRefreshIntervalMs}
                onChange={(event) => setAutoRefreshIntervalMs(Number(event.target.value))}
                disabled={!isAutoRefreshEnabled}
                className="h-9 rounded-md border border-border bg-background px-3 text-xs text-foreground disabled:opacity-50"
              >
                {AUTO_REFRESH_INTERVALS.map((intervalOption) => (
                  <option key={intervalOption.value} value={intervalOption.value}>
                    Every {intervalOption.label}
                  </option>
                ))}
              </select>

              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  void handleRefreshInstagramIndicators('manual')
                }}
                disabled={isRefreshingInstagram || isLoading}
                className="gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshingInstagram ? 'animate-spin' : ''}`} />
                {isRefreshingInstagram ? 'Updating Instagram...' : 'Update Instagram Indicators'}
              </Button>
            </div>
          </div>

          {isAutoRefreshEnabled && (!isPageVisible || !isBrowserOnline) && (
            <div className="mb-4 rounded-md border border-amber-500/50 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
              Auto-refresh paused because {!isBrowserOnline ? 'you are offline' : 'this tab is not visible'}.
            </div>
          )}

          <div className="space-y-3">
            {sortedCompetitors.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No competitors loaded yet.</p>
            ) : (
              sortedCompetitors.map((competitor) => (
                <div
                  key={competitor.id}
                  className={`border rounded-lg p-4 transition-colors ${
                    selectedCompetitorId === competitor.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                    <div>
                      <p className="font-semibold text-foreground">{competitor.name}</p>
                      <p className="text-xs text-muted-foreground">{competitor.handle}</p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">Followers</p>
                      <p className="font-semibold text-foreground">{(competitor.metrics.followers / 1000).toFixed(0)}K</p>
                      <div className="flex items-center gap-1 text-xs">
                        {competitor.metrics.monthlyFollowerChange > 0 ? (
                          <>
                            <TrendingUp className="h-3 w-3 text-green-500" />
                            <span className="text-green-500">+{(competitor.metrics.monthlyFollowerChange / 1000).toFixed(1)}K</span>
                          </>
                        ) : (
                          <>
                            <TrendingDown className="h-3 w-3 text-red-500" />
                            <span className="text-red-500">{(competitor.metrics.monthlyFollowerChange / 1000).toFixed(1)}K</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">Avg Engagement</p>
                      <p className="font-semibold text-foreground">{competitor.metrics.avgEngagementRate}%</p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">Posts</p>
                      <p className="font-semibold text-foreground">{competitor.metrics.totalPosts}</p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">Growth</p>
                      <p className={competitor.metrics.followerGrowthRate > 0 ? 'text-green-500 font-semibold' : 'text-red-500 font-semibold'}>
                        {competitor.metrics.followerGrowthRate > 0 ? '+' : ''}{competitor.metrics.followerGrowthRate}%
                      </p>
                    </div>

                    <div className="flex items-end justify-end gap-2 lg:col-span-1">
                      <Button size="sm" variant="outline" onClick={() => { void handleSelectCompetitor(competitor.id) }}>
                        History
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleStartEdit(competitor)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => { void handleDelete(competitor) }}>
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Competitor History</CardTitle>
          <CardDescription>
            {selectedCompetitor ? `Last snapshots for ${selectedCompetitor.name}` : 'Select a competitor to view trends'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {historyChartData.length === 0 ? (
            <p className="text-muted-foreground">No history data yet.</p>
          ) : (
            <div className="space-y-6">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historyChartData}>
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="followers" stroke="#6ea8fe" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2">
                {history
                  .slice(0, 8)
                  .map((point) => (
                    <div key={point.id} className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm">
                      <span>{new Date(point.capturedAt).toLocaleString()}</span>
                      <span className="text-muted-foreground">Followers: {point.metrics.followers.toLocaleString()}</span>
                      <span className="text-muted-foreground">Engagement: {point.metrics.avgEngagementRate}%</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      </div>
      </div>
    </div>
  )
}
