import { Competitor } from './types'

export const mockCompetitors: Competitor[] = [
  {
    id: '1',
    name: 'Brand Fashion Co',
    handle: '@brandfashion_co',
    platform: 'instagram',
    metrics: {
      followers: 245600,
      followerGrowthRate: 5.2,
      monthlyFollowerChange: 12400,
      avgEngagementRate: 7.2,
      avgEngagementCount: 18500,
      totalPosts: 156,
      avgPostsPerWeek: 3.2,
      responseTime: 2.5,
      topPostEngage: 22400,
      topPostCaption: 'Summer Sale Announcement #FashionWeek',
    },
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Style Hub Media',
    handle: '@stylehub_media',
    platform: 'instagram',
    metrics: {
      followers: 189400,
      followerGrowthRate: 3.8,
      monthlyFollowerChange: 8900,
      avgEngagementRate: 5.8,
      avgEngagementCount: 15200,
      totalPosts: 142,
      avgPostsPerWeek: 2.8,
      responseTime: 3.2,
      topPostEngage: 19800,
      topPostCaption: 'New Product Launch - Limited Edition',
    },
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Luxury Lifestyle Trends',
    handle: '@luxury_lifestyle_trends',
    platform: 'instagram',
    metrics: {
      followers: 312400,
      followerGrowthRate: 6.8,
      monthlyFollowerChange: 15600,
      avgEngagementRate: 9.1,
      avgEngagementCount: 24100,
      totalPosts: 189,
      avgPostsPerWeek: 4.1,
      responseTime: 1.8,
      topPostEngage: 28500,
      topPostCaption: 'Behind the Scenes - Exclusive Content',
    },
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Urban Fashion Daily',
    handle: '@urban_fashion_daily',
    platform: 'instagram',
    metrics: {
      followers: 98400,
      followerGrowthRate: -1.2,
      monthlyFollowerChange: -2100,
      avgEngagementRate: 4.3,
      avgEngagementCount: 8900,
      totalPosts: 98,
      avgPostsPerWeek: 2.0,
      responseTime: 5.4,
      topPostEngage: 12300,
      topPostCaption: 'Customer Testimonial - Happy Customers',
    },
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'TrendSetters Collective',
    handle: '@trendsetters_collective',
    platform: 'instagram',
    metrics: {
      followers: 156800,
      followerGrowthRate: 4.5,
      monthlyFollowerChange: 6700,
      avgEngagementRate: 6.5,
      avgEngagementCount: 16200,
      totalPosts: 127,
      avgPostsPerWeek: 2.5,
      responseTime: 2.9,
      topPostEngage: 20100,
      topPostCaption: 'Collaboration with Top Influencers',
    },
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Style Revolution',
    handle: '@style_revolution',
    platform: 'instagram',
    metrics: {
      followers: 278900,
      followerGrowthRate: 5.9,
      monthlyFollowerChange: 14200,
      avgEngagementRate: 8.3,
      avgEngagementCount: 21500,
      totalPosts: 164,
      avgPostsPerWeek: 3.4,
      responseTime: 2.2,
      topPostEngage: 25600,
      topPostCaption: 'Sustainable Fashion Initiative',
    },
    lastUpdated: new Date().toISOString(),
  },
]

export const industryBenchmarks = {
  avgFollowerGrowthRate: 4.1,
  avgEngagementRate: 6.9,
  avgPostsPerWeek: 3.0,
  avgResponseTime: 2.8,
  avgFollowersIndustry: 213733,
}

export function calculateBenchmarks() {
  const totalFollowers = mockCompetitors.reduce((sum, c) => sum + c.metrics.followers, 0)
  const totalEngagement = mockCompetitors.reduce((sum, c) => sum + c.metrics.avgEngagementRate, 0)
  const totalPostsPerWeek = mockCompetitors.reduce((sum, c) => sum + c.metrics.avgPostsPerWeek, 0)
  const totalResponseTime = mockCompetitors.reduce((sum, c) => sum + c.metrics.responseTime, 0)
  const totalFollowerGrowth = mockCompetitors.reduce((sum, c) => sum + c.metrics.followerGrowthRate, 0)

  const count = mockCompetitors.length

  return {
    avgFollowerGrowthRate: +(totalFollowerGrowth / count).toFixed(2),
    avgEngagementRate: +(totalEngagement / count).toFixed(2),
    avgPostsPerWeek: +(totalPostsPerWeek / count).toFixed(2),
    avgResponseTime: +(totalResponseTime / count).toFixed(1),
    avgFollowersIndustry: Math.floor(totalFollowers / count),
  }
}
