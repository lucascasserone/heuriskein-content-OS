# Release v1.2.0

Release date: 2026-03-27
Tag: v1.2.0

## Summary

Version 1.2.0 delivers a complete productivity upgrade across Instagram Manager, News Consolidator, and social publishing foundations. It includes bulk-import enablement with template download, direct publish MVP for Instagram, backend-driven News updates, and a clear production go-live roadmap.

## Highlights

### 1. Instagram Manager

- Added import template download button near Import Excel.
- Added template file at [public/templates/instagram-posts-import-template.csv](public/templates/instagram-posts-import-template.csv).
- Import flow supports `.csv`, `.xlsx`, and `.xls`.
- Added connection UI for Instagram account integration.
- Added direct publishing button (`Publish Now`) for eligible posts.

### 2. Social Publishing MVP

- Added social connection APIs:

  - [app/api/social/connections/route.ts](app/api/social/connections/route.ts)
  - [app/api/social/connections/[platform]/route.ts](app/api/social/connections/[platform]/route.ts)

- Added direct publish API:

  - [app/api/social/publish/route.ts](app/api/social/publish/route.ts)

- Added server-side social module:

  - [lib/social/repository.ts](lib/social/repository.ts)
  - [lib/social/types.ts](lib/social/types.ts)
  - [lib/social/api.ts](lib/social/api.ts)

### 3. News Consolidator

- Backend refresh endpoint and dynamic snapshots are active.
- UI now supports manual refresh, auto refresh toggle, and live timestamp.
- Save and share workflows are functional.

### 4. Operational Readiness

- Added full execution roadmap in [SYSTEM_GO_LIVE_PLAN.md](SYSTEM_GO_LIVE_PLAN.md).
- Documented social publishing environment flags in [.env.example](.env.example).

## Technical Notes

- Direct publish currently supports:

  - Mock mode by default (`SOCIAL_PUBLISH_MODE=mock`).
  - API mode when configured (`SOCIAL_PUBLISH_MODE=api` + valid Instagram credentials).

- In-memory connection state is used in MVP; persistent encrypted storage is planned in go-live roadmap.

## Validation

- Production build completed successfully with all new routes and modules.
- Core social endpoints and News refresh flows were validated during implementation.

## Upgrade Checklist

1. Pull latest `main` and install dependencies.
2. Verify `.env.local` values for Supabase and social publish mode.
3. Run build and smoke tests:

   - `./node_modules/.bin/next.cmd build`

4. Start runtime:

   - `./node_modules/.bin/next.cmd start -p 3000`

## Known Follow-ups

- Persist social connections securely (encrypted storage).
- Implement OAuth flow for production-grade account linking.
- Add scheduled publishing worker and retry queue.
