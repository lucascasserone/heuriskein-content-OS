'use client'

import { useEffect, useMemo, useState } from 'react'
import { Link2, RefreshCw, CheckCircle2 } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import {
  connectSocialPlatform,
  disconnectSocialPlatform,
  fetchSocialConnections,
} from '@/lib/social/api'
import { SocialConnection, SocialPlatform, SUPPORTED_SOCIAL_PLATFORMS } from '@/lib/social/types'

const platformLabel: Record<SocialPlatform, string> = {
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  youtube: 'YouTube',
  x: 'X',
  facebook: 'Facebook',
}

type PlatformForm = {
  accountId: string
  accessToken: string
}

export default function SocialHubPage() {
  const [connections, setConnections] = useState<SocialConnection[]>([])
  const [forms, setForms] = useState<Record<SocialPlatform, PlatformForm>>({
    instagram: { accountId: '', accessToken: '' },
    linkedin: { accountId: '', accessToken: '' },
    youtube: { accountId: '', accessToken: '' },
    x: { accountId: '', accessToken: '' },
    facebook: { accountId: '', accessToken: '' },
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSavingPlatform, setIsSavingPlatform] = useState<SocialPlatform | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const connectionsMap = useMemo(() => {
    return connections.reduce((acc, connection) => {
      acc[connection.platform] = connection
      return acc
    }, {} as Record<SocialPlatform, SocialConnection>)
  }, [connections])

  async function loadConnections() {
    try {
      setIsLoading(true)
      const data = await fetchSocialConnections()
      setConnections(data)
      setError(null)
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load social connections')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadConnections()
  }, [])

  async function handleConnect(platform: SocialPlatform) {
    const values = forms[platform]
    if (!values.accountId.trim() || !values.accessToken.trim()) {
      setError('Account ID and access token are required.')
      return
    }

    try {
      setIsSavingPlatform(platform)
      const updated = await connectSocialPlatform({
        platform,
        accountId: values.accountId.trim(),
        accessToken: values.accessToken.trim(),
      })

      setConnections((current) => {
        const other = current.filter((item) => item.platform !== platform)
        return [...other, updated]
      })

      setForms((current) => ({
        ...current,
        [platform]: {
          ...current[platform],
          accessToken: '',
        },
      }))
      setMessage(`${platformLabel[platform]} API linked and ready for publishing.`)
      setError(null)
    } catch (connectError) {
      setError(connectError instanceof Error ? connectError.message : `Failed to connect ${platformLabel[platform]}`)
    } finally {
      setIsSavingPlatform(null)
    }
  }

  async function handleDisconnect(platform: SocialPlatform) {
    try {
      setIsSavingPlatform(platform)
      await disconnectSocialPlatform(platform)

      setConnections((current) =>
        current.map((item) =>
          item.platform === platform
            ? {
                ...item,
                isConnected: false,
                accountId: null,
                instagramUserId: null,
                connectedAt: null,
                mode: 'mock',
              }
            : item
        )
      )

      setMessage(`${platformLabel[platform]} API disconnected.`)
      setError(null)
    } catch (disconnectError) {
      setError(disconnectError instanceof Error ? disconnectError.message : `Failed to disconnect ${platformLabel[platform]}`)
    } finally {
      setIsSavingPlatform(null)
    }
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="section-title">Social Hub</h1>
          <p className="mt-2 text-muted-foreground">
            Link credentials for Instagram, LinkedIn, YouTube, X and Facebook.
          </p>
        </div>
        <Button type="button" variant="outline" className="gap-2" onClick={() => void loadConnections()} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Sync Status
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-950/40 px-4 py-3 text-sm text-red-200">{error}</div>
      )}

      {message && (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/40 px-4 py-3 text-sm text-emerald-200">{message}</div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {SUPPORTED_SOCIAL_PLATFORMS.map((platform) => {
          const connection = connectionsMap[platform]
          const isConnected = Boolean(connection?.isConnected)
          const isSaving = isSavingPlatform === platform

          return (
            <Card key={platform} className="border-border/80">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Link2 className="h-4 w-4" />
                  {platformLabel[platform]}
                </CardTitle>
                <CardDescription className="flex items-center gap-2">
                  {isConnected ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      API linked {connection?.accountId ? `(${connection.accountId})` : ''}
                    </>
                  ) : (
                    'Credentials missing'
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <input
                  value={forms[platform].accountId}
                  onChange={(event) =>
                    setForms((current) => ({
                      ...current,
                      [platform]: {
                        ...current[platform],
                        accountId: event.target.value,
                      },
                    }))
                  }
                  placeholder="Account/User ID"
                  className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
                />
                <input
                  type="password"
                  value={forms[platform].accessToken}
                  onChange={(event) =>
                    setForms((current) => ({
                      ...current,
                      [platform]: {
                        ...current[platform],
                        accessToken: event.target.value,
                      },
                    }))
                  }
                  placeholder="Access token"
                  className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
                />
                <div className="flex gap-2">
                  <Button type="button" className="flex-1" disabled={isSaving} onClick={() => void handleConnect(platform)}>
                    {isSaving ? 'Saving...' : isConnected ? 'Relink API' : 'Link API'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isSaving || !isConnected}
                    onClick={() => void handleDisconnect(platform)}
                  >
                    Unlink API
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Delivery mode: {connection?.mode ?? 'mock'}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
