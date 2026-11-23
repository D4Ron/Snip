# Snip

PWA de gestion d’atelier de couture (Lomé). Project rules and context: [CLAUDE.md](CLAUDE.md). Teammate guide: [docs/DEMARRAGE-COEQUIPIER.md](docs/DEMARRAGE-COEQUIPIER.md).

## Prerequisites

Git, Node.js 22+, pnpm (`corepack enable`, or `corepack pnpm …` if that needs admin rights), Docker Desktop, Supabase CLI.

## Commands

```bash
pnpm install
cp apps/web/.env.example apps/web/.env.local   # fill the anon key from `supabase status`
supabase start
supabase db reset        # migrations + seed
supabase test db         # pgTAP
pnpm dev                 # http://localhost:5173 (add --host to test on a phone)
pnpm lint && pnpm typecheck
pnpm test                # Vitest
pnpm test:e2e            # Playwright, 360×800
pnpm db:types            # regenerate apps/web/src/lib/database.types.ts
```
