# SkillGap AI

**An AI-powered resume-to-job-description gap analysis tool**

---

## Problem Statement

Job seekers — especially students and early-career candidates — apply to roles without a clear, objective sense of how well their resume actually matches what a job description is asking for. This leads to three recurring problems:

- **Blind applications.** Candidates apply to roles with significant skill gaps they aren't aware of, leading to low response rates and wasted effort.
- **Generic resume advice.** Most resume tools give one-size-fits-all formatting tips (font size, bullet count) instead of telling a candidate what's *actually* missing for a *specific* role.
- **No actionable next step.** Even when a gap is identified, candidates are left to figure out on their own what to learn, build, or fix — with no prioritized plan and no guidance grounded in what they've already done.

The result: candidates either under-prepare (apply blindly) or over-prepare (learn generic skills unrelated to their actual target role), both of which waste time during a placement or job search cycle.

---

## Solution

SkillGap AI compares a candidate's resume against a specific job description and produces a grounded, prioritized action plan — not generic advice.

The core idea: separate **deterministic extraction** from **AI reasoning**. Resumes and JDs are first parsed into clean structured data, and only then handed to an LLM for comparison — keeping the expensive, fuzzy reasoning step focused on clean input instead of raw, messy text.

**What it does:**
1. Parses a resume and a job description into structured data (skills, experience, requirements).
2. Runs an AI-driven gap analysis: match score, matching skills (strengths), and missing skills — ranked as must-have vs nice-to-have.
3. Runs a separate ATS-quality check (keyword coverage, formatting, structure) independent of any one JD.
4. Generates a personalized roadmap: prioritized learning steps, project ideas, certifications, interview prep topics, and line-level resume rewrite suggestions — all grounded in the candidate's real content, never invented.
5. Tracks history across multiple analyses so a candidate can see their match score trend over time and their most frequent recurring gap.

**What makes it different from a generic resume checker:**
- Every recommendation is tied to a specific JD, not generic best practices.
- Resume rewrite suggestions are grounded in the candidate's actual project/experience content — the AI is constrained to never fabricate achievements.
- Skill gaps are ranked by priority, not just listed, so a candidate knows what to fix first.

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | Next.js (App Router) | UI, client-side routing, dashboard |
| Styling | Tailwind CSS + shadcn/ui | Component system, design consistency |
| Backend | Next.js (API-only project) | REST API layer, business logic |
| Database | Supabase (PostgreSQL) | Relational data — users, resumes, JDs, analyses |
| Auth | Supabase Auth | Login, signup, session management, RLS-based access control |
| File Storage | Supabase Storage | Resume and JD file storage |
| AI | OpenAI API | Resume/JD parsing, gap analysis, roadmap generation |
| Validation | Zod | Schema validation for all LLM-returned JSON |
| PDF/DOCX Parsing | `pdf-parse`, `mammoth` | Raw text extraction before LLM structuring |
| Deployment | Vercel | Hosting for both frontend and backend projects |

---

## User Journey

```
1. Sign up / Log in
        │
        ▼
2. Land on Dashboard (empty state on first visit)
        │
        ▼
3. Start a new analysis
        │
        ├── Upload resume (PDF/DOCX)
        └── Provide JD (paste, upload, or select a previous one)
        │
        ▼
4. Parsing
   Resume → structured JSON (skills, education, experience, projects)
   JD     → structured JSON (required skills, nice-to-have, role, level)
        │
        ▼
5. Review extracted data
   User confirms or corrects what was parsed before analysis runs
        │
        ▼
6. AI Gap Analysis
   Match score · Matching skills (strengths) · Missing skills (ranked)
        │
        ├──────────────┐
        ▼              ▼
7. ATS Report    8. Personalized Roadmap
   Score,           Learning steps, project ideas,
   keyword          certifications, interview topics,
   coverage,        resume rewrite suggestions
   format checks    (before/after)
        │              │
        └──────┬───────┘
               ▼
9. Dashboard / History
   All past analyses, score trend over time,
   most frequent recurring gap
```

**Key journey rule:** an analysis always requires both a resume and a JD before it can run — there's no partial or assumed state. If a JD isn't provided, the user is prompted to add one rather than the system proceeding with stale or missing data.

---

## Folder Structure

Two separate Next.js projects — one frontend, one backend-only — communicating over a REST API. This keeps UI concerns fully separate from business logic, AI orchestration, and database access.

### Frontend (`skillgap-frontend/`)

```
skillgap-frontend/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── signup/
│   │   │   └── page.tsx
│   │   └── forgot-password/
│   │       └── page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx                 # sidebar + protected route wrapper
│   │   ├── dashboard/
│   │   │   └── page.tsx               # history, stats, score trend
│   │   ├── upload/
│   │   │   └── page.tsx               # resume + JD upload
│   │   ├── analysis/
│   │   │   └── [analysisId]/
│   │   │       ├── page.tsx           # match score, skills
│   │   │       ├── ats/page.tsx       # ATS report
│   │   │       └── roadmap/page.tsx   # learning roadmap
│   │   └── profile/
│   │       └── page.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                            # shadcn/ui primitives
│   ├── upload/
│   │   ├── ResumeDropzone.tsx
│   │   └── JdInput.tsx
│   ├── analysis/
│   │   ├── MatchScoreGauge.tsx
│   │   ├── SkillChip.tsx
│   │   └── SkillGapList.tsx
│   ├── roadmap/
│   │   ├── TimelineItem.tsx
│   │   └── RewriteSuggestion.tsx
│   └── dashboard/
│       ├── StatCard.tsx
│       └── HistoryTable.tsx
├── lib/
│   ├── api-client.ts                  # typed fetch wrapper to backend
│   ├── supabase-client.ts             # client-side Supabase (auth only)
│   └── types.ts                       # shared frontend types
├── hooks/
│   ├── useAnalysis.ts
│   └── useAuth.ts
├── public/
├── .env.local
├── tailwind.config.ts
├── next.config.js
└── package.json
```

### Backend (`skillgap-backend/`)

```
skillgap-backend/
├── app/
│   └── api/
│       ├── auth/
│       │   └── session/route.ts       # session validation middleware target
│       ├── resumes/
│       │   ├── upload/route.ts        # store file, save metadata
│       │   └── [id]/parse/route.ts    # extract text → LLM → structured JSON
│       ├── job-descriptions/
│       │   ├── route.ts               # create/list JDs
│       │   └── [id]/parse/route.ts    # JD text → structured JSON
│       ├── analysis/
│       │   ├── route.ts               # POST: run gap analysis
│       │   └── [id]/route.ts          # GET: fetch one analysis
│       ├── ats/
│       │   └── [resumeId]/route.ts    # ATS scoring
│       ├── roadmap/
│       │   └── [analysisId]/route.ts  # generate roadmap + rewrite suggestions
│       └── history/route.ts           # list past analyses, stats
├── lib/
│   ├── supabase-server.ts             # server-side Supabase client
│   ├── openai-client.ts               # OpenAI SDK wrapper
│   ├── parsers/
│   │   ├── extract-text.ts            # pdf-parse / mammoth
│   │   ├── resume-schema.ts           # zod schema for parsed resume
│   │   └── jd-schema.ts               # zod schema for parsed JD
│   ├── prompts/
│   │   ├── resume-parse.prompt.ts
│   │   ├── jd-parse.prompt.ts
│   │   ├── gap-analysis.prompt.ts
│   │   ├── ats-analysis.prompt.ts
│   │   └── roadmap.prompt.ts
│   ├── rate-limit.ts                  # per-user limiting on AI endpoints
│   └── skill-normalize.ts             # canonical skill name mapping
├── middleware.ts                      # auth check on protected routes
├── types/
│   └── db.ts                          # generated Supabase types
├── .env.local
├── next.config.js
└── package.json
```

**Why split this way:**
- The backend is API-only — no pages, no UI — so it can be deployed, scaled, and rate-limited independently of the frontend.
- All OpenAI calls, prompts, and schema validation live in one place (`skillgap-backend/lib`), making it easy to iterate on prompt quality without touching UI code.
- The frontend never talks to Supabase or OpenAI directly except for session-level auth — all data operations go through the backend API, keeping a single, auditable path for anything AI-related or database-related.