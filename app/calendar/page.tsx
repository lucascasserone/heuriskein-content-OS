'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'

type Platform = 'Instagram' | 'TikTok' | 'YouTube' | 'LinkedIn'

type ScheduleItem = {
  platform: Platform
  title: string
  color: string
}

export default function ContentCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2024, 3, 1))

  const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay()

  const calendarDays = []
  for (let i = 0; i < firstDayOfMonth(currentMonth); i++) {
    calendarDays.push(null)
  }
  for (let i = 1; i <= daysInMonth(currentMonth); i++) {
    calendarDays.push(i)
  }

  const schedules: Record<number, ScheduleItem[]> = {
    1: [
      { platform: 'Instagram', title: 'Product Launch', color: 'bg-pink-900' },
      { platform: 'TikTok', title: 'Trending Sound', color: 'bg-black' },
    ],
    5: [{ platform: 'YouTube', title: 'Tutorial Video', color: 'bg-red-900' }],
    10: [
      { platform: 'Instagram', title: 'Story Update', color: 'bg-pink-900' },
      { platform: 'Instagram', title: 'Reel Post', color: 'bg-pink-900' },
    ],
    15: [{ platform: 'LinkedIn', title: 'Article Share', color: 'bg-blue-900' }],
    20: [{ platform: 'TikTok', title: 'Dance Challenge', color: 'bg-black' }],
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const platformColors: Record<Platform, string> = {
    Instagram: 'bg-pink-900 text-pink-200',
    TikTok: 'bg-black text-white',
    YouTube: 'bg-red-900 text-red-200',
    LinkedIn: 'bg-blue-900 text-blue-200',
  }

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div>
        <h1 className="section-title">Content Calendar</h1>
        <p className="mt-2 text-muted-foreground">
          Plan and visualize your content across multiple platforms
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
            className="rounded-lg border border-border p-2 hover:bg-muted"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h2 className="subsection-title min-w-40 text-center">{monthName}</h2>
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
            className="rounded-lg border border-border p-2 hover:bg-muted"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <Tabs defaultValue="all" className="w-full max-w-xs">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all" className="text-xs">
              All
            </TabsTrigger>
            <TabsTrigger value="instagram" className="text-xs">
              IG
            </TabsTrigger>
            <TabsTrigger value="tiktok" className="text-xs">
              TT
            </TabsTrigger>
            <TabsTrigger value="youtube" className="text-xs">
              YT
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Calendar */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day) => (
              <div key={day} className="p-2 text-center text-sm font-semibold text-muted-foreground">
                {day}
              </div>
            ))}

            {calendarDays.map((day, index) => (
              <div
                key={index}
                className={`min-h-28 rounded-lg border border-border p-2 ${day ? 'bg-card' : 'bg-muted/30'}`}
              >
                {day && (
                  <>
                    <p className="mb-2 text-sm font-semibold text-foreground">{day}</p>
                    <div className="space-y-1">
                      {schedules[day]?.map((item, itemIndex) => (
                        <div
                          key={itemIndex}
                          className={`rounded px-2 py-1 text-xs font-medium text-white ${platformColors[item.platform] || 'bg-gray-700'}`}
                        >
                          {item.title}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="grid gap-4 md:grid-cols-3">
        {(['Instagram', 'TikTok', 'YouTube'] as Platform[]).map((platform) => (
          <Card key={platform}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <div className={`h-3 w-3 rounded ${platformColors[platform]?.split(' ')[0]}`} />
                {platform}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {Object.values(schedules).flat().filter((s) => s.platform === platform).length}
              </p>
              <p className="text-xs text-muted-foreground">Posts scheduled</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upcoming Posts */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Posts</CardTitle>
          <CardDescription>Next scheduled posts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { date: 'April 15, 2024', platform: 'Instagram', title: 'Product Showcase', status: 'scheduled' },
              { date: 'April 18, 2024', platform: 'TikTok', title: 'Trending Challenge', status: 'scheduled' },
              { date: 'April 22, 2024', platform: 'YouTube', title: 'Weekly Vlog', status: 'scheduled' },
              { date: 'April 25, 2024', platform: 'LinkedIn', title: 'Industry Insights', status: 'draft' },
            ].map((post, index) => (
              <div key={index} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
                <div className="space-y-1">
                  <p className="font-medium text-foreground">{post.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {post.date} • {post.platform}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${post.status === 'scheduled' ? 'bg-green-900 text-green-200' : 'bg-yellow-900 text-yellow-200'}`}>
                    {post.status}
                  </span>
                  <button className="rounded px-2 py-1 text-xs bg-muted hover:bg-muted/80">Edit</button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
