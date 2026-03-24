'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { TrendingUp, TrendingDown, Users, Heart, MessageCircle } from 'lucide-react'

export default function CompetitorTracker() {
  const competitors = [
    {
      id: 1,
      name: 'Competitor A',
      handle: '@competitor_a',
      followers: 245600,
      followerChange: 12400,
      avgEngagement: 7.2,
      posts: 156,
      topPost: 'Summer Sale Announcement',
      topPostEngage: 18500,
    },
    {
      id: 2,
      name: 'Competitor B',
      handle: '@competitor_b',
      followers: 189400,
      followerChange: 8900,
      avgEngagement: 5.8,
      posts: 142,
      topPost: 'New Product Launch',
      topPostEngage: 15200,
    },
    {
      id: 3,
      name: 'Competitor C',
      handle: '@competitor_c',
      followers: 312400,
      followerChange: 15600,
      avgEngagement: 9.1,
      posts: 189,
      topPost: 'Behind the Scenes',
      topPostEngage: 22400,
    },
    {
      id: 4,
      name: 'Competitor D',
      handle: '@competitor_d',
      followers: 98400,
      followerChange: -2100,
      avgEngagement: 4.3,
      posts: 98,
      topPost: 'Customer Testimonial',
      topPostEngage: 8900,
    },
  ]

  const industryBenchmarks = [
    { metric: 'Avg. Engagement Rate', value: '6.1%', change: '+0.8%' },
    { metric: 'Avg. Posts/Week', value: '4.2', change: '+0.3' },
    { metric: 'Avg. Follower Growth', value: '+8.7K', change: '+1.2K' },
    { metric: 'Avg. Response Time', value: '2.5h', change: '-0.5h' },
  ]

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div>
        <h1 className="section-title">Competitor Tracker</h1>
        <p className="mt-2 text-muted-foreground">
          Monitor competitor performance and industry benchmarks
        </p>
      </div>

      {/* Industry Benchmarks */}
      <div className="grid gap-4 md:grid-cols-4">
        {industryBenchmarks.map((bench) => (
          <Card key={bench.metric}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">{bench.metric}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bench.value}</div>
              <p className="text-xs text-green-500 mt-1">↗ {bench.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Competitors Table */}
      <Card>
        <CardHeader>
          <CardTitle>Competitor Overview</CardTitle>
          <CardDescription>
            Real-time tracking of competitor metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {competitors.map((competitor) => (
              <div key={competitor.id} className="border border-border rounded-lg p-4 hover:border-primary/50 transition-colors">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                  {/* Name & Handle */}
                  <div>
                    <p className="font-semibold text-foreground">{competitor.name}</p>
                    <p className="text-xs text-muted-foreground">{competitor.handle}</p>
                  </div>

                  {/* Followers */}
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Followers</p>
                    <p className="font-semibold text-foreground">{(competitor.followers / 1000).toFixed(0)}K</p>
                    <div className="flex items-center gap-1 text-xs">
                      {competitor.followerChange > 0 ? (
                        <>
                          <TrendingUp className="h-3 w-3 text-green-500" />
                          <span className="text-green-500">+{(competitor.followerChange / 1000).toFixed(1)}K</span>
                        </>
                      ) : (
                        <>
                          <TrendingDown className="h-3 w-3 text-red-500" />
                          <span className="text-red-500">{(competitor.followerChange / 1000).toFixed(1)}K</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Engagement */}
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Avg Engagement</p>
                    <p className="font-semibold text-foreground">{competitor.avgEngagement}%</p>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden mt-2">
                      <div
                        className="h-full bg-primary"
                        style={{
                          width: `${Math.min((competitor.avgEngagement / 12) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Posts & Top Post */}
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Posts</p>
                    <p className="font-semibold text-foreground">{competitor.posts}</p>
                    <p className="text-xs text-muted-foreground mt-2">Top: {competitor.topPost}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-end gap-2">
                    <button className="flex-1 rounded px-3 py-2 text-xs bg-primary text-primary-foreground hover:bg-primary/90">
                      View Profile
                    </button>
                    <button className="rounded px-3 py-2 text-xs bg-muted hover:bg-muted/80">
                      Compare
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Competitive Analysis */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Market Leaders</CardTitle>
            <CardDescription>Top performers by follower count</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {competitors
                .sort((a, b) => b.followers - a.followers)
                .slice(0, 3)
                .map((competitor, index) => (
                  <div key={competitor.id} className="flex items-center justify-between pb-3 border-b border-border last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                        #{index + 1}
                      </div>
                      <span className="text-sm font-medium">{competitor.name}</span>
                    </div>
                    <span className="text-sm font-semibold">{(competitor.followers / 1000).toFixed(0)}K</span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Engagement Leaders</CardTitle>
            <CardDescription>Highest average engagement rate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {competitors
                .sort((a, b) => b.avgEngagement - a.avgEngagement)
                .slice(0, 3)
                .map((competitor, index) => (
                  <div key={competitor.id} className="flex items-center justify-between pb-3 border-b border-border last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-emerald-900 flex items-center justify-center text-sm font-bold text-emerald-200">
                        #{index + 1}
                      </div>
                      <span className="text-sm font-medium">{competitor.name}</span>
                    </div>
                    <span className="text-sm font-semibold">{competitor.avgEngagement}%</span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
