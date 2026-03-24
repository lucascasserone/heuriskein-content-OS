'use client'

import { Suspense } from 'react'
import { FormEvent, useState } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { isSupabaseConfigured } from '@/lib/supabase/config'

type AuthMode = 'sign-in' | 'sign-up'

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageFallback />}>
      <LoginPageContent />
    </Suspense>
  )
}

function LoginPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [mode, setMode] = useState<AuthMode>('sign-in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const nextPath = searchParams.get('next') || '/'
  const isConfigured = isSupabaseConfigured()

  function buildAuthErrorMessage(error: unknown): string {
    const message = error instanceof Error ? error.message : 'Authentication failed.'

    if (message.toLowerCase().includes('invalid login credentials')) {
      return 'Invalid login credentials. If you just created the account, confirm the email first or disable email confirmation in Supabase Auth.'
    }

    return message
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Email and password are required.')
      return
    }

    try {
      setIsSubmitting(true)
      setErrorMessage(null)
      setSuccessMessage(null)

      const supabase = createSupabaseBrowserClient()

      if (mode === 'sign-in') {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        })

        if (error) {
          throw error
        }

        router.replace(nextPath)
        router.refresh()
        return
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`,
        },
      })

      if (error) {
        throw error
      }

      if (data.session) {
        router.replace(nextPath)
        router.refresh()
        return
      }

      setSuccessMessage('Account created. Confirm your email if your Supabase project requires verification.')
    } catch (error) {
      setErrorMessage(buildAuthErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <Card className="w-full max-w-md border-border/80 bg-card/95 shadow-2xl shadow-black/20">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <span className="text-base font-bold">HC</span>
          </div>
          <div>
            <CardTitle className="text-2xl">Heuriskein Auth</CardTitle>
            <CardDescription>
              Sign in to access your private content workspace and user-scoped analytics.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isConfigured && (
            <div className="rounded-lg border border-amber-500/30 bg-amber-950/40 px-4 py-3 text-sm text-amber-100">
              Supabase auth is incomplete. Add NEXT_PUBLIC_SUPABASE_ANON_KEY to your local environment.
            </div>
          )}

          {errorMessage && (
            <div className="rounded-lg border border-red-500/30 bg-red-950/40 px-4 py-3 text-sm text-red-200">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="rounded-lg border border-green-500/30 bg-green-950/40 px-4 py-3 text-sm text-green-200">
              {successMessage}
            </div>
          )}

          <div className="rounded-lg border border-border bg-background px-4 py-3 text-sm text-muted-foreground">
            If email confirmation is enabled in Supabase Auth, a new account cannot sign in until the confirmation link is opened.
          </div>

          <div className="grid grid-cols-2 gap-2 rounded-xl border border-border bg-background p-1">
            <button
              type="button"
              onClick={() => {
                setMode('sign-in')
                setErrorMessage(null)
                setSuccessMessage(null)
              }}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                mode === 'sign-in' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('sign-up')
                setErrorMessage(null)
                setSuccessMessage(null)
              }}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                mode === 'sign-up' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email</label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@company.com"
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Password</label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <Button type="submit" className="w-full" disabled={!isConfigured || isSubmitting}>
              {isSubmitting ? 'Submitting...' : mode === 'sign-in' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

function LoginPageFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12 text-sm text-muted-foreground">
      Loading authentication...
    </div>
  )
}
