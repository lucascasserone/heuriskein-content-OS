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
  X,
  Link2,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { isSupabaseConfigured } from '@/lib/supabase/config'

type SidebarProps = {
  userEmail: string | null
  isCollapsed: boolean
  isMobileOpen: boolean
  onCloseMobile: () => void
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
  {
    name: 'Social Hub',
    href: '/social',
    icon: Link2,
  },
]

export default function Sidebar({ userEmail, isCollapsed, isMobileOpen, onCloseMobile }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isSigningOut, setIsSigningOut] = useState(false)

  function handleNavigationClick() {
    if (window.innerWidth < 1024) {
      onCloseMobile()
    }
  }

  async function handleSignOut() {
    try {
      setIsSigningOut(true)

      if (isSupabaseConfigured()) {
        const supabase = createSupabaseBrowserClient()
        const { error } = await supabase.auth.signOut()

        if (error) {
          throw error
        }

        router.replace('/login')
        router.refresh()
        return
      }

      router.replace('/')
      router.refresh()
    } catch {
      // Fallback ensures user can still leave the private area even if auth client fails.
      router.push(isSupabaseConfigured() ? '/login' : '/')
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <>
      {isMobileOpen && (
        <button
          type="button"
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          aria-label="Close menu overlay"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border bg-card transition-all duration-300 lg:static lg:z-auto',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          isCollapsed ? 'w-[min(82vw,18rem)] lg:w-20' : 'w-[min(82vw,18rem)] lg:w-64',
        )}
      >
      <nav className="flex-1 space-y-1 p-3 lg:p-4">
        {/* Logo/Brand */}
        <div className={cn('mb-4 flex items-center px-2 py-3', isCollapsed ? 'justify-center lg:px-0' : 'gap-2')}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-sm font-bold">HC</span>
          </div>
          <span className={cn('text-lg font-bold text-foreground', isCollapsed && 'lg:hidden')}>Heuriskein</span>
          <button
            type="button"
            onClick={onCloseMobile}
            className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-muted lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleNavigationClick}
                className={cn(
                  'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200',
                  isCollapsed ? 'justify-center lg:px-2' : 'gap-3',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <Icon className="h-5 w-5" />
                <span className={cn(isCollapsed && 'lg:hidden')}>{item.name}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-border bg-card p-4">
        <div className={cn('space-y-3 text-xs text-muted-foreground', isCollapsed && 'lg:space-y-2')}>
          <div className={cn(isCollapsed && 'lg:text-center')}>
            <p className="font-semibold text-foreground">{isCollapsed ? 'User' : userEmail ?? 'Authenticated user'}</p>
            <p className={cn(isCollapsed && 'lg:hidden')}>Private workspace session</p>
          </div>
          <p className="font-semibold">v1.2.1</p>
          <button
            type="button"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className={cn(
              'inline-flex w-full rounded-md border border-border px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-50',
              isCollapsed ? 'justify-center lg:px-2' : 'items-center gap-2'
            )}
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className={cn(isCollapsed && 'lg:hidden')}>{isSigningOut ? 'Signing out...' : 'Sign out'}</span>
          </button>
        </div>
      </div>
    </aside>
    </>
  )
}
