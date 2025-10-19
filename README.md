## PharmaCheck — Clinical Posting Companion (MVP)

PharmaCheck is a local-first teaching tool for clinical postings. Students can log anonymised patient cases and prescriptions, get safety feedback, and submit for review. Faculty can browse a queue, approve, or request revisions with feedback. In this MVP, all data is stored in the browser.

### What it does
- Student case logging via a guided, multi-step wizard
- Instant “AI safety check” summary (mocked for now) for interactions/dose issues
- Faculty review queue with Approve or Request revision and free-text feedback
- Local-first storage (no accounts, no server database)
- Polished landing page with scroll snapping + subtle parallax background

### Screens and flows
- Landing page: product overview, features, and CTAs
- Dashboard (`/dashboard`): at-a-glance stats of cases by status
- Log a case (`/student/cases/new`): step-by-step case form; save with or without AI
- Faculty queue (`/faculty/cases`): review submitted cases, read AI notes, approve or request revision with feedback

### Tech stack
- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS v4
- Zod for request validation on the API route
- Local state persisted to `localStorage`

### Requirements
- Node.js: ^18.18.0 or ^19.8.0 or >= 20.0.0
- Package manager: pnpm (recommended)

### Getting started
```bash
pnpm install
pnpm dev
```
Visit `http://localhost:3000`.

If you see a workspace-root warning about multiple lockfiles, it is safe to ignore during development or remove the unused lockfile at the system root.

### AI safety check (Gemini) in the MVP
- The API route `/api/ai/check` currently returns a deterministic mock report.
- From the “Log a Case” screen, you can enter a Gemini API key in the “Gemini API Key” field. The key is stored locally in `localStorage` under `pharmacheck.geminiApiKey` and is sent as `x-gemini-api-key` when running the AI check.
- The “Run AI Check & Save” button is disabled until a key is provided. You can always “Save without AI,” which stores a case with an empty AI report.
- Swapping to the real Gemini API later can be done server-side in `src/app/api/ai/check/route.ts` using the provided header.

### Data model and storage
- Cases are stored in-browser only under the key `pharmacheck.cases`.
- Each case includes patient basics, clinical narrative, medications, a student analysis, optional faculty feedback, and an AI report.
- Deleting browser storage removes all locally saved cases.

### Project structure
```
src/
  app/
    page.tsx                  # Landing page
    dashboard/page.tsx        # Dashboard
    student/cases/new/page.tsx# New case (wizard)
    faculty/cases/page.tsx    # Faculty queue
    api/ai/check/route.ts     # Mock AI check endpoint
  components/
    forms/case-form.tsx       # Multi-step case form
    case-list/*                # Student/Faculty lists
    layout/*                   # Navbar, Footer, Parallax BG
    providers/case-store-provider.tsx # Local store
  lib/
    ai/mock-checker.ts        # Deterministic mock AI report
    types.ts                  # Shared types
```

### Scripts
- `pnpm dev` — run the app in development
- `pnpm build` — production build
- `pnpm start` — start production server
- `pnpm lint` — run ESLint

### Known caveats (MVP)
- Local-only data. No sync or auth; everything is device-bound.
- AI responses are mocked. Real Gemini integration is not enabled yet.
- Some browser/dev setups may show a dev-origin warning from Next.js; this does not affect functionality in dev.

### Roadmap
1. Replace mock AI with real Gemini 2.5 via the Google Gen AI SDK (server-side call)
2. Authentication and roles (student/faculty), with protected API routes
3. Persistent database (e.g., Postgres/Supabase) and file uploads
4. Licensed drug data integration and deterministic checks
5. Exports for submission (PDF/print) and basic analytics

### Disclaimer
This project is for education only and is not intended for clinical use.
