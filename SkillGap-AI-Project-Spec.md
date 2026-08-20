# SkillGap AI

## Overview

SkillGap AI is a web app that helps freshers (entry-level job seekers) understand exactly how well their resume matches a job they're applying to — and what to do about the gaps. A user submits their resume and a job description; the app returns a match score, a breakdown of what already fits, what's missing, and concrete suggestions to close each gap. Past analyses are saved per account, so users can track whether their resume is actually improving over time.

## Problem Statement

Freshers applying to their first jobs often can't tell why they aren't hearing back. A job description lists requirements in language that doesn't always match how a student describes their own coursework and projects — so a resume can genuinely qualify a candidate while still reading, to both a human recruiter and an ATS system, as a weak match. Freshers rarely get feedback on *why* an application didn't land, which means they can't improve for the next one. There's no accessible, low-friction way for a student to check "does my resume actually fit this JD, and if not, what exactly is missing?" before they apply.

## Solution

SkillGap AI closes that feedback loop with a focused, single-purpose flow:

1. **Input** — the user provides a resume (upload or paste) and a job description (paste)
2. **Analysis** — an LLM compares the two and returns:
   - A **matching score** (simple percentage)
   - **Matching points** — skills/requirements present in both
   - **Missing points** — JD requirements not found in the resume
   - **Suggestions** — how to address each missing skill
   - An **early analysis comparison** — a side-by-side view of resume vs. JD
3. **History & progress** — each analysis is saved to the user's account. After a new score appears, the user is prompted to compare it against any previous analysis, viewed as a full side-by-side of both complete results — so a fresher can see concretely whether their resume is getting stronger.

Deliberately out of scope for this phase: ATS formatting analysis (parsability, keyword density, layout issues). This is planned as a later addition once the core matching flow is solid.

## Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Frontend | React (plain JSX + CSS files) | No Tailwind, no CSS Modules |
| Backend | Python — FastAPI | REST API for auth, resume parsing, AI calls, history |
| Database | MongoDB | Analysis records are naturally document-shaped (score, arrays of points, raw text, timestamp) |
| Auth | Login/signup (e.g. Firebase Auth, or JWT-based auth in FastAPI) | Needed to store per-user analysis history |
| Resume parsing | `pdfplumber` / `PyPDF2` (PDF), `python-docx` (DOCX) | Extracts text server-side before sending to the AI |
| AI / matching logic | LLM API (e.g. Google Gemini free tier) via prompt engineering | Structured JSON output: score, matching points, missing points, suggestions |

## Folder Structure

```
skillgap-ai/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   ├── LoginForm.css
│   │   │   │   ├── SignupForm.jsx
│   │   │   │   └── SignupForm.css
│   │   │   ├── upload/
│   │   │   │   ├── ResumeInput.jsx
│   │   │   │   ├── ResumeInput.css
│   │   │   │   ├── JobDescriptionInput.jsx
│   │   │   │   └── JobDescriptionInput.css
│   │   │   ├── report/
│   │   │   │   ├── MatchScoreRing.jsx
│   │   │   │   ├── MatchScoreRing.css
│   │   │   │   ├── SkillsMatched.jsx
│   │   │   │   ├── SkillsMissing.jsx
│   │   │   │   ├── SkillsList.css
│   │   │   │   ├── ComparisonPopup.jsx
│   │   │   │   └── ComparisonPopup.css
│   │   │   ├── compare/
│   │   │   │   ├── CompareView.jsx
│   │   │   │   └── CompareView.css
│   │   │   └── layout/
│   │   │       ├── Sidebar.jsx
│   │   │       ├── Sidebar.css
│   │   │       ├── Navbar.jsx
│   │   │       └── Navbar.css
│   │   ├── pages/
│   │   │   ├── AuthPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── ReportPage.jsx
│   │   │   ├── ComparePage.jsx
│   │   │   └── HistoryPage.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── App.jsx
│   │   └── index.js
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── routes/
│   │   │   ├── auth_routes.py
│   │   │   ├── analysis_routes.py
│   │   │   └── history_routes.py
│   │   ├── services/
│   │   │   ├── resume_parser.py
│   │   │   ├── ai_matcher.py
│   │   │   └── comparison_service.py
│   │   ├── models/
│   │   │   ├── user_model.py
│   │   │   └── analysis_model.py
│   │   ├── db/
│   │   │   └── mongo_client.py
│   │   └── utils/
│   │       └── auth_utils.py
│   ├── requirements.txt
│   └── .env
│
└── README.md
```

## Core Flow Summary

1. User logs in / signs up
2. User submits resume (upload or paste) + JD (paste) on the dashboard
3. Backend extracts resume text (if uploaded) → sends resume + JD text to the LLM
4. LLM returns structured JSON: score, matching points, missing points, suggestions
5. Result is saved to MongoDB under the user's account and shown on the report page
6. Popup: "Compare with a previous match?" → if yes, user picks a past analysis → full side-by-side comparison view

**Next phase (not in this build):** ATS formatting analysis.
