'use client'

import { ReactNode } from 'react'

import { usePathname } from 'next/navigation'

import Sidebar from '@/components/Sidebar'

type AppShellProps = {
  children: ReactNode
  userEmail: string | null
}

export default function AppShell({ children, userEmail }: AppShellProps) {
  const pathname = usePathname()
  const isAuthRoute = pathname === '/login'

  if (isAuthRoute) {
    return <main className="min-h-screen bg-background">{children}</main>
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar userEmail={userEmail} />
      <main className="flex-1 overflow-auto bg-background">{children}</main>
    </div>
  )
}
