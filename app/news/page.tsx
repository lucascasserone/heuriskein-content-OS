'use client'

import { useCallback, useEffect, useState } from 'react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { Badge } from '@/components/ui/Badge'
import { Search, Bookmark, Share2, ExternalLink, RefreshCw } from 'lucide-react'
import { fetchNews, refreshNews, toggleSaveNews } from '@/lib/news/api'
import { CuratedCollection, NewsCategory, NewsItem, TrendingTopic } from '@/lib/news/types'
import { Button } from '@/components/ui/Button'

type CategoryTab = {
  id: 'all' | NewsCategory
  label: string
  count: number
}

export default function NewsConsolidator() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([])
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([])
  const [collections, setCollections] = useState<CuratedCollection[]>([])
  const [generatedAt, setGeneratedAt] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<'all' | NewsCategory>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isAutoRefreshEnabled, setIsAutoRefreshEnabled] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const loadNews = useCallback(async (options?: { forceRefresh?: boolean; keepLoadingState?: boolean }) => {
    const keepLoadingState = options?.keepLoadingState ?? false

    try {
      if (!keepLoadingState) {
        setIsLoading(true)
      }

      const snapshot = options?.forceRefresh
        ? await refreshNews()
        : await fetchNews(searchTerm, activeCategory)

      setNewsItems(snapshot.items)
      setTrendingTopics(snapshot.trendingTopics)
      setCollections(snapshot.collections)
      setGeneratedAt(snapshot.generatedAt)
      setErrorMessage(null)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to load news feed')
    } finally {
      if (!keepLoadingState) {
        setIsLoading(false)
      }
    }
  }, [activeCategory, searchTerm])

  useEffect(() => {
    void loadNews()
  }, [loadNews])

  useEffect(() => {
    if (!isAutoRefreshEnabled) {
      return
    }

    const intervalId = window.setInterval(() => {
      void loadNews({ keepLoadingState: true })
    }, 45_000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [isAutoRefreshEnabled, loadNews])

  const categories: CategoryTab[] = [
    { id: 'all', label: 'All News', count: newsItems.length },
    { id: 'trends', label: 'Trends', count: newsItems.filter((item) => item.category === 'trends').length },
    { id: 'product', label: 'Product Updates', count: newsItems.filter((item) => item.category === 'product').length },
    { id: 'insights', label: 'Insights', count: newsItems.filter((item) => item.category === 'insights').length },
  ]

  const handleToggleSave = async (id: string) => {
    try {
      const updated = await toggleSaveNews(id)
      setNewsItems((current) => current.map((item) => (item.id === updated.id ? updated : item)))
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to save item')
    }
  }

  const handleForceRefresh = async () => {
    try {
      setIsRefreshing(true)
      await loadNews({ forceRefresh: true, keepLoadingState: true })
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleShareNews = async (item: NewsItem) => {
    const shareText = `${item.title} - ${item.url}`

    try {
      if (navigator.share) {
        await navigator.share({
          title: item.title,
          text: item.summary,
          url: item.url,
        })
      } else {
        await navigator.clipboard.writeText(shareText)
      }

      setErrorMessage(null)
    } catch {
      setErrorMessage('Failed to share this news item.')
    }
  }

  const categoryColors: Record<NewsCategory, string> = {
    trends: 'bg-blue-900 text-blue-200',
    product: 'bg-purple-900 text-purple-200',
    insights: 'bg-green-900 text-green-200',
  }

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">News Consolidator</h1>
          <p className="mt-2 text-muted-foreground">
            Curated industry news and insights for content creators
          </p>
          {generatedAt && (
            <p className="mt-1 text-xs text-muted-foreground">
              Last update: {new Date(generatedAt).toLocaleString()}
            </p>
          )}
        </div>
        <div className="flex w-full max-w-2xl items-center justify-end gap-2">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search news..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full rounded-lg border border-border bg-card pl-10 pr-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <Button type="button" variant="outline" onClick={() => setIsAutoRefreshEnabled((current) => !current)}>
            {isAutoRefreshEnabled ? 'Auto: On' : 'Auto: Off'}
          </Button>
          <Button type="button" onClick={() => void handleForceRefresh()} disabled={isRefreshing} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {errorMessage && (
        <div className="rounded-lg border border-red-500/30 bg-red-950/40 px-4 py-3 text-sm text-red-200">
          {errorMessage}
        </div>
      )}

      {/* Tabs */}
      <Tabs value={activeCategory} onValueChange={(value) => setActiveCategory(value as 'all' | NewsCategory)} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-4">
          {categories.map((cat) => (
            <TabsTrigger key={cat.id} value={cat.id} className="relative">
              {cat.label}
              <span className="ml-2 inline-flex items-center justify-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                {cat.count}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* News Feed */}
        {categories.map((cat) => (
          <TabsContent key={cat.id} value={cat.id} className="space-y-4 mt-4">
            {isLoading ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">Loading news feed...</CardContent>
              </Card>
            ) : newsItems.filter((item) => cat.id === 'all' || item.category === cat.id).length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  No results found for this filter.
                </CardContent>
              </Card>
            ) : (
              newsItems
              .filter((item) => cat.id === 'all' || item.category === cat.id)
              .map((item) => (
                <Card key={item.id} className="hover:border-primary/50 transition-colors overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      {/* Thumbnail Placeholder */}
                      <div className="h-24 w-24 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex-shrink-0 hidden sm:block" />

                      {/* Content */}
                      <div className="flex-1 space-y-3">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-2 flex-1">
                            <h3 className="font-semibold text-foreground text-base leading-tight hover:text-primary cursor-pointer">
                              {item.title}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span className="font-medium">{item.source}</span>
                              <span>•</span>
                              <span>
                                {new Date(item.date).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </span>
                            </div>
                          </div>
                          <Badge className={`${categoryColors[item.category]} text-xs font-medium flex-shrink-0`}>
                            {categories.find((c) => c.id === item.category)?.label}
                          </Badge>
                        </div>

                        {/* Summary */}
                        <p className="text-sm text-muted-foreground line-clamp-2">{item.summary}</p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 pt-2">
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded px-3 py-1.5 text-xs font-medium bg-muted hover:bg-muted/80 text-foreground"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Read More
                          </a>
                          <button
                            type="button"
                            onClick={() => {
                              void handleToggleSave(item.id)
                            }}
                            className={`inline-flex items-center gap-2 rounded px-3 py-1.5 text-xs font-medium ${
                              item.saved
                                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                                : 'bg-muted hover:bg-muted/80 text-foreground'
                            }`}
                          >
                            <Bookmark className="h-3 w-3" />
                            {item.saved ? 'Saved' : 'Save'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              void handleShareNews(item)
                            }}
                            className="inline-flex items-center gap-2 rounded px-3 py-1.5 text-xs font-medium bg-muted hover:bg-muted/80 text-foreground"
                          >
                            <Share2 className="h-3 w-3" />
                            Share
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Trending Topics */}
      <Card>
        <CardHeader>
          <CardTitle>Trending Topics</CardTitle>
          <CardDescription>Most discussed topics this week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {trendingTopics.map((item) => (
              <div key={item.topic} className="rounded-lg border border-border p-4 hover:border-primary/50 cursor-pointer transition-colors">
                <p className="font-semibold text-foreground">{item.topic}</p>
                <p className="text-sm text-muted-foreground mt-1">{item.mentions} mentions</p>
                <div className="h-2 w-full rounded-full bg-muted mt-3 overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${trendingTopics[0] ? Math.min((item.mentions / trendingTopics[0].mentions) * 100, 100) : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Newsletters */}
      <Card>
        <CardHeader>
          <CardTitle>Curated Collections</CardTitle>
          <CardDescription>Subscribe to topic-specific news feeds</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {collections.map((collection) => (
              <div
                key={collection.name}
                className="flex items-center justify-between rounded-lg border border-border p-4"
              >
                <div>
                  <p className="font-medium text-foreground">{collection.name}</p>
                  <p className="text-xs text-muted-foreground">{collection.subscribers} subscribers</p>
                </div>
                <button type="button" className="rounded px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90">
                  Subscribe
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
