'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutGrid,
  BarChart3,
  Calendar,
  TrendingUp,
  Newspaper,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutGrid,
  },
  {
    name: 'Instagram Manager',
    href: '/instagram',
    icon: LayoutGrid,
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
  },
  {
    name: 'Content Calendar',
    href: '/calendar',
    icon: Calendar,
  },
  {
    name: 'Competitor Tracker',
    href: '/competitors',
    icon: TrendingUp,
  },
  {
    name: 'News Consolidator',
    href: '/news',
    icon: Newspaper,
  },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r border-border bg-card">
      <nav className="space-y-1 p-4">
        {/* Logo/Brand */}
        <div className="mb-8 flex items-center gap-2 px-2 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-sm font-bold">HC</span>
          </div>
          <span className="text-lg font-bold text-foreground">Heuriskein</span>
        </div>

        {/* Navigation Items */}
        <div className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-card hover:text-foreground'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </div>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 w-64 border-t border-border bg-card p-4">
        <div className="text-xs text-muted-foreground">
          <p className="font-semibold">v1.0.0</p>
          <p>© 2024 Heuriskein</p>
        </div>
      </div>
    </aside>
  )
}
