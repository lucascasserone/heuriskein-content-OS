# Changelog

All notable changes to this project are documented in this file.

## [1.2.0] - 2026-03-27

### Added

- Instagram import template download via [public/templates/instagram-posts-import-template.csv](public/templates/instagram-posts-import-template.csv).
- Instagram Manager import flow now accepts `.csv`, `.xlsx`, and `.xls` files.
- Social publishing MVP with Instagram connect/disconnect endpoints and direct publish endpoint.
- Instagram connection and direct publishing UI in [app/instagram/page.tsx](app/instagram/page.tsx).
- News Consolidator backend refresh endpoint and dynamic snapshot sections (trending topics and curated collections).
- Go-live roadmap in [SYSTEM_GO_LIVE_PLAN.md](SYSTEM_GO_LIVE_PLAN.md).

### Changed

- News Consolidator now supports manual refresh, auto refresh toggle, and live update timestamp.
- News actions are functional (Read More link, Save toggle API, Share with native API/clipboard fallback).
- Analytics dashboard uses backend snapshot data with refresh behavior.
- Calendar supports editing posts directly from calendar interactions.

### Fixed

- Global render instability prevented by hardening root layout rendering behavior.
- Instagram schema now accepts nullable link values during edit/update flows.

## [1.1.0] - 2026-03-27

### Added Features

- Competitor tracker backend and frontend improvements with CRUD/history/benchmarks support.
- App Router error boundaries to improve recovery from runtime exceptions.
