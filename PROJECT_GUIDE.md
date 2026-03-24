Context‑Driven Specification for Generative AI Development
This document defines the complete specification and constraints for generating a Content Management Dashboard using Next.js, Tailwind CSS, and shadcn/ui.
A generative AI should use this file as the authoritative guide when producing code, architecture, UI components or documentation.

🧱 1. Project Overview
You are building a content management dashboard with a global dark theme and a shared sidebar navigation.
The system must include the following sections:

Instagram Manager
Analytics Dashboard
Content Calendar
Competitor Tracker
News Consolidator

The AI must generate:

Project structure
Placeholder pages for each section
Shared layout and navigation
Component conventions
CLAUDE.md documentation


🎨 2. Global Requirements
2.1 Tech Stack

Next.js
Tailwind CSS
shadcn/ui
TypeScript
Dark theme enforced globally

2.2 UI/UX Principles

Clean, modern, minimalistic
Dark card‑based layouts
High information density
Interactive charts/tables when relevant
Consistent spacing, shadows, and typography


🧭 3. Sections — Detailed Requirements
3.1 Instagram Manager
Build an Instagram content management dashboard showing:

Scheduled posts
Drafts
Published content
Backlog
Ability to add new post ideas with:

Caption
Post type
Status
Scheduled date



UI requirements:

Dark theme
Clean card-based layout
List/grid view options


3.2 Analytics Dashboard
Create analytics page using bar charts and line charts to display metrics sourced from Metricool (simulated or integrated):
Required metrics:

Total impressions
Engagement rate
Follower growth
Top performing posts

Additional:

Date range picker
Dark theme


3.3 Content Calendar
Build a monthly calendar view that displays:

Scheduled posts
Previously posted content

Functionalities:

Each day supports multiple items
Items shown as colored chips
Filters by platform:

Instagram
YouTube
TikTok
etc.


Dark UI


3.4 Competitor Tracker
Create a dashboard to track competitors across multiple social accounts.
Features:

Add competitor handle/channel
Show:

Recent posts
Engagement
Posting frequency
Growth trends


Public data only
Sortable dark table


3.5 News Consolidator
Build a news aggregator pulling the latest [NICHE] news from RSS feeds, showing:

Headline
Source
Publish date
Short summary

Features:

Topic filters (tools, research, business, etc.)
Dark card feed UI


🗂 4. Required File & Folder Structure
The AI should generate a structure similar to:
/app
  /instagram
  /analytics
  /calendar
  /competitors
  /news
  layout.tsx
  page.tsx

/components
  /ui (shadcn components)
  Sidebar.tsx
  Topbar.tsx
  Calendar.tsx
  Chart.tsx
  Table.tsx

/lib
  metricool.ts
  rss.ts
  competitors.ts

/styles
  globals.css


🧩 5. Component Conventions
5.1 Architecture

Use functional components
Prefer server components unless interactivity required
Use shadcn/ui primitives
Keep components small & composable

5.2 Naming

PascalCase for components
camelCase for functions
kebab-case for filenames (Next.js routing standard)


🗒 6. Documentation Rules
The AI must generate a CLAUDE.md containing:

Tech stack justification
Project architecture
Folder structure
Component conventions
API/data assumptions
Dark theme decisions
Future improvements


🧠 7. AI Behavior Instructions
7.1 When generating code

Follow the spec strictly
Avoid assumptions outside this document
Produce clean, consistent, production-quality code
Add comments only when necessary for clarity

7.2 When structure is missing

Propose best‑practice defaults
Explain reasoning

7.3 When extending features

Maintain UI/UX consistency
Reuse components instead of duplicating


🏁 8. Definition of Done
A task is considered complete when:

All pages exist
Global layout & sidebar work
Dark theme is enforced
Each section has placeholders with initial UI
Documentation (CLAUDE.md) is auto-generated
Structure matches this specification