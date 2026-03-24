# Project File Structure

Complete file tree of the Heuriskein Content Dashboard project.

```
heuriskein-content-OS/
│
├── 📁 app/                                 # Next.js App Router Directory
│   ├── layout.tsx                         # Root layout (shared by all pages)
│   ├── globals.css                        # Global Tailwind styles + dark theme
│   ├── page.tsx                           # Dashboard home page
│   │
│   ├── 📁 instagram/
│   │   └── page.tsx                       # Instagram Manager page
│   │
│   ├── 📁 analytics/
│   │   └── page.tsx                       # Analytics Dashboard page
│   │
│   ├── 📁 calendar/
│   │   └── page.tsx                       # Content Calendar page
│   │
│   ├── 📁 competitors/
│   │   └── page.tsx                       # Competitor Tracker page
│   │
│   └── 📁 news/
│       └── page.tsx                       # News Consolidator page
│
├── 📁 components/                          # Reusable React Components
│   ├── Sidebar.tsx                        # Navigation sidebar (client)
│   │
│   └── 📁 ui/                             # UI Component Library (shadcn/ui)
│       ├── Card.tsx                       # Card container component
│       ├── Button.tsx                     # Button component with variants
│       ├── Tabs.tsx                       # Tab component (accessible)
│       └── Badge.tsx                      # Badge/label component
│
├── 📁 lib/                                # Utility Functions & Helpers
│   └── utils.ts                           # cn() className merger utility
│
├── 📁 public/                             # Static Assets (ready for use)
│   ├── favicon.ico
│   └── ...
│
├── 🔧 Configuration Files
│   ├── package.json                       # Project dependencies
│   ├── package-lock.json                  # Locked dependency versions
│   ├── tsconfig.json                      # TypeScript configuration
│   ├── next.config.js                     # Next.js configuration
│   ├── tailwind.config.ts                 # Tailwind CSS configuration
│   ├── postcss.config.js                  # PostCSS configuration
│   └── .eslintrc.json                     # ESLint configuration
│
├── 📄 Documentation Files
│   ├── README.md                          # Project overview & features
│   ├── CLAUDE.md                          # Complete technical documentation
│   ├── PROJECT_GUIDE.md                   # Original requirements
│   ├── SETUP.md                           # Installation & setup guide
│   └── STRUCTURE.md                       # This file
│
├── 📋 Environment & Git
│   ├── .env.example                       # Example environment variables
│   ├── .gitignore                         # Git ignore rules
│   └── .git/                              # Git repository (if initialized)
│
└── 📦 Dependencies Folder (not tracked)
    └── node_modules/                      # Installed packages (run: npm install)
```

---

## File Descriptions

### Core Application Files

#### `app/layout.tsx`
- Root layout for all pages
- Sets up dark theme globally
- Includes Sidebar navigation
- Defines meta tags and fonts
- Provider wrapper for Next.js features

#### `app/globals.css`
- Global Tailwind CSS directives
- Dark theme CSS variables
- Custom component layer classes
- Base styling for all elements

#### `app/page.tsx`
- Dashboard homepage
- Overview with key statistics
- Quick action buttons
- System status monitor

### Page Components

#### `app/instagram/page.tsx`
**Instagram Manager**
- Tabbed interface (Scheduled, Drafts, Published, Backlog)
- Post card listings
- Status and date information
- Performance metrics

#### `app/analytics/page.tsx`
**Analytics Dashboard**
- Key metric cards
- Impressions bar chart
- Engagement line chart
- Platform distribution pie chart
- Top posts ranking

#### `app/calendar/page.tsx`
**Content Calendar**
- Monthly calendar grid view
- Platform-colored post chips
- Month navigation controls
- Platform filter tabs
- Upcoming posts list

#### `app/competitors/page.tsx`
**Competitor Tracker**
- Competitor overview cards
- Metrics comparison
- Market leader rankings
- Engagement benchmarks
- Follower growth indicators

#### `app/news/page.tsx`
**News Consolidator**
- Tabbed news feeds
- Article cards with metadata
- Hashtag/tag system
- Action buttons (Read, Save, Share)
- Trending topics widget

### Component Files

#### `components/Sidebar.tsx`
- Fixed-width navigation sidebar
- Route links with active state
- Brand logo/branding at top
- Footer with version info
- Responsive icon system

#### `components/ui/Card.tsx`
- Card container component
- Card header, title, description
- Card content and footer
- Reusable across all pages

#### `components/ui/Button.tsx`
- Button component with variants
- Size variations
- Hover states
- Type-safe props

#### `components/ui/Tabs.tsx`
- Accessible tab component
- Multiple tabs support
- Tab triggers and content areas
- Keyboard navigation ready

#### `components/ui/Badge.tsx`
- Badge/label component
- Multiple variants
- Used for status indicators
- Inline labels for content

### Utility Files

#### `lib/utils.ts`
- `cn()` - className merger function
- Prevents Tailwind conflicts
- Used throughout components

### Configuration Files

#### `package.json`
- Project metadata (name, version, description)
- Dependencies list (react, next, tailwind, etc.)
- Dev dependencies (tailwindcss, postcss, typescript, etc.)
- Available scripts (dev, build, start, lint, test)

#### `tsconfig.json`
- TypeScript compiler options
- Strict mode enabled
- Path aliases (@/* for imports)
- Module resolution configuration

#### `tailwind.config.ts`
- Tailwind CSS configuration
- Dark mode setup
- Color palette definitions
- Extended theme configuration
- Plugins (tailwindcss-animate)

#### `next.config.js`
- Next.js application settings
- React strict mode
- SWC minification enabled

#### `postcss.config.js`
- PostCSS plugins configuration
- Tailwind CSS plugin
- Autoprefixer configuration

#### `.eslintrc.json`
- ESLint rule configuration
- React hooks validation
- Next.js best practices
- Code quality rules

### Documentation Files

#### `README.md`
- User-friendly project overview
- Feature descriptions
- Quick start guide
- Technology stack
- Deployment instructions
- Contribution guidelines

#### `CLAUDE.md`
- Complete technical documentation
- Architecture overview
- Design system details
- Component conventions
- Implementation decisions
- Development guidelines
- Future enhancements
- Security considerations
- Troubleshooting guide

#### `PROJECT_GUIDE.md`
- Original project requirements
- Feature specifications
- UI/UX principles
- Detailed section requirements
- Global requirements

#### `SETUP.md`
- Step-by-step installation guide
- Prerequisites checking
- Development server startup
- VS Code extension recommendations
- Common troubleshooting
- Learning resources
- Development tips

#### `STRUCTURE.md`
- This file
- Complete file tree
- File descriptions
- Directory purpose

### Environment & Git

#### `.env.example`
- Template for environment variables
- Example configurations
- Comments for each variable
- Ready to copy as `.env.local`

#### `.gitignore`
- Node modules exclusion
- Build artifacts
- Environment files
- Editor settings
- OS files (DS_Store, etc.)

---

## Directory Sizes & Descriptions

### `/app` Directory
**Purpose**: Application routes and pages  
**Files**: 6 TypeScript files (page.tsx, layout.tsx, globals.css)  
**Size**: ~250KB including CSS  
**Key Feature**: File-based routing system

### `/components` Directory
**Purpose**: Reusable React components  
**Files**: 5 TypeScript files (Sidebar + 4 UI components)  
**Size**: ~40KB  
**Key Feature**: shadcn/ui consistent patterns

### `/lib` Directory
**Purpose**: Shared utilities and helpers  
**Files**: 1 TypeScript file  
**Size**: <1KB  
**Key Feature**: Utility functions for common tasks

### `/public` Directory
**Purpose**: Static assets  
**Status**: Ready for images, fonts, static files  
**Size**: 0KB (not populated)

---

## Import Path Aliases

All imports use the `@/` alias for absolute paths:

```ts
// Instead of:
import { Card } from '../../../components/ui/Card'

// Use:
import { Card } from '@/components/ui/Card'
```

This is configured in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

---

## File Organization Best Practices

### Adding New Features

1. **Create a route folder** in `/app/feature-name/`
2. **Add page.tsx** with component
3. **Create folder in `/components`** if reusable components needed
4. **Add navigation link** to `Sidebar.tsx`
5. **Update documentation** (CLAUDE.md, README.md)

### Adding New Components

1. **For UI components**: Create in `/components/ui/ComponentName.tsx`
2. **For feature components**: Create in `/components/FeatureName.tsx`
3. **Follow naming**: PascalCase for component files
4. **Export properly**: Named or default exports
5. **Add TypeScript**: Interface for all props

### Adding Utilities

1. **Single utility**: Add to `lib/utils.ts`
2. **Multiple utilities**: Create `lib/category.ts`
3. **Export clearly**: Named exports preferred
4. **Document purpose**: JSDoc comments

---

## Dependencies by Category

### Core Framework
- next
- react
- react-dom
- typescript

### Styling
- tailwindcss
- postcss
- autoprefixer
- tailwindcss-animate

### UI Components
- @radix-ui/react-tabs
- @radix-ui/react-slot
- @radix-ui/react-dialog
- @radix-ui/react-dropdown-menu
- @radix-ui/react-select
- @radix-ui/react-popover

### Utilities
- class-variance-authority
- clsx
- tailwind-merge
- lucide-react

### Data Visualization
- recharts

### Forms (Ready for use)
- react-hook-form
- @hookform/resolvers
- zod

### Development Tools
- eslint
- jest
- @types/*

---

## Version Control

### Git Repository Structure
```
.git/
├── objects/          # Git objects
├── refs/            # Branch references
├── HEAD             # Current branch pointer
└── config           # Git configuration
```

### Recommended .gitignore Items
```
node_modules/
.next/
.env.local
.env.*.local
coverage/
dist/
build/
```

---

## Total Project Statistics

| Metric | Count |
|--------|-------|
| **Pages** | 6 |
| **Components** | 5 UI + 1 Layout |
| **Configuration Files** | 6 |
| **Documentation Files** | 6 |
| **TypeScript Files** | 13 |
| **CSS Files** | 1 (globals) |
| **Total Files** | 30+ |
| **Lines of Code** | ~3,500+ |

---

## Next Steps

1. **Install dependencies**: `npm install`
2. **Start dev server**: `npm run dev`
3. **Open browser**: http://localhost:3000
4. **Explore pages**: Click sidebar links
5. **Read CLAUDE.md**: Full technical guide
6. **Consider modifications**: Colors, fonts, layouts

---

**Last Updated**: April 2024  
**Version**: 1.0.0  
**Total Setup Time**: ~2 minutes (with npm install)
