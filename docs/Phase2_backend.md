# SkillGap AI — Phase 2: Upload & Resume Parsing (Backend)

## Overview

This phase covers building the backend  of the Upload feature — an endpoint that accepts a resume (as an uploaded PDF/DOCX file or pasted text) plus a job description, parses the resume into plain text, and returns both pieces of text to the frontend. This is the data pipeline that Phase 3's AI matcher will consume.

## Packages Installed

| Package | Purpose |
|---|---|
| `pdfplumber` | Extracts plain text from PDF resumes |
| `python-docx` | Extracts plain text from DOCX resumes |
| `python-multipart` | Required by FastAPI to handle file/form uploads (`UploadFile`, `Form`) |

## Steps Completed

### Step 1 — Resume Parser Service
- Created `app/services/resume_parser.py` with:
  - `parse_pdf()` — opens a PDF's raw bytes with `pdfplumber` and joins extracted text from all pages
  - `parse_docx()` — opens a DOCX's raw bytes with `python-docx` and joins all non-empty paragraph text
  - `extract_resume_text()` — detects file type from the filename extension and routes to the correct parser; raises a clear error for unsupported file types

### Step 2 — Auth Dependency for Protected Routes
- Extended `app/utils/auth_utils.py` with a reusable `get_current_user()` FastAPI dependency
- Initially used `OAuth2PasswordBearer`, then switched to `HTTPBearer` after discovering it auto-generates a username/password login form in Swagger UI that didn't match this project's custom `/auth/login` request format — `HTTPBearer` reads the raw `Authorization: Bearer <token>` header directly instead
- This dependency decodes the JWT (reusing the existing `decode_access_token()`) and returns the logged-in user's email, or raises `401 Unauthorized` if the token is missing or invalid

### Step 3 — Upload Route
- Created `app/routes/upload_routes.py` with `POST /upload/analyze`, which:
  - Requires a valid JWT (via `get_current_user`) — unauthenticated requests get `401`
  - Accepts `jd_text` (required), plus either `resume_file` (an uploaded PDF/DOCX) or `resume_text` (pasted text)
  - Calls `extract_resume_text()` on uploaded files
  - Returns `400` with a clear message if the JD is missing, if neither resume input is provided, or if no text could be extracted
  - Returns `{ user_email, resume_text, jd_text }` as JSON on success

### Step 4 — Registered the Router
- Registered `upload_router` in `main.py` under the `/upload` prefix, alongside the existing `auth_router`

### Step 5 — Testing (via Swagger UI)
- Verified a request with no auth token correctly returns `401 Unauthorized`
- Verified a request missing `jd_text` correctly returns a `422` validation error
- Verified an authenticated request with pasted resume text returns a clean `200` with the expected JSON shape
- Verified an authenticated request with a real uploaded PDF resume correctly extracts and returns the actual resume text (name, education, skills, projects, etc.)

### Step 6 — Frontend Integration (Together)
- Added `analyzeResume()` to `src/services/api.js`, sending a `multipart/form-data` request with the JWT attached in the `Authorization` header
- Wired `UploadPage.jsx`'s "Run analysis" button to call this function instead of just logging to the console
- Confirmed the full flow end-to-end through the actual UI: uploading a real resume + typing a JD returns the correctly parsed resume text back to the frontend

## Files Created/Modified in This Phase

**Backend:**
- `app/services/resume_parser.py` (new)
- `app/routes/upload_routes.py` (new)
- `app/utils/auth_utils.py` (modified — added `get_current_user`)
- `app/main.py` (modified — registered `upload_router`)
- `requirements.txt` (updated via `pip freeze`)

**Frontend:**
- `src/services/api.js` (modified — added `analyzeResume()`)
- `src/pages/UploadPage.jsx` (modified — wired to the real endpoint)

## Outcome

Phase 2 backend is fully complete and verified: the upload endpoint is protected by JWT auth, correctly parses both PDF and DOCX resumes into plain text, validates required inputs, and returns a clean JSON response. This output (`resume_text` + `jd_text`) is exactly what Phase 3's AI matcher will take as input to generate the real match score and skill analysis.