# Social API Keys Manual

This guide explains how to get API keys and access credentials for each social platform used by the dashboard.

## Goal
Use this checklist to collect credentials for:
- Instagram (Meta Graph)
- Facebook (Meta Graph)
- LinkedIn
- YouTube (Google)
- X (Twitter)

## Important Notes
- Use a dedicated company admin account when possible.
- Save all credentials in a secure secret manager.
- Never paste production keys into chat or source code.
- Use separate apps/projects for dev and production.

## Environment Variables (Recommended)
Use these names in your `.env.local` (or Vercel Project Environment Variables):

```bash
# Instagram / Facebook (Meta)
META_APP_ID=
META_APP_SECRET=
META_GRAPH_API_VERSION=v21.0
INSTAGRAM_BUSINESS_ACCOUNT_ID=
INSTAGRAM_ACCESS_TOKEN=
FACEBOOK_PAGE_ID=
FACEBOOK_ACCESS_TOKEN=

# LinkedIn
LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=
LINKEDIN_ORGANIZATION_ID=
LINKEDIN_ACCESS_TOKEN=

# YouTube / Google
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_PROJECT_ID=
YOUTUBE_CHANNEL_ID=
YOUTUBE_ACCESS_TOKEN=
YOUTUBE_REFRESH_TOKEN=

# X (Twitter)
X_API_KEY=
X_API_KEY_SECRET=
X_BEARER_TOKEN=
X_ACCESS_TOKEN=
X_ACCESS_TOKEN_SECRET=
```

## 1. Instagram and Facebook (Meta Graph API)
Official console: Meta for Developers.

### Step-by-step
1. Log in to Meta for Developers and create a new App.
2. Select an app type that supports business integrations.
3. Add products: Facebook Login and Instagram Graph API (and Marketing API if needed).
4. Connect your Facebook Page to your Instagram Business account in Meta Business Manager.
5. Generate a user access token with required permissions.
6. Exchange for long-lived token if your flow requires it.
7. Capture these values:
- App ID -> `META_APP_ID`
- App Secret -> `META_APP_SECRET`
- Instagram Business Account ID -> `INSTAGRAM_BUSINESS_ACCOUNT_ID`
- Page ID -> `FACEBOOK_PAGE_ID`
- Access tokens -> `INSTAGRAM_ACCESS_TOKEN` and/or `FACEBOOK_ACCESS_TOKEN`

### Common permission scopes
- `pages_show_list`
- `pages_read_engagement`
- `pages_manage_posts`
- `instagram_basic`
- `instagram_content_publish`
- `instagram_manage_insights`

## 2. LinkedIn API
Official console: LinkedIn Developer Portal.

### Step-by-step
1. Create an app in LinkedIn Developer Portal.
2. Associate the app with your LinkedIn Page (organization).
3. Configure OAuth redirect URLs.
4. Request needed products/permissions.
5. Generate OAuth access token.
6. Capture these values:
- Client ID -> `LINKEDIN_CLIENT_ID`
- Client Secret -> `LINKEDIN_CLIENT_SECRET`
- Organization ID -> `LINKEDIN_ORGANIZATION_ID`
- Access token -> `LINKEDIN_ACCESS_TOKEN`

### Common permission scopes
- `r_liteprofile`
- `r_emailaddress`
- `w_member_social`
- `rw_organization_admin`
- `r_organization_social`

## 3. YouTube API (Google Cloud)
Official console: Google Cloud Console.

### Step-by-step
1. Create a Google Cloud project.
2. Enable YouTube Data API v3.
3. Configure OAuth consent screen.
4. Create OAuth 2.0 credentials (Web Application).
5. Add authorized redirect URIs.
6. Authorize and obtain access + refresh token.
7. Capture these values:
- Client ID -> `GOOGLE_CLIENT_ID`
- Client Secret -> `GOOGLE_CLIENT_SECRET`
- Project ID -> `GOOGLE_PROJECT_ID`
- Channel ID -> `YOUTUBE_CHANNEL_ID`
- Access token -> `YOUTUBE_ACCESS_TOKEN`
- Refresh token -> `YOUTUBE_REFRESH_TOKEN`

### Common scopes
- `https://www.googleapis.com/auth/youtube.readonly`
- `https://www.googleapis.com/auth/youtube.upload`
- `https://www.googleapis.com/auth/youtube.force-ssl`

## 4. X API (Twitter)
Official console: X Developer Portal.

### Step-by-step
1. Create a Project and App in X Developer Portal.
2. Enable OAuth 1.0a and/or OAuth 2.0 depending on your integration.
3. Configure callback URL and app permissions.
4. Generate API keys and tokens.
5. Capture these values:
- API Key -> `X_API_KEY`
- API Key Secret -> `X_API_KEY_SECRET`
- Bearer Token -> `X_BEARER_TOKEN`
- Access Token -> `X_ACCESS_TOKEN`
- Access Token Secret -> `X_ACCESS_TOKEN_SECRET`

### Common scopes
- `tweet.read`
- `tweet.write`
- `users.read`
- `offline.access`

## Validation Checklist (All Networks)
1. Token works in a basic profile endpoint call.
2. Token can publish a test post in sandbox or test account.
3. Token has expiry policy documented.
4. Refresh flow tested where required.
5. Credentials stored in Vercel environment variables.
6. Local `.env.local` only used for development.

## Vercel Setup
1. Open Vercel project -> Settings -> Environment Variables.
2. Add the variables listed in this guide.
3. Apply to Preview and Production as needed.
4. Redeploy after updating secrets.

## Security Best Practices
- Rotate secrets on schedule.
- Limit scopes to minimum needed.
- Use service accounts only where platform allows.
- Do not commit `.env.local`.
- Audit token usage and failed auth logs.

## Troubleshooting
- 401 Unauthorized: token expired, wrong scope, or wrong app environment.
- 403 Forbidden: permission not approved for your app.
- 400 Bad Request: invalid account/page/channel ID.
- Publish succeeds in one network but not others: verify per-platform scope and organization/page ownership.

## Chat Access Note
This file is designed for direct chat access in the repository. Ask for:
- "open Social API Keys Manual"
- "show steps for LinkedIn keys"
- "show required scopes for YouTube"
