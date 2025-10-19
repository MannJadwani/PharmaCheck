## Clinical Posting Companion (MVP)

An MVP of the PharmaCheck clinical posting companion. Students can log anonymised patient cases, capture prescriptions, and receive instant AI-style feedback (currently powered by a deterministic mock). Faculty can browse the in-browser queue and leave quick decisions. All data is stored in the browser’s `localStorage` for now.

### Stack
- Next.js App Router + TypeScript + Tailwind
- Client-side store persisted to `localStorage`
- API route stub (`/api/ai/check`) returning mock Gemini 2.5 Flash-style feedback using deterministic rules

### Running the app

```bash
pnpm install
pnpm dev
```

Visit `http://localhost:3000`.

### Key flows
- **Student dashboard** (`/`): case overview cards, local case history.
- **Log case** (`/student/cases/new`): multi-section form that validates input, calls the mock AI checker, persists the case, and displays the response.
- **Faculty queue** (`/faculty/cases`): review submitted cases, view the AI summary, and mark as approved / needs revision with canned feedback stored locally.

### Local data behaviour
- Cases live entirely in the browser via `localStorage`, scoped to `pharmacheck.cases`.
- Clearing browser storage or switching devices removes the data.
- Faculty actions update the saved case records immediately.

### Next steps
1. Replace the mock AI report with a real Gemini 2.5 Flash integration (server-side fetch).
2. Introduce authentication + role separation.
3. Move persistence to a real database (e.g., Supabase/Postgres) and add file uploads.
4. Layer in deterministic drug/condition checks when the licensing path is decided.
