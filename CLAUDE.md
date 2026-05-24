# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Full-stack automobile marketplace with NestJS backend and React Router v7 frontend. Supports buyer, seller, admin, and guest roles with vehicle listings, bidding, messaging, and wallet features.

## Commands

### Backend (run from `backend/`)
```bash
npm run start:dev        # Dev server with watch (port 3000)
npm run build            # Compile TypeScript to dist/
npm run start:prod       # Production: node dist/main
npm run test             # Run Jest unit tests
npm run test:watch       # Tests in watch mode
npm run test:e2e         # E2E tests (jest --config ./test/jest-e2e.json)
```

### Frontend (run from `frontend/`)
```bash
npm run dev              # Dev server (port 5173)
npm run build            # SSR build (build/client + build/server)
npm run start            # Serve SSR build
npm run typecheck        # react-router typegen && tsc
```

### Docker
```bash
docker-compose up        # Runs both backend (3000) and frontend (5173)
```

## Architecture

### Backend (NestJS 11 + TypeORM + SQLite)

Each domain is a NestJS module with controller/service/entity/DTO pattern:
- **users/auth** — JWT auth (access+refresh tokens), Google/Facebook OAuth via Passport, email verification, password reset, token blacklisting
- **vehicles** — CRUD listings with 40+ spec fields, seller-owned
- **bids** — Buyer-only bid placement on vehicles
- **messages** — Conversation-based messaging between buyers and sellers
- **saved-vehicles** — Buyer wishlist
- **wallet** — Cards and transaction history
- **dashboard** — Role-based dashboard aggregation
- **upload** — Image upload via Cloudinary + multer

**Key backend details:**
- Global ValidationPipe with `whitelist: true`, `transform: true`, `forbidNonWhitelisted: true`
- CORS configured for `FRONTEND_URL` env var (default `http://localhost:5173`)
- SQLite in WAL mode; TypeORM `synchronize: true` in dev (auto-schema)
- Throttling on auth endpoints (5 attempts/minute for login)
- Role enum: ADMIN, BUYER, SELLER, GUEST — checked at service layer

### Frontend (React 19 + React Router 7 + Zustand + Tailwind v4)

**Routing:** Two layout routes in `app/routes.ts`:
- `auth-layout` — login, register, forgot/reset password, OAuth callback
- `app-layout` — dashboard, listings, bids, messages, wallet, settings, etc.

**State management:** Zustand stores with localStorage persistence:
- `auth.store` — user, tokens, isAuthenticated (key: "auth-storage")
- `compare.store` — vehicle comparison list
- `notifications.store` — toast notifications

**API layer:** `app/api/http.api.ts` creates an Axios instance with interceptors that auto-inject Bearer tokens and auto-refresh on 401 with a request queue.

**Import alias:** `~/` maps to `./app/` (configured in tsconfig + vite).

### Data Flow
```
Component → Custom Hook (useXxxActions) → API Layer (axios) → NestJS Controller → Service → TypeORM → SQLite
```

### Environment Variables

Backend `.env`: `PORT`, `FRONTEND_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, Google/Facebook OAuth credentials, Cloudinary credentials, Mailtrap SMTP credentials.

Frontend `.env`: `VITE_API_URL` (default `http://localhost:3000`).
