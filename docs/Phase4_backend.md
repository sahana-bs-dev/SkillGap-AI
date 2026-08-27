# SkillGap AI — Phase 4: History & Comparison (Backend)

## Overview

This phase covers building the backend for saving every resume analysis to the database and exposing endpoints to retrieve past analyses — both as a full history list and as individual records for side-by-side comparison. This is what powers the "Compare with a previous match?" popup and the Compare page on the frontend, and turns the previously undifferentiated "Recent analyses" list into real, per-user data.

## Packages Used

No new packages were required — this phase reused the existing `pymongo` connection and `bson.ObjectId` (bundled with `pymongo`) to work with MongoDB document IDs.

## Steps Completed

### Step 1 — History Data Model
- Created `app/models/history_model.py` defining the shape of a saved analysis record (`AnalysisRecord`), along with nested models for `MissingPoint` and `Suggestion`
- Mirrors the exact structure Phase 3's `analyze_resume_vs_jd()` already returns (`match_score`, `matching_points`, `missing_points`, `suggestions`), plus additional fields (`user_email`, `resume_text`, `jd_text`) to identify who the analysis belongs to and what was analyzed

### Step 2 — History Collection Reference
- Extended `app/db/mongo_client.py` with a new `history_collection = db["analysis_history"]` reference, alongside the existing `users_collection`
- No manual collection creation needed — MongoDB creates `analysis_history` automatically on first insert

### Step 3 — Save Analysis on Every Run
- Modified `app/routes/upload_routes.py` so that immediately after Gemini returns its analysis in `POST /upload/analyze`, the result is packaged into a record (with `user_email`, `job_title`, `resume_text`, `jd_text`, a UTC `date` timestamp, and the AI's output) and inserted into `history_collection`
- The inserted MongoDB `_id` is converted to a string and included in the API response as `id`, so the frontend can reference this exact saved analysis later (e.g., to exclude it from its own "compare against" list)
- Added a `derive_job_title()` helper that generates a readable label from the first ~8 words of the pasted job description, replacing an earlier hardcoded `"Resume analysis"` value so that different analyses are visually distinguishable in history/comparison views

### Step 4 — History Routes
- Created `app/routes/history_routes.py` with two protected endpoints (both behind `get_current_user`, reusing the same JWT dependency from Phase 2):
  - `GET /history` — returns all saved analyses belonging to the logged-in user, sorted newest first
  - `GET /history/{attempt_id}` — returns one specific saved analysis by its MongoDB `_id`; returns `400` for a malformed ID and `404` if no matching record exists for that user
- Both endpoints filter strictly by `user_email`, so a user can only ever retrieve their own analyses even though all users' data lives in the same shared collection
- Added a `serialize()` helper that reshapes raw MongoDB documents into the exact field names the frontend expects (`id`, `jobTitle`, `company`, `date`, `score`, `matched`, `missing`) — this made swapping the frontend off mock data a drop-in change with no component logic rewrites needed

### Step 5 — Registered the Router
- Registered `history_router` in `main.py` under the `/history` prefix, alongside the existing `auth_router` and `upload_router`

### Step 6 — Testing (via Swagger UI)
- Verified `GET /history` and `GET /history/{attempt_id}` both correctly return `401` without a valid JWT
- Verified an authenticated `GET /history` call returns a JSON array containing previously saved analyses with the correct shape
- Verified a saved analysis appears in MongoDB Compass under `skillgapai.analysis_history` immediately after running an analysis, with the resume text, JD text, score, and skill breakdown all present
- Verified `GET /history/{attempt_id}` correctly retrieves a single record by ID, and correctly returns `404` for an ID belonging to another user or a deleted record

### Step 7 — Frontend Integration (Together)
- Replaced the frontend's hardcoded `mockAnalysisHistory` / `mockComparison` data (in `ComparisonPopup.jsx`, `ComparePage.jsx`, `CompareView.jsx`) with real calls to `getAnalysisHistory()` and `getAnalysisById()` in `services/api.js`
- Wired `ReportPage.jsx` to fetch real history on load and pass it into the comparison popup, excluding the current analysis from its own comparison list
- Fixed an ordering bug where the newly created analysis and the previously selected one were swapped when navigating to `/compare`, which caused the score delta badge to display misleadingly (e.g., a genuinely better new resume showing a red "-15%" instead of a green "+15%")
- Confirmed the full flow end-to-end through the actual UI: running two real analyses, comparing them, and seeing accurate matched/missing skills and a correctly signed score delta pulled entirely from MongoDB

## Files Created/Modified in This Phase

**Backend:**
- `app/models/history_model.py` (new)
- `app/routes/history_routes.py` (new)
- `app/db/mongo_client.py` (modified — added `history_collection`)
- `app/routes/upload_routes.py` (modified — save-on-analyze logic, `derive_job_title()`)
- `app/main.py` (modified — registered `history_router`)

**Frontend:**
- `src/components/report/ComparisonPopup.jsx` (modified — removed mock fallback)
- `src/pages/ReportPage.jsx` (modified — fetches real history, passes it to popup)
- `src/pages/ComparePage.jsx` (modified — fetches real attempt by ID)
- `src/components/compare/CompareView.jsx` (modified — removed mock fallback)
- `src/data/mockCompareData.js` (removed — no longer referenced anywhere)

## Outcome

Phase 4 backend is fully complete and verified: every analysis is now persisted to MongoDB under the logged-in user's email, with a readable, auto-derived job title. Two authenticated endpoints expose this data for the frontend's history list and comparison views, filtered so each user only ever sees their own analyses. Combined with the frontend rewiring, the "Compare with a previous match?" flow and the Compare page now run entirely on real, per-user data instead of the placeholder mock data they launched with.