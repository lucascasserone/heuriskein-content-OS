# System Go-Live Plan (100% Operational)

## 1. Core Stability and Runtime
- [ ] Keep only one local runtime strategy: `next dev` for development or `next start` after build for stable demos.
- [ ] Add a prestart script to validate `.next` existence before `next start`.
- [ ] Create a health endpoint (`/api/health`) with DB/auth/social status summary.
- [ ] Add error logging sink (Sentry or equivalent) for app and API routes.

## 2. Data and Persistence
- [ ] Apply and verify DB migrations for new fields (`external_link`, `attachments`, `tags`).
- [ ] Persist News Consolidator feed in database (replace in-memory repository).
- [ ] Persist social connection credentials securely (encrypted secrets store), not in-memory.
- [ ] Add retry and dead-letter strategy for publish failures.

## 3. Social Publishing Readiness
- [ ] Implement OAuth flow for Instagram/Meta account connection.
- [ ] Validate token lifecycle (expiry, refresh, revoke).
- [ ] Add media validation pipeline (URL reachability, format, size).
- [ ] Add publish audit trail table: platform, post_id, provider_post_id, status, error, timestamps.
- [ ] Add scheduling worker for automated publication at `scheduledFor`.

## 4. Security and Compliance
- [ ] Enforce auth guards on all private routes and social endpoints.
- [ ] Mask secrets in logs and UI.
- [ ] Add API rate limiting and abuse protection.
- [ ] Create role model (admin/editor/viewer) and RLS checks in Supabase.

## 5. QA and Observability
- [ ] Add integration tests for Instagram Manager import/edit/delete/publish flows.
- [ ] Add API tests for News refresh and save toggles.
- [ ] Add synthetic checks for CSS/static assets after deploy.
- [ ] Add dashboards and alerts (error rate, API latency, publish success rate).

## 6. Release and Operations
- [ ] Define release checklist (`build`, smoke tests, migration, rollback).
- [ ] Version the API contracts used by frontend modules.
- [ ] Add changelog automation and semantic version strategy.
- [ ] Configure CI pipeline with `lint`, `typecheck`, `build`, `test` gates.

## Suggested Milestone Sequence
1. Production stability baseline (health + logging + single runtime policy).
2. Persistence hardening (news/social data moved to DB + encrypted secrets).
3. Social OAuth and scheduler.
4. Full QA automation and monitoring.
5. Release candidate and staged rollout.
