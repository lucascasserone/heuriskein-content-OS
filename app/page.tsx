import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { BarChart3, Calendar, TrendingUp, Newspaper } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const stats = [
    {
      title: 'Total Posts',
      value: '24',
      description: 'Last 30 days',
      icon: Calendar,
      color: 'text-blue-500',
    },
    {
      title: 'Engagement Rate',
      value: '8.4%',
      description: '+2.1% from last month',
      icon: TrendingUp,
      color: 'text-green-500',
    },
    {
      title: 'Total Reach',
      value: '12.5K',
      description: 'Across all platforms',
      icon: BarChart3,
      color: 'text-purple-500',
    },
    {
      title: 'News Items',
      value: '142',
      description: 'Consolidated this month',
      icon: Newspaper,
      color: 'text-orange-500',
    },
  ]

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div>
        <h1 className="section-title">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Welcome to your content management dashboard. Overview of your multi-platform content strategy.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Links */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks for content management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link href="/instagram" className="block w-full rounded-lg border border-border bg-card p-3 text-left text-sm font-medium hover:bg-muted">
                → Create New Post
              </Link>
              <Link href="/analytics" className="block w-full rounded-lg border border-border bg-card p-3 text-left text-sm font-medium hover:bg-muted">
                → View Analytics
              </Link>
              <Link href="/calendar" className="block w-full rounded-lg border border-border bg-card p-3 text-left text-sm font-medium hover:bg-muted">
                → Schedule Content
              </Link>
              <Link href="/competitors" className="block w-full rounded-lg border border-border bg-card p-3 text-left text-sm font-medium hover:bg-muted">
                → Check Competitors
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>
              Current system health and metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">API Status</span>
                <span className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  Operational
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Sync Status</span>
                <span className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  Updated
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Last Refresh</span>
                <span>2 min ago</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Database</span>
                <span className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  Connected
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
