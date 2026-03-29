'use client'

import { useEffect, useMemo, useState } from 'react'
import { Link2, RefreshCw, CheckCircle2, BookOpen, HelpCircle, ExternalLink } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
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

const platformManual: Array<{
  platform: SocialPlatform
  title: string
  consoleUrl: string
  credentials: string[]
  steps: string[]
  scopes: string[]
}> = [
  {
    platform: 'instagram',
    title: 'Instagram and Facebook via Meta Graph',
    consoleUrl: 'https://developers.facebook.com/',
    credentials: ['META_APP_ID', 'META_APP_SECRET', 'INSTAGRAM_BUSINESS_ACCOUNT_ID', 'INSTAGRAM_ACCESS_TOKEN'],
    steps: [
      'Create an app in Meta for Developers.',
      'Add Facebook Login and Instagram Graph API products.',
      'Connect a Facebook Page to the Instagram Business account.',
      'Generate a user token and exchange it for a long-lived token when needed.',
    ],
    scopes: ['instagram_basic', 'instagram_content_publish', 'instagram_manage_insights', 'pages_manage_posts'],
  },
  {
    platform: 'facebook',
    title: 'Facebook Pages via Meta Graph',
    consoleUrl: 'https://developers.facebook.com/',
    credentials: ['META_APP_ID', 'META_APP_SECRET', 'FACEBOOK_PAGE_ID', 'FACEBOOK_ACCESS_TOKEN'],
    steps: [
      'Create or reuse the Meta app used for Instagram.',
      'Add the Facebook Login product.',
      'Request permissions for page publishing and engagement access.',
      'Capture the Page ID and a valid page access token.',
    ],
    scopes: ['pages_show_list', 'pages_read_engagement', 'pages_manage_posts'],
  },
  {
    platform: 'linkedin',
    title: 'LinkedIn Organization API',
    consoleUrl: 'https://www.linkedin.com/developers/',
    credentials: ['LINKEDIN_CLIENT_ID', 'LINKEDIN_CLIENT_SECRET', 'LINKEDIN_ORGANIZATION_ID', 'LINKEDIN_ACCESS_TOKEN'],
    steps: [
      'Create an app in LinkedIn Developer Portal.',
      'Associate the app with a LinkedIn Page.',
      'Configure OAuth redirect URLs for local and production.',
      'Authorize and capture an access token for the organization.',
    ],
    scopes: ['r_liteprofile', 'w_member_social', 'rw_organization_admin', 'r_organization_social'],
  },
  {
    platform: 'youtube',
    title: 'YouTube Data API via Google Cloud',
    consoleUrl: 'https://console.cloud.google.com/',
    credentials: ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'YOUTUBE_CHANNEL_ID', 'YOUTUBE_ACCESS_TOKEN', 'YOUTUBE_REFRESH_TOKEN'],
    steps: [
      'Create a Google Cloud project.',
      'Enable YouTube Data API v3.',
      'Set up the OAuth consent screen and web credentials.',
      'Authorize the channel and store access plus refresh tokens.',
    ],
    scopes: ['youtube.readonly', 'youtube.upload', 'youtube.force-ssl'],
  },
  {
    platform: 'x',
    title: 'X API (Twitter)',
    consoleUrl: 'https://developer.x.com/',
    credentials: ['X_API_KEY', 'X_API_KEY_SECRET', 'X_BEARER_TOKEN', 'X_ACCESS_TOKEN', 'X_ACCESS_TOKEN_SECRET'],
    steps: [
      'Create a project and app in the X Developer Portal.',
      'Enable OAuth 1.0a and/or OAuth 2.0 based on your flow.',
      'Configure callback URLs and write permissions.',
      'Generate and store API keys, bearer token, and access tokens.',
    ],
    scopes: ['tweet.read', 'tweet.write', 'users.read', 'offline.access'],
  },
]

const socialFaq = [
  {
    question: 'Which environment variables should go to Vercel?',
    answer: 'All production credentials should be stored in Vercel Project Settings under Environment Variables, then redeployed.',
  },
  {
    question: 'Can I reuse the same credentials for local and production?',
    answer: 'Prefer separate app credentials for local, preview, and production to isolate quota, scopes, and security risk.',
  },
  {
    question: 'Why does a token work for reading data but fail to publish?',
    answer: 'Most platforms separate read scopes from publish scopes. Validate app permissions, organization ownership, and token expiration.',
  },
  {
    question: 'Where should API keys be configured inside the app?',
    answer: 'Use Social Hub for API onboarding. The content planning area should only consume connected channels, not collect credentials.',
  },
]

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

      <Card className="border-border/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BookOpen className="h-4 w-4" />
            API Keys Manual and FAQ
          </CardTitle>
          <CardDescription>
            Everything needed to collect credentials for each social network and configure them in Social Hub.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="manual" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="manual">Manual</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>

            <TabsContent value="manual" className="space-y-4">
              <div className="grid gap-4 xl:grid-cols-2">
                {platformManual.map((entry) => (
                  <Card key={entry.platform} className="border-border/80 bg-background/50">
                    <CardHeader>
                      <CardTitle className="text-base">{entry.title}</CardTitle>
                      <CardDescription>
                        <a
                          href={entry.consoleUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-primary hover:underline"
                        >
                          Open official console
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                      <div>
                        <p className="mb-2 font-medium text-foreground">Required credentials</p>
                        <div className="flex flex-wrap gap-2">
                          {entry.credentials.map((credential) => (
                            <span
                              key={`${entry.platform}-${credential}`}
                              className="rounded-full border border-border bg-card px-2 py-1 text-xs text-muted-foreground"
                            >
                              {credential}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="mb-2 font-medium text-foreground">Step-by-step</p>
                        <ol className="space-y-1 pl-5 text-muted-foreground">
                          {entry.steps.map((step) => (
                            <li key={`${entry.platform}-${step}`}>{step}</li>
                          ))}
                        </ol>
                      </div>

                      <div>
                        <p className="mb-2 font-medium text-foreground">Typical scopes</p>
                        <div className="flex flex-wrap gap-2">
                          {entry.scopes.map((scope) => (
                            <span
                              key={`${entry.platform}-${scope}`}
                              className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground"
                            >
                              {scope}
                            </span>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="faq" className="space-y-4">
              <div className="grid gap-4 lg:grid-cols-2">
                {socialFaq.map((entry) => (
                  <Card key={entry.question} className="border-border/80 bg-background/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <HelpCircle className="h-4 w-4" />
                        {entry.question}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{entry.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
