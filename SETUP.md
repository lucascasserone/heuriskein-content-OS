# Setup & Installation Guide

## 🎯 Quick Start

This guide will help you get the Heuriskein Content Dashboard running on your system.

## Prerequisites

Ensure you have the following installed:
- **Node.js**: Version 18.0.0 or higher ([Download](https://nodejs.org/))
- **npm**: Comes with Node.js (usually)
- **Git**: For version control ([Download](https://git-scm.com/))
- **Code Editor**: VS Code recommended ([Download](https://code.visualstudio.com/))

Check if you have these installed:
```bash
node --version  # Should be v18.0.0 or higher
npm --version   # Should be 9.0.0 or higher
git --version
```

## Installation Steps

### 1. Navigate to Project Directory
```bash
cd c:\Users\marco.baldassari\OneDrive\ -\ Grupo\ Avenida\Área\ de\ Trabalho\codingProjects\heuriskein-content-OS
```

Or simply open the folder in VS Code.

### 2. Install Dependencies
```bash
npm install
```

This will:
- Create `node_modules/` folder with all dependencies
- Generate `package-lock.json` for reproducible installs
- Take 2-5 minutes depending on internet speed

### 3. Environment Setup
```bash
# Copy example environment variables
cp .env.example .env.local
```

**Note**: For this initial setup, you don't need to modify `.env.local` - all features work with defaults.

### 4. Start Development Server
```bash
npm run dev
```

You should see:
```
> next dev

  ▲ Next.js 14.0.0
  - Local:        http://localhost:3000
  - Environments: .env.local

✓ Ready in 2.5s
```

### 5. Open in Browser
Navigate to: **http://localhost:3000**

You should see the Heuriskein dashboard!

## 🗂️ Project Structure Overview

```
heuriskein-content-OS/
├── app/                    # Next.js application routes
│   ├── (pages)            # All page components
│   ├── globals.css        # Global Tailwind styles
│   └── layout.tsx         # Root layout with sidebar
├── components/            # Reusable React components
│   ├── Sidebar.tsx       # Navigation sidebar
│   └── ui/               # shadcn/ui components
├── lib/                  # Utility functions
├── package.json          # Project dependencies
├── tailwind.config.ts    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
├── CLAUDE.md            # Detailed documentation
└── README.md            # User-friendly documentation
```

## 📖 Available Commands

```bash
# Development server (hot reload)
npm run dev

# Create optimized production build
npm run build

# Run production server (requires build first)
npm start

# Run ESLint to check code quality
npm run lint

# Run test suite
npm test
```

## 🌐 Routes & Pages

Once running, visit these URLs:

| Route | Purpose |
|-------|---------|
| http://localhost:3000/ | Dashboard home page |
| http://localhost:3000/instagram | Instagram Manager |
| http://localhost:3000/analytics | Analytics Dashboard |
| http://localhost:3000/calendar | Content Calendar |
| http://localhost:3000/competitors | Competitor Tracker |
| http://localhost:3000/news | News Consolidator |

## 🎨 Tech Stack Summary

- ✅ **Next.js 14** - React framework
- ✅ **TypeScript 5** - Type safety
- ✅ **Tailwind CSS 3.4** - Styling
- ✅ **shadcn/ui** - UI components
- ✅ **Recharts** - Data visualization
- ✅ **Lucide React** - Icons
- ✅ **Radix UI** - UI primitives

## 🔧 VS Code Setup (Recommended)

For better development experience, install these VS Code extensions:

1. **Tailwind CSS IntelliSense**
   - Publisher: Tailwind Labs
   - ID: bradlc.vscode-tailwindcss

2. **ES7+ React/Redux/React-Native snippets**
   - Publisher: dsznajder
   - ID: dsznajder.es7-react-js-snippets

3. **TypeScript Vue Plugin (Volar)**
   - Publisher: Vue
   - ID: Vue.volar

4. **Prettier - Code formatter**
   - Publisher: Prettier
   - ID: esbenp.prettier-vscode

5. **ESLint**
   - Publisher: Microsoft
   - ID: dbaeumer.vscode-eslint

## 🐛 Troubleshooting

### Port 3000 Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use a different port
npm run dev -- -p 3001
```

### Styles Not Showing
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
npm install

# Start again
npm run dev
```

### TypeScript Errors
```bash
# Rebuild TypeScript
npx tsc --noEmit

# Check for strict mode issues
npm run lint
```

### Build Fails
```bash
# Clean install
rm -rf node_modules package-lock.json

# Reinstall
npm install

# Try building again
npm run build
```

## 📚 Learning Resources

### Documentation Files
- **[CLAUDE.md](./CLAUDE.md)** - Complete technical documentation
- **[README.md](./README.md)** - Project overview and features
- **[PROJECT_GUIDE.md](./PROJECT_GUIDE.md)** - Original requirements

### External Resources
- **Next.js**: https://nextjs.org/learn
- **React**: https://react.dev/learn
- **Tailwind CSS**: https://tailwindcss.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs

## 🎓 Understanding the Code

### Component Example: Card
```tsx
// Using the Card component
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

<Card>
  <CardHeader>
    <CardTitle>My Title</CardTitle>
  </CardHeader>
  <CardContent>
    My content here
  </CardContent>
</Card>
```

### Creating a New Page
```tsx
// app/my-page/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

export default function MyPage() {
  return (
    <div className="space-y-8 p-8">
      <h1 className="section-title">My Page Title</h1>
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
        </CardHeader>
        <CardContent>Content</CardContent>
      </Card>
    </div>
  )
}
```

### Using Client Functions
```tsx
'use client' // Must be at top of file

import { useState } from 'react'

export default function MyComponent() {
  const [count, setCount] = useState(0)
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  )
}
```

## 🚀 Next Steps

After setup, you can:

1. **Explore existing pages** - Check out each section in sidebar
2. **Read CLAUDE.md** - Understand architecture and decisions
3. **Modify components** - Edit colors in `app/globals.css`
4. **Create new pages** - Add routes in `/app` directory
5. **Connect to backend** - Ready to integrate real APIs

## 💡 Tips & Tricks

- **Hot Reload**: Changes save automatically while `npm run dev` runs
- **Dark Theme**: Already applied globally, no config needed
- **Responsive Design**: Test on mobile using DevTools (F12 → Toggle device)
- **Debug**: Use React DevTools browser extension
- **Components**: Check `@/components/ui/` for available components

## ⚙️ Environment Variables (Optional)

For future integrations, edit `.env.local`:

```bash
# Example: Adding an API endpoint
NEXT_PUBLIC_API_BASE=https://api.example.com
API_SECRET_KEY=your_secret_key
```

Then use in code:
```tsx
const apiBase = process.env.NEXT_PUBLIC_API_BASE
const secret = process.env.API_SECRET_KEY
```

## 🤝 Common Development Tasks

### Add a New UI Component
```bash
# Create file at: components/ui/MyComponent.tsx
# Follow shadcn/ui patterns
# Export from component file
```

### Change Colors
Edit `app/globals.css`:
```css
:root {
  --primary: 215.4 16.3% 56.9%; /* Change this */
}
```

### Create New Page
```bash
# Create directory
mkdir app/my-feature

# Add page.tsx
touch app/my-feature/page.tsx

# Add to Sidebar navigation in components/Sidebar.tsx
```

## 📞 Support

If you encounter issues:

1. Check **[CLAUDE.md](./CLAUDE.md)** troubleshooting section
2. Review **[PROJECT_GUIDE.md](./PROJECT_GUIDE.md)** requirements
3. Check **VS Code terminal** for error messages
4. Visit Next.js docs: https://nextjs.org/docs

## ✅ You're All Set!

The dashboard is now running. Start exploring and building!

**Happy Coding! 🚀**

---

**Setup Version**: 1.0.0  
**Last Updated**: April 2024  
**Created for**: Heuriskein Content Dashboard
