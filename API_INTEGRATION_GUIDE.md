# API Integration Guide - Competitor Tracker & Instagram Manager

## Overview

This guide documents the API integration for the Heuriskein Content Dashboard, focusing on:
1. **Competitor Tracker** - Real-time competitor metrics and benchmarking
2. **Instagram Manager** - Content management with persistence

---

## Architecture

### Data Flow

```
Frontend (React Components)
    ↓
Client API Layer (/lib/competitors/api.ts, /lib/instagram/api.ts)
    ↓
Next.js API Routes (/app/api/competitors/*, /app/api/instagram-posts/*)
    ↓
Repository Layer (/lib/competitors/repository.ts, /lib/instagram/repository.ts)
    ↓
Data Sources (Mock Data, Supabase, Future APIs)
```

### File Organization

```
lib/
├── content/
│   ├── types.ts                    # Shared type definitions
│   ├── schemas.ts                  # Zod validation schemas
│   ├── mock-instagram-posts.ts     # Instagram mock data
│   └── mock-competitors.ts         # Competitor mock data
├── competitors/
│   ├── api.ts                      # Client-side API functions
│   └── repository.ts               # Server-side data access
├── instagram/
│   ├── api.ts                      # Client-side API functions
│   └── repository.ts               # Server-side data access
└── supabase/
    ├── client.ts                   # Browser-safe Supabase client
    ├── server.ts                   # Server-side Supabase client
    └── config.ts                   # Configuration

app/api/
├── competitors/
│   ├── route.ts                    # GET /api/competitors
│   ├── [id]/
│   │   └── route.ts                # GET /api/competitors/:id
│   └── benchmarks/
│       └── route.ts                # GET /api/competitors/benchmarks
└── instagram-posts/
    ├── route.ts                    # GET/POST /api/instagram-posts
    └── [id]/
        └── route.ts                # PATCH/DELETE /api/instagram-posts/:id
```

---

## Competitor Tracker API

### Types

```typescript
interface CompetitorMetrics {
  followers: number
  followerGrowthRate: number          // percentage
  monthlyFollowerChange: number
  avgEngagementRate: number           // percentage
  avgEngagementCount: number
  totalPosts: number
  avgPostsPerWeek: number
  responseTime: number                // in hours
  topPostEngage: number
  topPostCaption: string
}

interface Competitor {
  id: string
  name: string
  handle: string
  platform: ContentPlatform
  metrics: CompetitorMetrics
  lastUpdated: string
}

interface IndustryBenchmark {
  avgFollowerGrowthRate: number
  avgEngagementRate: number
  avgPostsPerWeek: number
  avgResponseTime: number
  avgFollowersIndustry: number
}
```

### API Endpoints

#### GET `/api/competitors`
Fetch all competitors.

**Response:**
```json
{
  "competitors": [
    {
      "id": "1",
      "name": "Brand Fashion Co",
      "handle": "@brandfashion_co",
      "platform": "instagram",
      "metrics": {
        "followers": 245600,
        "followerGrowthRate": 5.2,
        "avgEngagementRate": 7.2,
        "totalPosts": 156,
        // ... more metrics
      },
      "lastUpdated": "2024-04-13T12:00:00Z"
    }
  ]
}
```

#### GET `/api/competitors?metric=followers|engagementRate|growthRate`
Fetch competitors ranked by specific metric (descending).

**Query Parameters:**
- `metric` (optional): `'followers'`, `'engagementRate'`, or `'growthRate'`

#### GET `/api/competitors/:id`
Fetch a specific competitor by ID.

**Response:** Single `Competitor` object

**Error Response (404):**
```json
{ "error": "Competitor not found" }
```

#### GET `/api/competitors/benchmarks`
Fetch industry benchmarks.

**Response:**
```json
{
  "benchmarks": {
    "avgEngagementRate": 6.9,
    "avgPostsPerWeek": 3.0,
    "avgResponseTime": 2.8,
    "avgFollowerGrowthRate": 4.1,
    "avgFollowersIndustry": 213733
  }
}
```

### Client Usage

```typescript
// Fetch all competitors
const competitors = await fetchCompetitors()

// Fetch a specific competitor
const competitor = await fetchCompetitorById('1')

// Fetch industry benchmarks
const benchmarks = await fetchIndustryBenchmarks()

// Fetch competitors ranked by metric
const byFollowers = await fetchCompetitorsByRank('followers')
const byEngagement = await fetchCompetitorsByRank('engagementRate')
const byGrowth = await fetchCompetitorsByRank('growthRate')
```

### Repository Functions (Server-side)

```typescript
// Fetch all competitors
const competitors = await listCompetitors()

// Get specific competitor
const competitor = await getCompetitorById('1')

// Get industry benchmarks
const benchmarks = await getIndustryBenchmarks()

// Get competitors ranked by metric
const ranked = await getCompetitorsByRank('followers', 'desc')

// Update competitor metrics
const updated = updateCompetitorMetrics(competitors, '1', {
  followers: 250000,
  avgEngagementRate: 7.5
})

// Simulate metrics update (for demo purposes)
const simulated = simulateMetricsUpdate(competitors)
```

---

## Instagram Manager API

### Types

```typescript
interface InstagramPostMetrics {
  impressions: number
  engagementRate: number
  likes: number
  comments: number
  shares: number
  reach: number
}

interface InstagramPost {
  id: string
  platform: 'instagram'
  title: string
  caption: string
  postType: InstagramPostType    // 'image' | 'video' | 'carousel' | 'reel' | 'story'
  status: InstagramPostStatus    // 'draft' | 'scheduled' | 'published' | 'backlog'
  scheduledFor: string | null
  publishedAt: string | null
  metrics: InstagramPostMetrics
  createdAt: string
  updatedAt: string
}

interface CreateInstagramPostInput {
  title?: string
  caption: string
  postType: InstagramPostType
  status: InstagramPostStatus
  scheduledFor?: string | null
  publishedAt?: string | null
}

interface UpdateInstagramPostInput {
  title?: string
  caption?: string
  postType?: InstagramPostType
  status?: InstagramPostStatus
  scheduledFor?: string | null
  publishedAt?: string | null
}
```

### API Endpoints

#### GET `/api/instagram-posts`
Fetch all Instagram posts.

**Response:**
```json
{
  "posts": [
    {
      "id": "seed-1",
      "platform": "instagram",
      "title": "Beautiful sunset over the mountains",
      "caption": "Golden hour magic ✨...",
      "postType": "image",
      "status": "scheduled",
      "scheduledFor": "2024-04-15T10:00:00Z",
      "publishedAt": null,
      "metrics": {
        "impressions": 3200,
        "engagementRate": 4.6,
        "likes": 480,
        "comments": 32,
        "shares": 18,
        "reach": 2800
      },
      "createdAt": "2024-04-10T10:00:00Z",
      "updatedAt": "2024-04-10T10:00:00Z"
    }
  ]
}
```

#### POST `/api/instagram-posts`
Create a new Instagram post.

**Request:**
```json
{
  "caption": "Beautiful sunset photo",
  "postType": "image",
  "status": "draft",
  "title": "Sunset Photography"
}
```

**Response:** Single `InstagramPost` object

#### PATCH `/api/instagram-posts/:id`
Update an existing post.

**Request:** Partial `UpdateInstagramPostInput`

**Response:** Updated `InstagramPost` object

#### DELETE `/api/instagram-posts/:id`
Delete a post.

**Response:** `{ }`

### Client Usage

```typescript
// Fetch all posts
const posts = await fetchInstagramPosts()

// Create new post
const newPost = await createInstagramPostRequest({
  caption: 'Amazing content!',
  postType: 'image',
  status: 'draft'
})

// Update post
const updated = await updateInstagramPostRequest('seed-1', {
  status: 'published',
  publishedAt: new Date().toISOString()
})

// Delete post
await deleteInstagramPostRequest('seed-1')
```

---

## Mock Data Strategy

### Current Implementation

Both Competitor Tracker and Instagram Manager use **mock data** stored in:
- `lib/content/mock-competitors.ts` - 6 realistic competitor profiles
- `lib/content/mock-instagram-posts.ts` - 10 realistic Instagram posts

### Mock Data Features

#### Competitors
- Realistic follower counts (98K - 312K)
- Varying engagement rates (4.3% - 9.1%)
- Growth rate trends (negative to positive)
- Authentic metric calculations
- `calculateBenchmarks()` function for industry averages

#### Instagram Posts
- 10 diverse post types (image, video, carousel, reel, story)
- Realistic captions with hashtags and emojis
- Different statuses (draft, scheduled, published, backlog)
- Authentic metrics for published posts
- Dates spanning 2 weeks for realistic calendar view

### Extending with Real Data

To integrate with real Instagram API or other data sources:

#### Option 1: Environment-based Switching
```typescript
// In repository.ts
if (process.env.USE_REAL_API === 'true') {
  // Fetch from Instagram Graph API
  return await fetchFromInstagramAPI()
} else {
  // Use mock data
  return mockCompetitors
}
```

#### Option 2: Supabase Integration
```typescript
// In repository.ts
if (isSupabaseConfigured()) {
  // Fetch from database
  const { data } = await supabase.from('competitors').select('*')
  return data
} else {
  // Fall back to mock data
  return mockCompetitors
}
```

#### Option 3: API Proxy
```typescript
// Create wrapper functions
async function fetchCompetitorsFromExternalAPI() {
  const response = await fetch('https://analytics-api.com/competitors')
  return response.json()
}
```

---

## Error Handling

All API routes use consistent error handling:

```typescript
async function parseResponse<T>(response: Response): Promise<T> {
  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    const message = payload?.error || 'Request failed'
    throw new Error(message)
  }

  return payload as T
}
```

### Common Error Responses

| Status | Error | Cause |
|--------|-------|-------|
| 400 | "Invalid metric" | Invalid query parameter |
| 404 | "Competitor not found" | ID doesn't exist |
| 500 | "Internal server error" | Server-side exception |

---

## Performance Considerations

### Caching Strategy

All client API calls use `cache: 'no-store'` to always fetch fresh data:

```typescript
const response = await fetch('/api/instagram-posts', {
  cache: 'no-store'
})
```

### Future Optimizations

1. **Implement ISR** (Incremental Static Regeneration) for competitors
2. **Add pagination** for large competitor lists
3. **Cache benchmarks** (updates daily/weekly)
4. **Implement real-time updates** with WebSocket for new posts
5. **Add filtering/search** on API endpoints

---

## Security Considerations

### Current State
- Mock data is public and safe
- No authentication required (demo mode)

### When Integrating Real Data

1. **Add authentication** check in API routes
2. **Validate input** using Zod schemas
3. **Rate limit** API endpoints
4. **Sanitize user input** (captions, user-provided data)
5. **Protect sensitive metrics** (don't expose confidential data)

---

## Development Workflow

### Adding a New Field to Competitors

1. **Update type** in `lib/content/types.ts`
2. **Update mock data** in `lib/content/mock-competitors.ts`
3. **Update repository** functions if needed in `lib/competitors/repository.ts`
4. **Update frontend component** to display new field
5. **Test API response** with `fetchCompetitors()`

### Adding a New Post Status

1. **Update `INSTAGRAM_POST_STATUSES`** in `lib/content/types.ts`
2. **Update mock posts** with examples of new status
3. **Update frontend filters/controls** in Instagram Manager
4. **Update API** if status affects logic (e.g., scheduling)

---

## Testing

### Manual Testing

```bash
# Fetch all competitors
curl http://localhost:3000/api/competitors

# Fetch specific competitor
curl http://localhost:3000/api/competitors/1

# Fetch benchmarks
curl http://localhost:3000/api/competitors/benchmarks

# Fetch ranked by engagement
curl 'http://localhost:3000/api/competitors?metric=engagementRate'

# Fetch all Instagram posts
curl http://localhost:3000/api/instagram-posts

# Create new post
curl -X POST http://localhost:3000/api/instagram-posts \
  -H 'Content-Type: application/json' \
  -d '{
    "caption": "Test post",
    "postType": "image",
    "status": "draft"
  }'
```

---

## Future Enhancements

1. **Real Instagram API Integration**
   - Use Instagram Graph API with proper authentication
   - Implement token refresh mechanism
   - Schedule post publishing

2. **Advanced Analytics**
   - Add sentiment analysis for comments
   - Implement AI-powered suggestions
   - Real-time post performance tracking

3. **Competitor Insights**
   - Automated competitor monitoring
   - Historical trend analysis
   - Predictive engagement forecasting

4. **Multi-platform Support**
   - TikTok, YouTube, LinkedIn data
   - Unified cross-platform dashboard
   - Platform-specific insights

5. **Collaboration Features**
   - Team comments on posts
   - Approval workflows
   - Real-time notifications

---

## References

- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Supabase Documentation](https://supabase.com/docs)
- [Instagram Graph API](https://developers.facebook.com/docs/instagram-graph-api)
- [Zod Validation](https://zod.dev)

---

**Last Updated:** April 13, 2024  
**Maintained By:** Development Team
