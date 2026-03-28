'use client'

import { ReactNode, useState } from 'react'

import { usePathname } from 'next/navigation'
import { Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react'

import Sidebar from '@/components/Sidebar'
import { Button } from '@/components/ui/Button'

type AppShellProps = {
  children: ReactNode
  userEmail: string | null
}

export default function AppShell({ children, userEmail }: AppShellProps) {
  const pathname = usePathname()
  const isAuthRoute = pathname === '/login'
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  if (isAuthRoute) {
    return <main className="min-h-screen bg-background">{children}</main>
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        userEmail={userEmail}
        isCollapsed={isSidebarCollapsed}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border/80 bg-background/90 px-3 backdrop-blur sm:px-4">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="hidden lg:inline-flex"
              onClick={() => setIsSidebarCollapsed((current) => !current)}
              aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isSidebarCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            </Button>

            <span className="text-sm font-medium text-foreground">Heuriskein Content OS</span>
          </div>
        </header>

        <main className="min-w-0 flex-1 overflow-auto bg-background">{children}</main>
      </div>
    </div>
  )
}
