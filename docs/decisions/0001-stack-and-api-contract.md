# 0001 — Stack and API contract

Date: 2026-11-23 · Status: accepted

- React 18 + Vite + TypeScript PWA, Tailwind, Zustand, TanStack Query; Supabase (Postgres, Auth, Storage, Edge Functions, pg_cron).
- PostgREST exposes only the `api_v1` schema. Client roles have no grants on `public`; reads and writes go through `api_v1` views and functions.
- TypeScript pinned to 6.0.x until typescript-eslint supports 7.x.

## Cross-border data transfers (Loi 2019-014)

| Processor | Data | Location | Status |
|---|---|---|---|
| Supabase (hosting) | all workshop data | EU region (TBD after latency test) | to declare to IPDCP |
| Vision API (Claude or OpenAI) | notebook photos, transiently | US/EU (TBD) | to declare to IPDCP |
