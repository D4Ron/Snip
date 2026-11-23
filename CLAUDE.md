# Snip — CLAUDE.md

Context and rules for Claude working in this repo. This file covers the whole project and, in detail, **Ron's side of the work** (60 %). The teammate's side (40 %) is listed so it is respected, not implemented, unless Ron asks.

Source documents (French, in the "Fashion project" folder): `Business_Plan_Plateforme_Mode_v2`, `Cahier_Des_Charges_Gestion_Atelier_v2` (source of truth for requirement IDs: CLI-, MES-, ORD-, PAY-, SUI-, NOT-, DOC-, IMP-, CAL-, REC-), `Feuille_de_Route_Plateforme_Mode_v2`, and the task-split doc with the three design directions.

---

## 1. Product in short

- **Snip** is a mobile-first web app (PWA) for tailoring workshops (ateliers de couture) in Lomé, Togo: clients, measurements, orders, deposits and balances, due dates, and a private tracking link for the end client.
- It is the first product of a future hub (portfolio, shop, talents, beauty, events). Do **not** build hub features now.
- **Users**: tailors and small fashion houses, many barely tech-literate, on entry-level Android phones, often on slow 3G.
- **Calendar**: MVP Jan–Mar 2027 (6 sprints of 2 weeks) → pilot with 5–10 workshops Apr–May 2027 (must cover 27 April and Tabaski ≈ 17 May 2027) → paid launch Jun–Jul 2027.
- **Team**: Ron (owner, foundations and everything shared) and one teammate (business screens). Every PR is reviewed by the other person.

## 2. Stack (decided)

| Layer | Choice | Notes |
|---|---|---|
| Frontend | React 18 + Vite + TypeScript, PWA (vite-plugin-pwa) | Tailwind for styling, Zustand for local state, TanStack Query for server state |
| Backend | Supabase: PostgreSQL, Auth, Storage, Edge Functions (Deno), pg_cron | EU region closest to Lomé (measure latency); Pro plan for production |
| API contract | Schema `api_v1` (views + SQL functions) exposed to clients | Clients never read/write `public` tables directly. Keeps a stable contract for a future Android app |
| Tests | pgTAP (`supabase test db`), Vitest, Playwright (360×800 viewport) | |
| AI | Vision API (Claude or OpenAI) from an Edge Function | Notebook photo import only |
| Later, not now | PowerSync (offline writes, V2), Android in Kotlin, WhatsApp Cloud API, PayGate Global webhook | Design for them, don't build them |

## 3. Repo layout (proposed)

```
snip/
├── CLAUDE.md
├── apps/web/                    # the PWA
│   └── src/
│       ├── design-system/       # Ron — tokens + components
│       ├── features/
│       │   ├── auth/            # Ron
│       │   ├── subscription/    # Ron — plan choice, payment, status, banners
│       │   ├── import/          # Ron — notebook photo import
│       │   ├── admin/           # Ron — back-office (/admin, lazy-loaded)
│       │   ├── clients/         # teammate
│       │   ├── measurements/    # teammate
│       │   ├── orders/          # teammate
│       │   ├── today/           # teammate
│       │   ├── payments/        # teammate (UI only; rules are Ron's SQL)
│       │   └── documents/       # teammate (PDF triggers)
│       ├── lib/                 # supabase client, generated types, formatters
│       └── i18n/fr.ts           # every UI string, French only
├── supabase/
│   ├── migrations/              # Ron owns the schema
│   ├── functions/
│   │   ├── import-photo/        # Ron
│   │   ├── reminders/           # Ron (called by pg_cron)
│   │   ├── pdf/                 # teammate
│   │   └── public-tracking/     # teammate (tracking page + receipt check)
│   ├── tests/                   # pgTAP
│   └── seed.sql                 # sample data (fake names only)
└── docs/
    ├── DEMARRAGE-COEQUIPIER.md
    └── decisions/               # one short file per decision taken
```

Commands (adjust once the repo exists): `pnpm install` · `supabase start` · `supabase db reset` · `supabase test db` · `pnpm dev` · `pnpm test` · `pnpm lint && pnpm typecheck` · `supabase gen types typescript --local > apps/web/src/lib/database.types.ts`.

## 4. Non-negotiable rules

1. **Tenant isolation.** Every business table has `organisation_id`. RLS is enabled on every table, with policies based on `memberships(user_id, organisation_id, role)`. Every new table gets a pgTAP test proving a user of workshop A cannot read or write workshop B (REC-12). Never rely on hiding UI.
2. **Money.** Integers in FCFA (`bigint`), never floats. `prix_final = prix − remise`; `solde = prix_final − Σ paiements validés ± ajustements documentés`. Computed server-side only. Overpayment is blocked or explicitly confirmed, never a silent negative balance (PAY-07).
3. **Nothing disappears.** Orders and payments are cancelled with a reason, never deleted. Every change to price, date, status or payment writes `order_events` / `audit_log` (who, when, old, new).
4. **Status transitions** only through `api_v1.change_order_status()`, which enforces the allowed transitions (Cahier §4.4): Reçue → En préparation → En confection → À essayer / Retouche → Prête → Livrée; Annulée needs a reason. "Prête" never becomes "Livrée" on its own.
5. **Sync-ready from day one.** UUIDs generated client-side (`crypto.randomUUID()`), `updated_at` on every row, soft delete (`deleted_at`), idempotent write functions.
6. **Public tracking link.** Random token ≥ 128 bits, no account. Shows workshop, order number, garment, status timeline, promised date, total/paid/remaining (owner can hide amounts). Never measurements, internal notes or full client name. Regenerable; expires 30 days after delivery.
7. **WhatsApp.** MVP uses `wa.me` links with pre-filled text only (free, user confirms send). No WhatsApp API calls.
8. **Personal data (Loi 2019-014).** No real client data before the IPDCP declaration. Notebook photos deleted after validation. No PII, tokens or secrets in logs. Hosting and AI processor are cross-border transfers: keep them listed in `docs/decisions/`.
9. **UI for low tech literacy.** French only, plain words ("Acompte", "Reste à payer", "Prête"). Body text ≥ 16 px, touch targets ≥ 48 px, icons always with a word, one main action per screen, works at 360 px wide and on slow 3G, never lose typed input on network errors, respect `prefers-reduced-motion`. Amounts formatted `27 000 FCFA`.
10. **Out of scope for the MVP**: marketplace, clients paying online, stock, accounting, tontine, full offline, WhatsApp automation. Don't add them, even "quickly".

## 5. Data model (summary)

`organisations` (plan, loyalty threshold) · `memberships` (role: owner, manager, tailor, apprentice, cashier) · `profiles` · `clients` · `measurement_templates` · `measurements` (template_id, values jsonb, taken_at, author) · `orders` (number per org, client_id, garment, price, discount, discount_reason, due_date, status, tracking_token, tracking_active, tracking_expires_at) · `order_events` · `payments` (amount, method: cash/flooz/mixx/other, state, reference) · `files` · `photo_imports` · `audit_log` · `plans` · `subscriptions` · `payment_requests` · `expenses` (V1.1). `platform_admins` for the back-office.

## 6. Ron's work — 33 days

Each task lists what "done" means. Requirement IDs refer to the Cahier v2.

### Sprint 1 — foundations (the teammate depends on these)

**R1 · Project setup — 2 d**
- Monorepo (pnpm workspaces), ESLint + Prettier, strict TypeScript, Vitest, Playwright.
- GitHub Actions: lint, typecheck, unit tests, `supabase test db` on every PR. `main` protected, PR review required.
- Supabase: local (CLI) + staging + production projects; `.env.example`; secrets only in CI/Supabase settings.
- Done when: a fresh clone runs with the documented commands and CI is green.

**R2 · Database and security — 5 d**
- Migrations for the core tables (§5), RLS on all of them, `api_v1` views/functions for reads, generated TS types.
- pgTAP: isolation tests per table, plus role rules (apprentice cannot delete or export; cashier cannot see all measurements).
- Done when: REC-11, REC-12 pass and the teammate can read/write clients and orders through `api_v1`.

**R3 · Authentication, workshops, roles — 4 d**
- Phone number + password (SMS code only for password reset, to limit SMS cost; check an SMS provider that covers Togo). Email as fallback.
- Sign-up creates the workshop on the free Découverte plan and makes the user owner. Invitations, role change, deactivation keeps history (REC-13).
- Done when: two test workshops with several roles can be created from the app.

### Sprint 1–2

**R4 · Design system — 4 d**
- Tokens (colours, type scale, spacing, radius) for the chosen direction (A Indigo sobre / B Patron épuré / C Coupe nette — awaiting validation).
- Components: Button, Input, AmountInput (FCFA), DateInput, StatusChip (icon + word), Card, ListRow, Avatar (initials), BottomNav (4 items with labels), primary CTA bar, Banner, EmptyState, Skeleton, ConfirmDialog, and the one signature effect (cut line, tape measure or needle), disabled under reduced motion.
- Done when: the teammate can build every screen from these components without custom CSS.

### Sprint 3

**R5 · Money rules — 3 d**
- SQL functions: `create_order` (with discount), `add_payment`, `cancel_payment(reason)`, `change_order_status`, balance view, loyal-client stats (CLI-09: orders and amount over 12 months, configurable threshold, default 3 orders or 100 000 FCFA).
- Done when: REC-04, 05, 06, 07, 25, 26 pass as pgTAP tests.

### Sprint 4

**R6 · Subscriptions — 5 d**
- Plans: Découverte free (1 user, 40 clients, 15 new orders/month, tracking link, export) · Solo 2 500 · Atelier 6 000 (5 users) · Maison 12 000 FCFA/month (15 users).
- Durations: 1 month, 3 months (−10 %), 12 months (10 paid). Amounts: Solo 2 500 / 6 750 / 25 000 · Atelier 6 000 / 16 200 / 60 000 · Maison 12 000 / 32 400 / 120 000.
- Flow: choose plan + duration → `payment_requests` row with short reference (`PM-4821`) and exact amount → instructions (Flooz and Mixx by Yas merchant numbers) → "J'ai payé" with operator transaction ID or SMS screenshot → pending.
- `confirm_payment(request_id, tx_ref, source)`: single activation path for manual confirmation now and the PayGate webhook later; idempotent on `tx_ref`. New end date = later of (today, current end) + months.
- Limits enforced in the database, not only the UI. Reminders D−7 and D−1 (pg_cron → in-app banner + back-office list). 7-day grace period, then fall back to free limits: no new orders beyond the limit, but existing orders stay editable, deliverable and payable; viewing and export always allowed. Upgrade converts remaining days by value; downgrade applies at period end. Only the owner sees billing.
- Screens: plan cards, payment instructions with copy button, "J'ai payé" form, status, three banners (limit reached, expires in 7 days, grace period).

### Sprint 4–5

**R7 · Back-office — 3 d**
- `/admin` route, lazy-loaded, `platform_admins` only, MFA required.
- Pending payment requests (workshop, plan, amount, reference, transaction ID, date) with Confirm / Refuse; "À relancer aujourd'hui" list with one-tap wa.me message; subscriptions overview.

### Sprint 5

**R8 · Notebook photo import — 4 d**
- Edge Function `import-photo`: photo → vision API → JSON (name, phone, measurements, each with a confidence).
- Review screen: uncertain values highlighted, field-by-field validation, nothing saved before "Valider" (IMP-02). Photo deleted after import unless the user chooses otherwise (IMP-03). CSV import as a secondary path (IMP-04).
- Done when: REC-24 passes and a real notebook page from a pilot is imported with manual correction under 2 minutes.

### Sprint 6

**R9 · Production — 3 d**
- Automatic backups + one documented restore drill before the pilot (REC-18). Per-workshop CSV export (CLI-08).
- Integration of the teammate's features, final code review, error monitoring, deployment for the pilot, test on 2–3 entry-level Android phones.

## 7. The teammate's side (review, don't implement unless asked)

Clients (CLI) · Measurements and templates (MES) · Orders (ORD) · "Aujourd'hui" screen and calendar (CAL) · Payments UI (PAY, on top of Ron's SQL) · PDFs with QR (DOC) · Public tracking page, receipt check page and wa.me messages (SUI, NOT). The teammate proposes schema changes in a PR; Ron writes the migration.

## 8. How to work in this repo

- Branches `feat/<area>-<short-name>`, conventional commits, small PRs (one feature or fix).
- Never edit an applied migration; add a new one.
- Every UI string goes in `i18n/fr.ts`. Never hard-code amounts or dates formatting; use the shared formatters.
- Sample data uses invented names only, never real clients.
- When a rule here conflicts with a request, say so before coding.

## 9. Open decisions

Design direction (A, B or C) · SMS provider for Togo · Supabase region after latency test · IPDCP declaration (before real data) · PayGate Global vs FedaPay for automated subscription payments (after ~30 paying workshops) · company registration (needed for Flooz/Mixx merchant accounts).
