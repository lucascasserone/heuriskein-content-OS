'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Calendar } from 'lucide-react'

const impressionsData = [
  { date: 'Apr 1', impressions: 2400 },
  { date: 'Apr 5', impressions: 1398 },
  { date: 'Apr 10', impressions: 9800 },
  { date: 'Apr 15', impressions: 3908 },
  { date: 'Apr 20', impressions: 4800 },
  { date: 'Apr 25', impressions: 3800 },
]

const engagementData = [
  { date: 'Apr 1', engagement: 4.2 },
  { date: 'Apr 5', engagement: 3.1 },
  { date: 'Apr 10', engagement: 8.2 },
  { date: 'Apr 15', engagement: 5.9 },
  { date: 'Apr 20', engagement: 6.8 },
  { date: 'Apr 25', engagement: 5.5 },
]

const platformData = [
  { name: 'Instagram', value: 45, color: '#E1306C' },
  { name: 'TikTok', value: 30, color: '#000000' },
  { name: 'YouTube', value: 20, color: '#FF0000' },
  { name: 'LinkedIn', value: 5, color: '#0077B5' },
]

const topPostsData = [
  { title: 'Summer collection', engagement: 8432 },
  { title: 'New product launch', engagement: 6234 },
  { title: 'Behind the scenes', engagement: 5892 },
  { title: 'Team highlights', engagement: 4521 },
]

export default function Analytics() {
  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">Analytics Dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Track your content performance and engagement metrics
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-muted">
          <Calendar className="h-4 w-4" />
          Last 30 Days
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Impressions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">26.1K</div>
            <p className="text-xs text-muted-foreground">+12.5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Avg. Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5.9%</div>
            <p className="text-xs text-muted-foreground">+1.2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Follower Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+845</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89.4K</div>
            <p className="text-xs text-muted-foreground">Across platforms</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Impressions Chart */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Impressions Trend</CardTitle>
            <CardDescription>Your content impressions over time</CardDescription>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        {/* Engagement Chart */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Engagement Rate</CardTitle>
            <CardDescription>Daily engagement percentage</CardDescription>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        {/* Platform Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Distribution</CardTitle>
            <CardDescription>Reach by platform</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={platformData} cx="50%" cy="50%" labelLine={false} label={(entry) => `${entry.name}: ${entry.value}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                  {platformData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
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
          </CardContent>
        </Card>

        {/* Top Posts */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Posts</CardTitle>
            <CardDescription>Posts with highest engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPostsData.map((post, index) => (
                <div key={index} className="space-y-2 border-b border-border pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{post.title}</span>
                    <span className="text-sm font-bold text-primary">{post.engagement.toLocaleString()}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{
                        width: `${(post.engagement / Math.max(...topPostsData.map((p) => p.engagement))) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
