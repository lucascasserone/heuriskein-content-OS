# Heuriskein Content Management Dashboard

A modern, feature-rich content management dashboard for multi-platform content creators and brands. Built with Next.js 14, Tailwind CSS, and shadcn/ui components.

![Version](https://img.shields.io/badge/version-1.2.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)

## 🎯 Features

### 📱 Instagram Manager
- Manage scheduled posts, drafts, and published content
- Organize posts by status with detailed metadata
- Quick edit and preview actions
- Import posts from template (CSV/XLSX)
- Download ready-to-use import template
- Connect Instagram account and publish directly from dashboard (MVP)
- Performance metrics tracking

### 📊 Analytics Dashboard
- Real-time performance metrics
- Interactive charts (bar, line, pie charts)
- Engagement rate tracking
- Platform distribution analysis
- Top-performing content rankings

### 📅 Content Calendar
- Monthly calendar view with drag-and-drop (future)
- Multi-platform content visualization
- Platform-specific color coding
- Upcoming content scheduling
- Filter by platform (Instagram, TikTok, YouTube, LinkedIn)

### 🏆 Competitor Tracker
- Monitor competitor metrics in real-time
- Follower growth tracking
- Engagement rate comparison
- Content performance benchmarking
- Market leader rankings

### 📰 News Consolidator
- Curated industry news and insights
- Multi-category news feeds (Trends, Product Updates, Insights)
- Hashtag-based content discovery
- Save and share functionality
- Backend-driven manual and automatic feed refresh
- Live update timestamp and dynamic trending topics
- Trending topics widget
- Newsletter subscriptions

### 🎨 Global Features
- **Dark Theme** - Eye-friendly interface optimized for professionals
- **Shared Sidebar Navigation** - Intuitive navigation across all sections
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Type-Safe** - Full TypeScript support for reliability

## 🚀 Quick Start

### Prerequisites
- Node.js 18.0.0 or higher
- npm or yarn package manager

### Installation

```bash
# Clone the repository
cd heuriskein-content-OS

# Install dependencies
npm install

# Create environment variables (if needed)
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the dashboard.

## 📦 Project Structure

```
heuriskein-content-OS/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with sidebar
│   ├── globals.css              # Global Tailwind styles
│   ├── page.tsx                 # Dashboard home
│   ├── instagram/page.tsx       # Instagram Manager
│   ├── analytics/page.tsx       # Analytics Dashboard
│   ├── calendar/page.tsx        # Content Calendar
│   ├── competitors/page.tsx     # Competitor Tracker
│   └── news/page.tsx            # News Consolidator
├── components/
│   ├── Sidebar.tsx              # Navigation component
│   └── ui/                       # shadcn/ui components
├── lib/
│   └── utils.ts                 # Utility functions
├── public/                       # Static assets
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── next.config.js
└── CLAUDE.md                     # Detailed documentation
```

## 🛠️ Tech Stack

- **Frontend Framework**: Next.js 14
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS 3.4
- **Components**: shadcn/ui
- **Charts**: Recharts 2.10
- **Icons**: Lucide React
- **UI Primitives**: Radix UI
- **State Management**: React Hooks
- **Linting**: ESLint

## 📖 Available Scripts

```bash
# Development server with hot reload
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run ESLint
npm run lint

# Run tests
npm test
```

## 🔐 API Credentials Manual

- Social network API keys guide: [SOCIAL_API_KEYS_MANUAL.md](SOCIAL_API_KEYS_MANUAL.md)

## 🎨 Customization

### Theme Colors

Edit CSS variables in `app/globals.css`:

```css
:root {
  --background: 0 0% 3.6%;      /* Main background */
  --foreground: 0 0% 98%;        /* Text color */
  --primary: 215.4 16.3% 56.9%;  /* Accent color */
  /* ... more variables */
}
```

### Adding New Pages

1. Create a new folder in `/app`
2. Add `page.tsx` file
3. Add route to `Sidebar.tsx` navigation
4. Use existing UI components from `/components/ui`

Example:
```tsx
// app/new-feature/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

export default function NewFeature() {
  return (
    <div className="space-y-8 p-8">
      <h1 className="section-title">New Feature</h1>
      {/* Your content */}
    </div>
  )
}
```

### Adding New Components

1. Create component in `/components/ui/ComponentName.tsx`
2. Follow shadcn/ui patterns
3. Use TypeScript interfaces for props
4. Export from component file

```tsx
import * as React from "react"
import { cn } from "@/lib/utils"

interface ComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  // Your props
}

const Component = React.forwardRef<HTMLDivElement, ComponentProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("base-classes", className)} {...props} />
  )
)
Component.displayName = "Component"

export { Component }
```

## 📱 Responsive Design

The dashboard is fully responsive and optimized for:
- **Desktop** (1920px and above)
- **Laptop** (1440px - 1920px)
- **Tablet** (768px - 1440px)
- **Mobile** (320px - 768px)

Use Tailwind's responsive prefixes:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
  {/* Content */}
</div>
```

## 🔐 Security Best Practices

- ✅ TypeScript strict mode enabled
- ✅ No hardcoded secrets (use `.env.local`)
- ✅ Input validation ready (add form validation as needed)
- ✅ CORS headers configurable in `next.config.js`
- ✅ Dependency security: Run `npm audit` regularly

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Push to GitHub and connect to Vercel
npm install -g vercel
vercel
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Other Platforms
- AWS Amplify
- Netlify
- Railway
- Render

## 📊 Performance Metrics

- **Core Web Vitals**: Optimized for LCP, FID, CLS
- **Bundle Size**: Minimal with Next.js optimization
- **Dark Theme**: Reduces eye strain and battery usage
- **Responsive Images**: Using Next.js Image component (ready)

## 🐛 Known Issues & Limitations

- Mock data used throughout (no backend integration yet)
- Chart interactions limited (tooltip and basic hover)
- Calendar doesn't support drag-and-drop yet
- News items are simulated

See [CLAUDE.md](./CLAUDE.md) for planned enhancements.

## 📚 Documentation

- **[CLAUDE.md](./CLAUDE.md)** - Comprehensive technical documentation
- **[PROJECT_GUIDE.md](./PROJECT_GUIDE.md)** - Original project requirements
- Next.js Docs: https://nextjs.org/docs
- Tailwind Docs: https://tailwindcss.com/docs
- shadcn/ui: https://ui.shadcn.com

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Open a Pull Request

See [CLAUDE.md](./CLAUDE.md) for contribution guidelines.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 👥 Support

For questions or support:
- Create an issue on GitHub
- Check [CLAUDE.md](./CLAUDE.md) troubleshooting section
- Review [PROJECT_GUIDE.md](./PROJECT_GUIDE.md) for requirements

## 🎯 Roadmap

### Phase 1 ✅
- [x] Project setup with Next.js 14
- [x] Tailwind CSS dark theme
- [x] shadcn/ui component library
- [x] Dashboard homepage
- [x] Instagram Manager
- [x] Analytics Dashboard
- [x] Content Calendar
- [x] Competitor Tracker
- [x] News Consolidator
- [x] Documentation

### Phase 2 (Planned)
- [ ] Backend API integration
- [ ] Real data source connections
- [ ] User authentication
- [ ] Database setup
- [ ] Search functionality
- [ ] Export features (PDF, CSV)

### Phase 3 (Planned)
- [ ] User settings panel
- [ ] Real-time notifications
- [ ] Advanced filtering
- [ ] Report generation
- [ ] Scheduled automation

### Phase 4+ (Future)
- [ ] AI-powered suggestions
- [ ] Sentiment analysis
- [ ] Multi-user collaboration
- [ ] White-label options

## 📊 Statistics

- **Total Components**: 5 pages + UI library
- **Lines of Code**: ~3,500+ LOC
- **TypeScript Support**: 100%
- **Dark Theme**: Fully implemented
- **Accessibility**: Radix UI powered

---

**Made with ❤️ by the Development Team**

**Version**: 1.0.0  
**Last Updated**: April 2024
