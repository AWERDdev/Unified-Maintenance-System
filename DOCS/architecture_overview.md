# Architecture Overview — Unified Maintenance Escalation System (UMES)

**Audit date:** 2026-07-17  
**Scope:** `client/` (Next.js frontend) and `server/` (Express API)

---

## 1. System Summary

UMES is a bilingual (English / Arabic) school maintenance ticketing platform for Egyptian Ministry of Education staff. It supports role-based workflows: teachers view school tickets; administrators / IT specialists create and resolve tickets; principals / vice principals approve funding.

The system is a **two-tier monolith**:

| Tier | Role | Hosting hint |
|------|------|----------------|
| **Client** | SPA-style App Router UI | Vercel (`unifiedmaintenanceescalationsystem.vercel.app`) |
| **Server** | REST API + MongoDB | Separate Node process / Vercel serverless backend |

There are **no microservices**. Communication is HTTP/JSON with cookie-based JWT sessions.

---

## 2. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  Browser (Next.js App Router, React 19, Tailwind CSS 4)         │
│  • Pages: intro, login, signup, dashboard, ticket create,       │
│    profile, about                                               │
│  • Role views: TeacherView | AdminView | PrincipalView          │
│  • State: local React useState/useEffect (no Redux/Zustand)     │
│  • i18n: Content_DICT + useLanguage (localStorage)              │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS / HTTP
                             │ fetch(..., { credentials: 'include' })
                             │ JSON body + HttpOnly cookie `token`
┌────────────────────────────▼────────────────────────────────────┐
│  Express 5 API (Node.js, CommonJS)                              │
│  Middleware: helmet → CORS → JSON → cookie-parser → rate limit  │
│  Routes:                                                        │
│    /auth/*     signup, login, logout, me                        │
│    /routes/*   profile/status, ticket CRUD-ish operations       │
└────────────────────────────┬────────────────────────────────────┘
                             │ Mongoose ODM
┌────────────────────────────▼────────────────────────────────────┐
│  MongoDB (`unified_main`)                                       │
│  Collections: `staff`, `tickets`                                │
└─────────────────────────────────────────────────────────────────┘
```

### 2.1 Client ↔ Server Communication

| Concern | Implementation |
|---------|----------------|
| **Protocol** | HTTP(S) |
| **API style** | REST-ish JSON over Express routers |
| **Auth transport** | JWT stored in `HttpOnly` cookie named `token` |
| **CORS** | Explicit origin allowlist; `credentials: true` |
| **Client base URL** | `localhost:3500` in local browser; production API URL hardcoded in `API_handler.ts` |
| **State management** | Component-local React state; no global store; auth re-checked via `/auth/me` on protected pages |
| **Validation** | Client: custom validators; Server auth: Zod schemas; Ticket body: ad-hoc checks |

### 2.2 Auth Flow

1. Staff signs up only if `national_id` exists in `AUTH/allowed_staff.json` (whitelist).
2. Password hashed with bcrypt (salt rounds 10); stored with `select: false`.
3. Login / signup issue JWT (`{ email }`, 1h expiry) and set cookie (`httpOnly`, `secure`/`sameSite` by `NODE_ENV`).
4. Protected routes read `req.cookies.token`, verify JWT, load staff by email.
5. Logout clears the cookie.

### 2.3 Ticket Workflow (Intended)

```
Create (Admin / IT / Super Admin)
    → status: Pending_Approval
Principal / Vice Principal funds
    → principalFunded: true, status → In_Progress
Admin / IT resolves
    → status: Resolved
Teachers (and similar roles)
    → read-only school ticket list
```

**Note:** Admin technical approval (`adminApproved`) exists on the model and UI, but the server approve handler currently only sets `principalFunded` (admin path is commented out).

---

## 3. Directory Structure & Patterns

### 3.1 Repository Layout

```
Unified-Maintenance-System/
├── client/                 # Next.js 16 frontend
│   ├── public/             # Static assets, ColorPallet.json, icons
│   └── src/
│       ├── app/            # App Router pages (file-based routing)
│       ├── components/     # Presentational / role dashboard views
│       ├── Dict/           # i18n dictionary
│       ├── tools/          # API helpers, auth check, validation, i18n hook
│       └── Types/          # TypeScript interfaces & route constants
├── server/                 # Express API
│   ├── AUTH/               # Auth routers + whitelist JSON
│   ├── DB/                 # Mongo connect + Mongoose models
│   ├── middlewares/        # Rate limit + Zod validation
│   ├── routes/             # Profile + ticket routers
│   └── test/               # Manual JSON fixtures / notes (not automated)
└── docs/                   # Project documentation (this audit)
```

### 3.2 Architectural Patterns

| Layer | Pattern | Notes |
|-------|---------|-------|
| Overall | **Modular monolith** (split deployables) | Not microservices; shared domain, two processes |
| Server | **Layered / Router-centric** | Thin Express routers + Mongoose models; no service layer |
| Auth | **JWT cookie sessions** + **whitelist gate** for signup |
| Client | **Component-driven UI** + **App Router pages** | Role dashboards as presentational components |
| RBAC | **Role string checks in handlers / pages** | Roles stored as free-form `staff_Type` strings |
| i18n | **Dictionary-driven** | EN/AR via `contentDict` |

**Not used:** MVC frameworks, GraphQL, message queues, Prisma/Postgres (despite outdated About-page comment), Redux, React Query, Next.js middleware auth guards.

---

## 4. Tech Stack

### 4.1 Client

| Category | Technology | Version (from package.json) |
|----------|------------|------------------------------|
| Runtime / framework | Next.js (App Router) | 16.2.9 |
| UI library | React / React DOM | 19.2.4 |
| Language | TypeScript | ^5 |
| Styling | Tailwind CSS + PostCSS | ^4 |
| Icons | lucide-react | ^1.17.0 |
| Compiler | babel-plugin-react-compiler | 1.0.0 (`reactCompiler: true`) |
| Lint | ESLint + eslint-config-next | 9 / 16.2.9 |
| Fonts | Geist / Geist Mono (next/font) | — |

### 4.2 Server

| Category | Technology | Version |
|----------|------------|---------|
| Runtime | Node.js (CommonJS) | — |
| Framework | Express | ^5.2.1 |
| Database | MongoDB via Mongoose | ^9.7.0 |
| Auth | jsonwebtoken, bcrypt, cookie-parser | ^9 / ^6 / ^1.4 |
| Validation | Zod | ^4.4.3 |
| Security middleware | helmet, cors, express-rate-limit | ^8 / ^2.8 / ^8.5 |
| Config | dotenv | ^17.4.2 |
| Dev | nodemon | ^3.1.14 |

### 4.3 Data Model (Conceptual)

**Staff** (`staff`): `national_id`, `legal_name`, `phone`, `email`, `password` (hidden), `staff_Type`, `school`, timestamps.

**Ticket** (`tickets`): `asset`, `room`, `category` (enum), `status` (enum), `arCategory`, `adminApproved`, `principalFunded`, `cost`, `school`, `createdBy` → Staff, timestamps.

### 4.4 External / Ops Assumptions

- Frontend and API are **cross-origin** in production (separate Vercel apps), hence `sameSite: "none"` + `secure: true` cookies.
- MongoDB Atlas or local Mongo via `MONGODB_URL`.
- No CI test runner wired (`server` `test` script is a stub).

---

## 5. API Surface (Current)

### Auth (`/auth`)

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/auth/staff/signup` | Whitelist-gated registration |
| POST | `/auth/staff/login` | Login + set cookie |
| POST | `/auth/staff/logout` | Clear cookie |
| GET | `/auth/me` | Cookie JWT presence / decode |

### Application (`/routes`)

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/routes/fetch/status` | Role + school for UI routing |
| GET | `/routes/fetch/profile` | Full profile (incl. national_id, phone) |
| POST | `/routes/tickets/create` | Create ticket (elevated roles) |
| GET | `/routes/tickets/my` | Tickets filtered by school |
| GET | `/routes/tickets/all` | All tickets (elevated roles; no school filter) |
| PATCH | `/routes/tickets/:id/approve` | Principal funding (partial) |
| PATCH | `/routes/tickets/:id/resolve` | Mark resolved |

---

## 6. Client Route Map

| Route constant | Path | Page |
|----------------|------|------|
| `IntroPage` | `/` | Marketing / landing |
| `Staff_Login` | `/Staff_Login` | Login form |
| `Staff_Signup` | `/Staff_Signup` | Signup form |
| `About` | `/About` | Product about |
| `Main_Page` | `/Main_page` | Role dashboard |
| `Ticket_creation_page` | `/Main_page/Ticket_creation` | Create ticket |
| `Profile` | `/profile` | Profile + logout |

Protected pages rely on **client-side** `isAUTH()` redirects, not Next.js middleware.

---

## 7. Architectural Strengths

- Clear separation of frontend and API deployables.
- Sensible security baselines present: Helmet, CORS allowlist, HttpOnly cookies, bcrypt, Zod on auth, rate limiting.
- Role-oriented UI composition matches the domain workflow.
- First-class bilingual EN/AR support with RTL awareness.

## 8. Architectural Risks (Summary)

Detailed findings live in `security_and_performance.md` and `final_evaluation.md`. Highest-impact architectural gaps:

1. **Duplicated auth helpers** and inconsistent JWT claims (`email` only; `/me` expects `id`).
2. **No shared RBAC middleware**; school tenancy incompletely enforced.
3. **Schema / code drift** (`school` vs `staff_school`, ticket `id`/`date` fields not in schema).
4. **No automated tests** or shared API contract (OpenAPI / typed client).
5. **Client-only route protection** — easy to bypass for UI; server must remain the real gate (and currently has gaps).

---

## 9. Recommended Target Architecture (Evolutionary)

Without rewriting the product:

1. Extract `requireAuth` + `requireRoles` + `requireSameSchool` middleware.
2. Put `id`, `email`, `staff_Type`, `school` in JWT (or always hydrate from DB after verify).
3. Add Zod schemas for all ticket mutations.
4. Introduce a thin `services/` layer for ticket lifecycle rules.
5. Add Next.js middleware for cookie presence on `/Main_page`, `/profile`, etc. (defense in depth).
6. Align CORS allowlist and `BASE_URL` to one canonical production origin pair.
)