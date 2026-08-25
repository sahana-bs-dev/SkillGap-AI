# SkillGap AI — Phase 1: Project Setup & Authentication (Backend)

## Overview

This phase covers setting up the FastAPI backend from scratch, connecting it to MongoDB Atlas, and building a complete authentication system — email/password signup and login with JWT tokens, plus Google Sign-In as an alternative auth method.

## Packages Installed

| Package | Purpose |
|---|---|
| `fastapi` | Web framework for building the API |
| `uvicorn` | ASGI server to run the FastAPI app |
| `pymongo` | MongoDB driver for Python |
| `python-dotenv` | Loads variables from `.env` into the app |
| `passlib[bcrypt]` | Password hashing |
| `python-jose[cryptography]` | JWT creation and verification |
| `pydantic` | Data validation (comes bundled with FastAPI) |
| `pydantic[email]` (`email-validator`) | Validates email format in request bodies |
| `bcrypt==4.0.1` | Pinned version — newer versions break `passlib`'s bcrypt backend |
| `google-auth` | Verifies Google ID tokens for Google Sign-In |

## Steps Completed

### Step 1 — Project Setup
- Created the `backend/` folder and a Python virtual environment
- Installed the core packages
- Set up the planned folder structure: `app/main.py`, `app/config.py`, `app/routes/`, `app/models/`, `app/db/`, `app/utils/`
- Confirmed the server runs with a minimal FastAPI app, verified via Swagger UI (`/docs`)

### Step 2 — MongoDB Connection
- Created a free MongoDB Atlas cluster (`SkillGapAI-cluster`)
- Created a database user and configured Network Access (IP allowlist, including "allow from anywhere" for development)
- Stored the connection string as `MONGO_URI` in `.env`
- Created `mongo_client.py` to connect to the `skillgapai` database and expose the `users` collection
- Verified the connection via a temporary `/test-db` route in `main.py`

### Step 3 — User Model
- Created `user_model.py` defining `UserSignup` (name, email, password) and `UserLogin` (email, password) schemas using Pydantic

### Step 4 — Password Hashing
- Created `auth_utils.py` with `hash_password()` and `verify_password()` functions using `passlib`'s bcrypt context
- Fixed a `passlib`/`bcrypt` version incompatibility by pinning `bcrypt==4.0.1`

### Step 5 — JWT Token Logic
- Added `create_access_token()` and `decode_access_token()` functions to `auth_utils.py`
- Stored the JWT signing secret as `JWT_SECRET_KEY` in `.env` (loaded via `python-dotenv`), rather than hardcoding it

### Step 6 — Signup & Login Routes
- Created `auth_routes.py` with:
  - `POST /auth/signup` — checks for existing email, hashes the password, saves the user, returns a JWT
  - `POST /auth/login` — verifies email and password, returns a JWT
- Registered the router in `main.py` under the `/auth` prefix

### Step 7 — Testing
- Verified duplicate signup is blocked
- Verified correct login returns a token
- Verified incorrect password is rejected
- Confirmed user documents appear correctly in MongoDB Atlas (`skillgapai` → `users`), with passwords stored as bcrypt hashes, not plain text

### Step 8 — CORS Setup
- Added `CORSMiddleware` to `main.py` to allow requests from the React frontend (`localhost:5173`)

### Step 9 — Frontend Integration (Together)
- Connected the Login and Signup forms to the `/auth/signup` and `/auth/login` endpoints via `fetch` calls
- Confirmed signup/login work end-to-end through the actual UI, with the returned JWT stored in `localStorage`
- Set up routing (`react-router-dom`) so login redirects to the Dashboard page and signup redirects to the Upload page

### Step 10 — Google Sign-In
- Created a Google Cloud project and OAuth Client ID (Web application type, with `localhost:5173` as an authorized origin)
- Added a `POST /auth/google` route in `auth_routes.py` that:
  - Verifies the Google ID token using `google-auth`
  - Creates a new user (if the Google email hasn't signed up before) or logs in an existing one
  - Returns the same JWT format as regular login, so the rest of the app doesn't need to treat Google users differently
- Connected `@react-oauth/google`'s `GoogleLogin` button on both the Login and Signup forms, wired to the new `/auth/google` endpoint
- Confirmed Google login redirects to Dashboard and Google signup redirects to Upload

## Files Created/Modified in This Phase

**Backend:**
- `app/main.py`
- `app/db/mongo_client.py`
- `app/models/user_model.py`
- `app/utils/auth_utils.py`
- `app/routes/auth_routes.py`
- `.env`

**Frontend:**
- `src/main.jsx`
- `src/App.jsx`
- `src/components/auth/LoginForm.jsx`
- `src/components/auth/SignupForm.jsx`
- `src/services/api.js`
- `src/pages/DashboardPage.jsx` (placeholder)
- `src/pages/UploadPage.jsx` (placeholder)

## Outcome

Phase 1 is fully complete: users can sign up and log in with either email/password or Google, sessions are secured with JWT, passwords are hashed with bcrypt, all user data is stored in MongoDB Atlas, and the frontend correctly redirects based on the auth method and action (login → Dashboard, signup → Upload).