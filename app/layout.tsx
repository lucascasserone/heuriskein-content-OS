import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import AppShell from '@/components/AppShell'
import './globals.css'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/config'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Heuriskein Content Dashboard',
  description: 'Content Management Dashboard for multi-platform content management',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let userEmail: string | null = null

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createSupabaseServerClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      userEmail = user?.email ?? null
    } catch {
      userEmail = null
    }
  }

  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-foreground`}>
        <AppShell userEmail={userEmail}>{children}</AppShell>
      </body>
    </html>
  )
}
