'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { Badge } from '@/components/ui/Badge'
import { Search, Bookmark, Share2, ExternalLink } from 'lucide-react'

type NewsCategory = 'trends' | 'product' | 'insights'

type NewsItem = {
  id: number
  title: string
  source: string
  category: NewsCategory
  date: string
  summary: string
  url: string
  tags: string[]
}

type CategoryTab = {
  id: 'all' | NewsCategory
  label: string
  count: number
}

export default function NewsConsolidator() {
  const newsItems: NewsItem[] = [
    {
      id: 1,
      title: 'Latest Social Media Marketing Trends 2024',
      source: 'TechCrunch',
      category: 'trends',
      date: '2024-04-10',
      summary: 'New AI-powered tools are revolutionizing how brands engage with audiences on social platforms...',
      url: '#',
      tags: ['AI', 'Social Media', 'Marketing'],
    },
    {
      id: 2,
      title: 'Instagram Launches New Shopping Features',
      source: 'Meta Blog',
      category: 'product',
      date: '2024-04-08',
      summary: 'Meta introduces advanced shopping tools to help creators and businesses sell directly on Instagram...',
      url: '#',
      tags: ['Instagram', 'E-commerce', 'Features'],
    },
    {
      id: 3,
      title: 'TikTok Algorithm Changes Explained',
      source: 'Creator Academy',
      category: 'insights',
      date: '2024-04-06',
      summary: 'Deep dive into how TikTok algorithm changes affect content creators and their growth strategies...',
      url: '#',
      tags: ['TikTok', 'Algorithm', 'Strategy'],
    },
    {
      id: 4,
      title: 'YouTube Introduces Interactive Features',
      source: 'YouTube Official',
      category: 'product',
      date: '2024-04-05',
      summary: 'New interactive elements available for creators to increase viewer engagement and retention...',
      url: '#',
      tags: ['YouTube', 'Engagement', 'Features'],
    },
    {
      id: 5,
      title: 'Influencer Marketing Market Growth',
      source: 'Forbes',
      category: 'trends',
      date: '2024-04-03',
      summary: 'Influencer marketing industry continues to grow with micro-influencers gaining significant traction...',
      url: '#',
      tags: ['Influencer', 'Marketing', 'Growth'],
    },
  ]

  const categories: CategoryTab[] = [
    { id: 'all', label: 'All News', count: 5 },
    { id: 'trends', label: 'Trends', count: 2 },
    { id: 'product', label: 'Product Updates', count: 2 },
    { id: 'insights', label: 'Insights', count: 1 },
  ]

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
        </div>
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search news..."
            className="w-full rounded-lg border border-border bg-card pl-10 pr-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="w-full">
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
            {newsItems
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
                          <button className="inline-flex items-center gap-2 rounded px-3 py-1.5 text-xs font-medium bg-muted hover:bg-muted/80 text-foreground">
                            <ExternalLink className="h-3 w-3" />
                            Read More
                          </button>
                          <button className="inline-flex items-center gap-2 rounded px-3 py-1.5 text-xs font-medium bg-muted hover:bg-muted/80 text-foreground">
                            <Bookmark className="h-3 w-3" />
                            Save
                          </button>
                          <button className="inline-flex items-center gap-2 rounded px-3 py-1.5 text-xs font-medium bg-muted hover:bg-muted/80 text-foreground">
                            <Share2 className="h-3 w-3" />
                            Share
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
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
            {[
              { topic: 'AI & Automation', mentions: 245 },
              { topic: 'Social Commerce', mentions: 189 },
              { topic: 'Creator Economy', mentions: 156 },
              { topic: 'Video Marketing', mentions: 142 },
            ].map((item) => (
              <div key={item.topic} className="rounded-lg border border-border p-4 hover:border-primary/50 cursor-pointer transition-colors">
                <p className="font-semibold text-foreground">{item.topic}</p>
                <p className="text-sm text-muted-foreground mt-1">{item.mentions} mentions</p>
                <div className="h-2 w-full rounded-full bg-muted mt-3 overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${(item.mentions / 245) * 100}%` }}
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
            {[
              { name: 'Instagram Updates', subscribers: 1250 },
              { name: 'TikTok Trends', subscribers: 980 },
              { name: 'LinkedIn Marketing', subscribers: 754 },
              { name: 'YouTube News', subscribers: 892 },
            ].map((collection) => (
              <div
                key={collection.name}
                className="flex items-center justify-between rounded-lg border border-border p-4"
              >
                <div>
                  <p className="font-medium text-foreground">{collection.name}</p>
                  <p className="text-xs text-muted-foreground">{collection.subscribers} subscribers</p>
                </div>
                <button className="rounded px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90">
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
