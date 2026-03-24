# CLAUDE.md - Heuriskein Content Dashboard Documentation

## Project Overview

**Heuriskein Content Dashboard** is a modern, multi-platform content management system built with Next.js, Tailwind CSS, and shadcn/ui components. It provides comprehensive tools for managing Instagram content, analytics, content calendars, competitor tracking, and industry news consolidation.

**Project Type:** Enterprise Dashboard  
**Version:** 1.0.0  
**Status:** Initial Setup Complete

---

## 🏗️ Architecture & Tech Stack

### Core Framework
- **Next.js 14** - React framework for production applications
  - Server-side rendering (SSR) capabilities
  - File-based routing system
  - Built-in optimization (Image, Font, Code Splitting)
  - API routes ready for future backend integration

- **React 18** - UI library
  - Functional components with hooks
  - Client-side state management (useState, useContext)
  - Suspense-ready for streaming responses

### Styling & UI
- **Tailwind CSS 3.4** - Utility-first CSS framework
  - Dark theme enforced globally via CSS variables
  - Custom color palette optimized for brand consistency
  - Responsive design patterns (mobile-first)
  - Smooth transitions and animations

- **shadcn/ui** - High-quality component library
  - Headless UI components built on Radix UI primitives
  - Customizable and composable
  - Accessibility-first approach
  - Components: Card, Button, Tabs, Badge

### Data Visualization
- **Recharts 2.10** - React charting library
  - Line charts for trends (Engagement, Impressions)
  - Bar charts for comparisons
  - Pie charts for distribution
  - Responsive and dark-theme compatible

### Supporting Libraries
- **Lucide React** - Icon library (24x24 professionally designed icons)
- **Radix UI** - Low-level UI component primitives
  - Tabs component foundation (accessible)
  - Dialog, Dropdown, Select, Popover (future use)
  
- **TypeScript 5.0** - Static type checking
  - Strict mode enabled
  - Type safety across components
  - Better IDE support and refactoring

- **class-variance-authority (CVA)** - Component styling patterns
  - Compound variant management
  - Type-safe style composition
  
- **clsx + tailwind-merge** - Utility functions
  - Smart className merging
  - Prevents Tailwind conflicts

---

## 📁 Folder Structure

```
heuriskein-content-OS/
├── app/                          # Next.js app directory (routing)
│   ├── layout.tsx               # Root layout with sidebar
│   ├── globals.css              # Global styles (Tailwind directives)
│   ├── page.tsx                 # Dashboard home page
│   ├── instagram/
│   │   └── page.tsx             # Instagram Manager
│   ├── analytics/
│   │   └── page.tsx             # Analytics Dashboard
│   ├── calendar/
│   │   └── page.tsx             # Content Calendar
│   ├── competitors/
│   │   └── page.tsx             # Competitor Tracker
│   └── news/
│       └── page.tsx             # News Consolidator
│
├── components/                   # Reusable React components
│   ├── Sidebar.tsx              # Navigation sidebar (client)
│   └── ui/                       # shadcn/ui components
│       ├── Card.tsx             # Card container (with Header, Title, Desc, Content, Footer)
│       ├── Button.tsx           # Button with variants
│       ├── Tabs.tsx             # Tabs component (accessible)
│       └── Badge.tsx            # Badge/label component
│
├── lib/                          # Utility functions & helpers
│   └── utils.ts                 # cn() - className merger
│
├── package.json                 # Project dependencies
├── next.config.js              # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── postcss.config.js           # PostCSS configuration
└── PROJECT_GUIDE.md            # Original project requirements

```

---

## 🎨 Design System & Theme

### Color Palette (Dark Theme)

All colors defined as CSS variables in `app/globals.css` for easy management:

```css
--background: 0 0% 3.6%      /* Very dark gray (#0a0a0a) */
--foreground: 0 0% 98%        /* Very light gray (#fafafa) */
--card: 0 0% 8.7%             /* Card background (#161616) */
--primary: 215.4 16.3% 56.9%  /* Blue accent */
--destructive: 0 84.2% 60.2%  /* Red for danger states */
--muted: 0 0% 28.5%           /* Gray for secondary elements */
--border: 0 0% 14.9%          /* Border color */
```

### Component Styling Classes

**Utility classes** defined in Tailwind's `@layer components`:
- `.card-container` - Standard card styling with border, shadow, padding
- `.section-title` - Large section headers (h1-equivalent)
- `.subsection-title` - Smaller section headers (h2-equivalent)

### Dark Mode Implementation

- Applied globally via `<html className="dark">` in root layout
- Tailwind generates dark mode utilities automatically
- All shadcn/ui components inherit dark theme via CSS variables

---

## 📄 Component Conventions

### File Organization

1. **Layout Components** - Wrapper components (Sidebar, MainLayout)
   - Location: `/components` root
   - Export as default
   - Handle global state/context if needed

2. **Feature Components** - Page-specific components
   - Location: Within page directories or `/components`
   - Named exports recommended
   - Self-contained with minimal props

3. **UI Components** - Reusable design system components
   - Location: `/components/ui`
   - Based on shadcn/ui patterns
   - Use `forwardRef` for element access
   - Include TypeScript interfaces

### Component Patterns

#### Card Pattern
```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content here</CardContent>
</Card>
```

#### Button Pattern
```tsx
import { Button } from '@/components/ui/Button'

<Button variant="default" size="md">Click Me</Button>
<Button variant="outline" size="sm">Outline</Button>
```

#### Tabs Pattern
```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'

<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  <TabsContent value="tab2">Content 2</TabsContent>
</Tabs>
```

### Client vs Server Components

- **Server Components** (default in Next.js 14)
  - Use for static content, data fetching
  - Layout components
  
- **Client Components** (marked with `'use client'`)
  - `Sidebar.tsx` - Uses `usePathname()` for routing
  - All analytics/calendar pages - Interactive features
  - Recommended for interactive widgets

---

## 🛣️ Routing Structure

The application uses Next.js file-based routing:

| Path | Component | Purpose |
|------|-----------|---------|
| `/` | `app/page.tsx` | Dashboard overview with stats |
| `/instagram` | `app/instagram/page.tsx` | Instagram Manager (Scheduled, Drafts, Published, Backlog) |
| `/analytics` | `app/analytics/page.tsx` | Analytics with charts (Impressions, Engagement, Platform) |
| `/calendar` | `app/calendar/page.tsx` | Content Calendar with monthly view |
| `/competitors` | `app/competitors/page.tsx` | Competitor tracking and benchmarks |
| `/news` | `app/news/page.tsx` | News consolidator with curated feeds |

All pages share the same layout via `app/layout.tsx` which includes:
- Root `<html>` with dark mode
- Sidebar navigation
- Main content area

---

## 🔧 Key Implementation Decisions

### 1. **Dark Theme Enforcement**
- Applied at HTML root level: `<html className="dark">`
- No light mode toggle (per requirements)
- CSS variables for maintainability
- Reduces eye strain in professional dashboard settings

### 2. **Sidebar Navigation**
- Fixed width (w-64) with responsive collapse potential
- Client component to use `usePathname()` hook
- Active state styling (primary background on current route)
- Brand logo at top with version in footer

### 3. **Card-Based Layouts**
- Consistent visual hierarchy
- Easy scanning and information organization
- Borders and subtle shadows for depth
- Padding standardized (p-6)

### 4. **Component Composition**
- shadcn/ui as foundation (not reinventing wheels)
- Custom components built via composition
- `cn()` utility for safe className merging
- Avoid className conflicts with `tailwind-merge`

### 5. **TypeScript Strict Mode**
- Catch errors at development time
- Better IDE autocomplete
- Improved refactoring safety
- Required for production-grade applications

### 6. **No API Integration (Yet)**
- Mock data used throughout pages
- Next.js API routes ready at `/app/api/` (future)
- Components designed to accept prop-based data
- Easy to swap mock data with real API calls

### 7. **Accessibility (a11y)**
- Radix UI primitives ensure keyboard navigation
- Semantic HTML structure (Card, Button with correct elements)
- ARIA attributes via Radix UI
- Color contrast meets WCAG standards (dark theme)

---

## 📊 Page Features Implemented

### Dashboard (Home)
- Quick stats with icon indicators
- Quick actions panel
- System status monitor
- Status indicators (green/red dots)

### Instagram Manager
- Tabbed interface (Scheduled, Drafts, Published, Backlog)
- Post cards with caption, type, status, date
- Edit/Preview quick actions
- Summary stats (Total Posts, Engagement, Best Performer)

### Analytics Dashboard
- 4 key metric cards (Impressions, Engagement, Follower Growth, Reach)
- Impressions bar chart (recharts)
- Engagement rate line chart
- Platform distribution pie chart
- Top performing posts ranked list

### Content Calendar
- Monthly calendar grid view
- Posts shown as colored chips by platform
- Previous/Next month navigation
- Platform filter tabs
- Legend with platform stats
- Upcoming posts section

### Competitor Tracker
- Competitor overview cards
- Metrics: Followers, Engagement Rate, Posts
- Trending indicators (↗↘)
- Market leaders ranking
- Engagement leaders ranking
- Industry benchmarks

### News Consolidator
- Tabbed news feed (All, Trends, Product, Insights)
- Article cards with thumbnail placeholder
- Source, date, category badge
- Tags for filtering
- Actions: Read More, Save, Share
- Trending topics widget
- Newsletter subscriptions

---

## 🚀 Development Setup & Workflow

### Prerequisites
- Node.js 18+ (for Next.js 14)
- npm or yarn package manager

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
# Opens http://localhost:3000

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

### Development Workflow
1. Create new routes in `/app` directory
2. Use existing UI components from `/components/ui`
3. Follow `'use client'` pattern for interactive features
4. Use Tailwind classes for styling
5. TypeScript ensures type safety during development

### Component Development Checklist
- [ ] Create component file in appropriate folder
- [ ] Define TypeScript interfaces for props
- [ ] Use `forwardRef` if exposing HTML elements
- [ ] Apply dark theme colors via CSS variables
- [ ] Test responsive design (mobile, tablet, desktop)
- [ ] Ensure keyboard navigation works
- [ ] Add to appropriate index/export if needed

---

## 📦 Future Enhancements

### Short-term (Phase 2)
- [ ] Backend API integration (@/api routes)
- [ ] Real data source connections (Instagram API, Metricool)
- [ ] Database setup (PostgreSQL/Supabase)
- [ ] Authentication system (NextAuth.js)
- [ ] Search functionality (news, competitor data)
- [ ] Export features (PDF, CSV)

### Medium-term (Phase 3)
- [ ] User preferences/settings page
- [ ] Notification system
- [ ] Real-time updates (WebSocket/polling)
- [ ] Advanced filtering and sorting
- [ ] Report generation
- [ ] Scheduled post automation

### Long-term (Phase 4)
- [ ] AI-powered content suggestions
- [ ] Sentiment analysis integration
- [ ] Multi-user collaboration features
- [ ] Role-based access control (RBAC)
- [ ] White-label capabilities
- [ ] Mobile app (React Native)

---

## 🔐 Security Considerations

- **TypeScript Strict Mode** - Prevents runtime type errors
- **No Hardcoded Secrets** - Ready for environment variables
- **CORS Headers** - Configure in `next.config.js` when needed
- **Dependency Updates** - Run `npm audit` regularly
- **Input Validation** - Prep components for user input handling

### Environment Variables
Create `.env.local` for sensitive data:
```
NEXT_PUBLIC_API_BASE=https://api.example.com
API_SECRET_KEY=your_secret_key
DATABASE_URL=postgres://...
```

---

## 📝 Code Quality Standards

### TypeScript
- Strict mode enabled in `tsconfig.json`
- Explicit return types on functions
- Avoid `any` type - use `unknown` if necessary

### Styling
- Use Tailwind utilities over custom CSS
- Respect dark theme color variables
- Use `cn()` utility for conditional classes
- Mobile-first responsive design

### Components
- Single responsibility principle
- Props over global state when possible
- Descriptive component names
- JSDoc comments for complex logic

### File Naming
- Components: PascalCase (`Sidebar.tsx`, `Card.tsx`)
- Utilities: camelCase (`utils.ts`, `constants.ts`)
- Pages: lowercase or match route (`page.tsx`)

---

## 🤝 Contribution Guidelines

### Adding a New Feature Page
1. Create folder in `/app/feature-name/`
2. Create `page.tsx` with `'use client'` if interactive
3. Use existing Card/Button/Tabs components
4. Follow dark theme color scheme
5. Add navigation link to `Sidebar.tsx`
6. Document feature in this file

### Adding UI Components
1. Create file in `/components/ui/ComponentName.tsx`
2. Base on shadcn/ui patterns when possible
3. Include TypeScript props interface
4. Use `forwardRef` for HTML elements
5. Export from component file

---

## 📚 Resources & Documentation

- **Next.js**: https://nextjs.org/docs
- **React**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com/docs
- **shadcn/ui**: https://ui.shadcn.com
- **Radix UI**: https://www.radix-ui.com
- **Recharts**: https://recharts.org
- **TypeScript**: https://www.typescriptlang.org/docs

---

## 📋 Checklist for Production Deployment

- [ ] Environment variables configured
- [ ] API endpoints connected to real backend
- [ ] Authentication implemented
- [ ] Error handling and error boundaries added
- [ ] Loading states implemented
- [ ] Performance optimized (images, lazy loading)
- [ ] SEO meta tags added
- [ ] Analytics tracking set up
- [ ] Security headers configured
- [ ] Rate limiting implemented
- [ ] Monitoring and logging in place
- [ ] Backup and disaster recovery planned

---

## 📞 Support & Troubleshooting

### Common Issues

**Issue**: Tailwind styles not applying
- **Solution**: Verify `tailwind.config.ts` content paths
- Rebuild CSS: `npm run dev` should auto-reload

**Issue**: Dark mode not working
- **Solution**: Check `<html className="dark">` in `layout.tsx`
- Verify CSS variables defined in `globals.css`

**Issue**: Icons not showing (Lucide React)
- **Solution**: Ensure Lucide package installed: `npm install lucide-react`
- Check icon name spelling

**Issue**: Component not re-rendering
- **Solution**: Add `'use client'` if using hooks (useState, useEffect)
- Check React DevTools for state updates

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024-04-12 | Initial setup with all core features |

---

**Last Updated**: April 12, 2024  
**Maintained By**: Development Team  
**License**: See LICENSE file
