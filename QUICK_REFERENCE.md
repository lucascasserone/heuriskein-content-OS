# Quick Reference Guide

**Heuriskein Content Dashboard** - Development Quick Reference

## API Keys and Credentials

- Social API keys manual: `SOCIAL_API_KEYS_MANUAL.md`

---

## 🚀 Quick Start Commands

```bash
# Install dependencies (do this first!)
npm install

# Start development server
npm run dev

# Visit in browser
http://localhost:3000

# Build for production
npm run build

# Run linter
npm run lint
```

---

## 📝 Creating a New Page

### Step-by-Step

1. **Create folder** in `/app`:
```bash
mkdir app/my-feature
```

2. **Add page.tsx**:
```tsx
// app/my-feature/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

export default function MyFeature() {
  return (
    <div className="space-y-8 p-8">
      <h1 className="section-title">My Feature</h1>
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
        </CardHeader>
        <CardContent>Content here</CardContent>
      </Card>
    </div>
  )
}
```

3. **Add to Sidebar** (`components/Sidebar.tsx`):
```tsx
{
  name: 'My Feature',
  href: '/my-feature',
  icon: Icon,  // Import icon from lucide-react
}
```

---

## 🛠️ Creating a New Component

### UI Component Example

```tsx
// components/ui/MyComponent.tsx
import * as React from "react"
import { cn } from "@/lib/utils"

interface MyComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary'
}

const MyComponent = React.forwardRef<HTMLDivElement, MyComponentProps>(
  ({ className, variant = 'default', ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "base-classes",
        variant === 'secondary' && "secondary-classes",
        className
      )}
      {...props}
    />
  )
)
MyComponent.displayName = "MyComponent"

export { MyComponent }
```

---

## 🎨 Styling Reference

### Tailwind Classes Common Usage

```tsx
// Spacing
className="p-4 m-4 gap-4"        // padding, margin, gap

// Layout
className="flex items-center justify-between"
className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4"

// Colors (Dark Theme)
className="text-foreground"       // Main text
className="text-muted-foreground" // Secondary text
className="bg-card"               // Card background
className="border border-border"  // Borders

// Sizing
className="h-4 w-4"               // Small icon
className="h-10 w-full"           // Full width button

// Responsive
className="grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
className="hidden sm:block"       // Hide on mobile

// Hover & States
className="hover:bg-muted"
className="focus:ring-2 focus:ring-primary"
className="disabled:opacity-50"
```

### Dark Theme Colors

```
--background    → Page background
--foreground    → Text color
--card          → Card background
--primary       → Accent/button color
--muted         → Secondary/subtle elements
--border        → Borders and dividers
--destructive   → Error/danger states
```

Access colors in code:
```tsx
className="bg-primary text-primary-foreground"
className="text-muted-foreground"
className="border-border"
```

---

## 📦 Component Usage Examples

### Card
```tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Optional description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

### Button
```tsx
import { Button } from '@/components/ui/Button'

<Button variant="default">Primary Button</Button>
<Button variant="outline">Outline Button</Button>
<Button variant="ghost">Ghost Button</Button>
<Button size="sm">Small Button</Button>
<Button size="lg">Large Button</Button>
```

### Tabs
```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'

<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  <TabsContent value="tab2">Content 2</TabsContent>
</Tabs>
```

### Badge
```tsx
import { Badge } from '@/components/ui/Badge'

<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="outline">Outline</Badge>
```

---

## 🎯 Client vs Server Components

### Server Component (Default)
```tsx
// app/page.tsx
import { Card } from '@/components/ui/Card'

export default function Page() {
  // Can do server-side data fetching here
  return <Card>Static content</Card>
}
```

### Client Component (with Hooks)
```tsx
'use client'

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

---

## 📊 Charts (Recharts)

### Bar Chart
```tsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
]

<ResponsiveContainer width="100%" height={300}>
  <BarChart data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Bar dataKey="value" fill="#rgb(value)" />
  </BarChart>
</ResponsiveContainer>
```

### Line Chart
```tsx
<ResponsiveContainer width="100%" height={300}>
  <LineChart data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Line type="monotone" dataKey="value" stroke="#rgb(value)" />
  </LineChart>
</ResponsiveContainer>
```

---

## 🔗 Import Paths

### Absolute Imports (Using @/)
```tsx
// ✅ Good
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

// ❌ Avoid
import { Card } from '../../../components/ui/Card'
```

### Icon Imports
```tsx
import { Heart, Home, Search, Settings } from 'lucide-react'

<Heart className="h-4 w-4" />
```

---

## 🐛 Common Issues & Solutions

### "Module not found"
```tsx
// Check path is correct and file exists
// Use @/ prefix for absolute imports
import { Component } from '@/components/ui/Component'
```

### TypeScript errors
```tsx
// Add 'use client' at top if using hooks
'use client'
import { useState } from 'react'
```

### Styles not applying
```tsx
// Make sure class name is spelled correctly
// Check Tailwind config has correct content paths
// Restart dev server: npm run dev
```

### Port 3000 in use
```bash
# Kill existing process or use different port
npm run dev -- -p 3001
```

---

## 📁 File Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `MyComponent.tsx` |
| Pages | lowercase | `page.tsx` |
| Utilities | camelCase | `utils.ts` |
| Folders | kebab-case | `/my-feature/` |
| Types | PascalCase | `MyType.ts` |

---

## 🔍 TypeScript Tips

### Props Interface
```tsx
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string  // Optional with ?
}

export function MyCard({ title, description, ...props }: CardProps) {
  return <div {...props}>{title}</div>
}
```

### Union Types
```tsx
type Variant = 'default' | 'secondary' | 'outline'

function Button({ variant = 'default' }: { variant?: Variant }) {
  // ...
}
```

### useRef and forwardRef
```tsx
const MyComponent = React.forwardRef<HTMLDivElement, Props>(
  (props, ref) => <div ref={ref} {...props} />
)
```

---

## 🚀 Performance Tips

```tsx
// 1. Use React.memo for expensive components
const ExpensiveComponent = React.memo(({ data }) => (
  <div>{data}</div>
))

// 2. Use useCallback for event handlers
const handleClick = useCallback(() => {
  // ...
}, [dependency])

// 3. Use useMemo for expensive calculations
const result = useMemo(() => {
  return expensiveCalculation(data)
}, [data])

// 4. Code splitting with dynamic imports
const DynamicComponent = dynamic(() => import('@/components/Heavy'))
```

---

## 🎨 Theme Customization

### Change Colors in globals.css
```css
:root {
  --primary: 215.4 16.3% 56.9%;  /* Change this for accent color */
  --background: 0 0% 3.6%;       /* Darker/lighter background */
  --foreground: 0 0% 98%;        /* Text color */
}
```

### Modify Tailwind Config
```ts
// tailwind.config.ts
const config = {
  theme: {
    extend: {
      colors: {
        custom: 'hsl(var(--custom))',
      },
    },
  },
}
```

---

## 📚 Documentation Links

- **This Project**: See `CLAUDE.md` for full documentation
- **Setup Guide**: See `SETUP.md` for installation
- **File Structure**: See `STRUCTURE.md` for complete layout
- **README**: See `README.md` for overview

---

## 🔑 Keyboard Shortcuts (VS Code)

```
Ctrl/Cmd + /        → Comment/uncomment
Ctrl/Cmd + Shift + P → Command palette
Ctrl/Cmd + F        → Find
Ctrl/Cmd + H        → Find & replace
Ctrl/Cmd + D        → Select word
Ctrl/Cmd + L        → Select line
Alt + Up/Down       → Move line
Shift + Alt + D     → Duplicate line
```

---

## 📞 Getting Help

1. **Check CLAUDE.md** - Full technical documentation
2. **Check SETUP.md** - Installation troubleshooting
3. **Check STRUCTURE.md** - File organization
4. **Check README.md** - Features and overview
5. **Read error messages carefully** - Stack traces help!
6. **Search documentation**:
   - Next.js: https://nextjs.org/docs
   - React: https://react.dev
   - Tailwind: https://tailwindcss.com

---

## ✅ Pre-Deployment Checklist

- [ ] All links work (no 404s)
- [ ] Mobile responsive (test on mobile)
- [ ] Dark theme looks correct
- [ ] No console errors (F12 → Console)
- [ ] Images load properly
- [ ] Forms validate input
- [ ] API calls error handling ready
- [ ] Environment variables set

---

**Quick Reference Version**: 1.0  
**Last Updated**: April 2024  
**Print this page as PDF for offline reference!**
