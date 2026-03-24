'use client'

import { useState } from 'react'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutGrid,
  BarChart3,
  Calendar,
  TrendingUp,
  Newspaper,
  LogOut,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

type SidebarProps = {
  userEmail: string | null
}

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

export default function Sidebar({ userEmail }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isSigningOut, setIsSigningOut] = useState(false)

  async function handleSignOut() {
    try {
      setIsSigningOut(true)
      const supabase = createSupabaseBrowserClient()
      const { error } = await supabase.auth.signOut()

      if (error) {
        throw error
      }

      router.replace('/login')
      router.refresh()
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <aside className="relative flex w-64 flex-col border-r border-border bg-card">
      <nav className="flex-1 space-y-1 p-4">
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
      <div className="border-t border-border bg-card p-4">
        <div className="space-y-3 text-xs text-muted-foreground">
          <div>
            <p className="font-semibold text-foreground">{userEmail ?? 'Authenticated user'}</p>
            <p>Private workspace session</p>
          </div>
          <p className="font-semibold">v1.0.0</p>
          <button
            type="button"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-50"
          >
            <LogOut className="h-3.5 w-3.5" />
            {isSigningOut ? 'Signing out...' : 'Sign out'}
          </button>
        </div>
      </div>
    </aside>
  )
}
