# File-by-File Review — Client & Server

**Audit date:** 2026-07-17  
**Scope:** Significant source files under `client/` and `server/`. Config-only, lockfiles, and manual test fixtures are covered briefly where they affect architecture or security.

---

## Server Stack

### `server/index.js`

- **Path:** `server/index.js`
- **Purpose:** Express application bootstrap: security middleware, CORS, body parsers, rate limiting, DB connect, route mounting, listen.
- **Key Implementations:** `app.use(helmet)`, CORS origin callback, `generalLimiter`, mounts `/auth` and `/routes` routers, root health JSON.
- **Code Quality Review:**
  - Production CORS origin (`https://unifiedmaintenance.vercel.app`) does **not** match the client `BASE_URL` host (`unifiedmaintenanceescalationsystem.vercel.app`) — likely broken cross-origin cookies in prod.
  - Allowing `!origin` (null origin) is convenient for curl but weakens CSRF posture when combined with cookie auth.
  - No global error handler or 404 handler.
  - Verbose comment at EOF generating secrets should not ship in production source.

**Refactor — align CORS with client:**

```js
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [process.env.CLIENT_ORIGIN || 'https://unifiedmaintenanceescalationsystem.vercel.app']
  : ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3001'];
```

---

### `server/DB/DB.js`

- **Path:** `server/DB/DB.js`
- **Purpose:** Connects Mongoose to MongoDB using `MONGODB_URL`.
- **Key Implementations:** `connect_DB()`, logs success/failure.
- **Code Quality Review:**
  - **Bug:** `` `${process.env.MONGODB_URL}/unified_main` || fallback `` never uses the fallback — a missing env yields the string `"undefined/unified_main"`.
  - Logs the full URI (may include credentials).
  - No connection options, retry, or process exit on failure.

**Refactor:**

```js
const base = process.env.MONGODB_URL || 'mongodb://localhost:27017';
const dbURI = base.includes('/unified_main') ? base : `${base.replace(/\/$/, '')}/unified_main`;
```

---

### `server/DB/models/Staff_model.js`

- **Path:** `server/DB/models/Staff_model.js`
- **Purpose:** Mongoose schema for staff accounts.
- **Key Implementations:** Fields `national_id`, `legal_name`, `phone`, `email`, `password` (`select: false`), `staff_Type`, `school`; timestamps.
- **Code Quality Review:**
  - Typo: `school.require` should be `required` — school may not be enforced at schema level.
  - `legal_name` unique is overly strict (name collisions).
  - `staff_Type` / `school` are free strings — prefer enums for RBAC safety.
  - No index strategy beyond unique constraints.

---

### `server/DB/models/Ticket_model.js`

- **Path:** `server/DB/models/Ticket_model.js`
- **Purpose:** Mongoose schema for maintenance tickets.
- **Key Implementations:** Enums for `category` / `status`; flags `adminApproved`, `principalFunded`; `createdBy` ref to staff.
- **Code Quality Review:**
  - Schema has no custom `id` or flat `date` field, but create route / client types still assume them — silent strip on save; UI shows Mongo `_id`.
  - Missing compound index `{ school: 1, status: 1 }` for dashboard queries.
  - `Approved` status exists in enum but workflow rarely sets it.

---

### `server/AUTH/is_auth.js`

- **Path:** `server/AUTH/is_auth.js`
- **Purpose:** `GET /auth/me` — verifies cookie JWT and returns authenticated flag + user stub.
- **Key Implementations:** `jwt.verify`, returns `{ id, email }` from payload.
- **Code Quality Review:**
  - JWT is signed with `{ email }` only (login/signup) — **`id` is always undefined**.
  - Fallback `JWT_SECRET || "JWT_SECRET"` is a critical secret-management failure.
  - Extremely verbose debug logging of cookies/tokens — remove in production.
  - Should load user from DB if clients need reliable identity.

---

### `server/AUTH/Staff_Auth_logIN.js`

- **Path:** `server/AUTH/Staff_Auth_logIN.js`
- **Purpose:** `POST /auth/staff/login` — national ID + password login.
- **Key Implementations:** Zod `loginSchema`, bcrypt compare, JWT cookie set, `authLimiter`.
- **Code Quality Review:**
  - Logs `national_id` and email on every attempt — PII leakage into logs.
  - Cookie flags for prod look correct conceptually (`secure` + `sameSite: none`).
  - JWT payload too thin (no `id` / role / school).
  - Generic error messages on 401 are good (no user enumeration via message).

---

### `server/AUTH/Staff_AUTH_signUP.js`

- **Path:** `server/AUTH/Staff_AUTH_signUP.js`
- **Purpose:** `POST /auth/staff/signup` — whitelist-gated registration.
- **Key Implementations:** Loads `allowed_staff.json`, bcrypt hash, creates Staff, sets JWT cookie.
- **Code Quality Review:**
  - Whitelist is a static JSON file in the repo — not scalable; PII committed.
  - Does not verify that submitted `legal_name` / `phone` match whitelist entry (only `national_id`).
  - Spreads `...data` into Staff after hashing — ensure Zod strips unknown fields (it does via object schema, good).
  - Same JWT/cookie issues as login.

---

### `server/AUTH/Staff_Auth_logOUT.js`

- **Path:** `server/AUTH/Staff_Auth_logOUT.js`
- **Purpose:** `POST /auth/staff/logout` — clears auth cookie.
- **Key Implementations:** `res.clearCookie('token', …)` with matching flags.
- **Code Quality Review:** Clear-cookie options generally match set-cookie; no auth required to call logout (acceptable). Consider adding `path: '/'` explicitly for consistency.

---

### `server/AUTH/allowed_staff.json`

- **Path:** `server/AUTH/allowed_staff.json`
- **Purpose:** Signup allowlist of national IDs, roles, schools, phones.
- **Key Implementations:** Static JSON array consumed by signup.
- **Code Quality Review:**
  - **Security:** Real-looking national IDs and phone numbers in VCS.
  - Should move to DB collection or private config store; never commit production PII.

---

### `server/routes/Fetch_user_data.js`

- **Path:** `server/routes/Fetch_user_data.js`
- **Purpose:** Authenticated profile/status endpoints.
- **Key Implementations:** Local `getAuthenticatedStaff`; `GET /fetch/status`, `GET /fetch/profile`.
- **Code Quality Review:**
  - Duplicates auth helper from ticket routes — extract shared middleware.
  - Profile returns `national_id` and `phone` — sensitive; ensure only owner access (currently yes, via cookie).
  - Uses `user.staff_Type` / `user.school` correctly for status JSON keys `staff_type` / `staff_school`.

---

### `server/routes/Ticket_data.js`

- **Path:** `server/routes/Ticket_data.js`
- **Purpose:** Ticket create, list, approve, resolve.
- **Key Implementations:** `getAuthenticatedStaff`; routes under `/tickets/*`.
- **Code Quality Review (critical):**
  1. **Create:** Writes `id`, `date` not in schema; uses `user.staff_school` (undefined — schema field is `school`).
  2. **`/tickets/my`:** Filter `{ school: user.staff_school || user.school }` — works if `school` set; confusing dual naming.
  3. **`/tickets/all`:** `Ticket.find({})` returns **all schools** for Admin/IT — tenancy leak for multi-school deployments.
  4. **Approve:** No 403 if caller is not Principal — non-principals get 200 with no-op save; also **no school ownership check** — a principal from School A could fund School B’s ticket if they know `_id`.
  5. Admin approval block is commented out — UI still shows `adminApproved`.
  6. Resolve looks up `{ id }` then `_id` — custom `id` never persisted.
  7. No Zod validation on ticket payloads (injection of unexpected fields / bad enums possible until Mongoose rejects).
  8. Auth helper duplicated again.

**Refactor — approve with RBAC + tenancy:**

```js
router.patch("/tickets/:id/approve", async (req, res) => {
  const user = await getAuthenticatedStaff(req, res);
  if (!user) return;

  const principalRoles = ["Principal", "Vice Principal"];
  if (!principalRoles.includes(user.staff_Type)) {
    return res.status(403).json({ message: "Unauthorized access." });
  }

  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) return res.status(404).json({ message: "Ticket not found." });
  if (ticket.school !== user.school && user.staff_Type !== "Super Admin") {
    return res.status(403).json({ message: "Cross-school access denied." });
  }

  ticket.principalFunded = true;
  if (ticket.status === "Pending_Approval") ticket.status = "In_Progress";
  await ticket.save();
  return res.status(200).json(ticket);
});
```

---

### `server/middlewares/rate_limiter/rate_limiter.js`

- **Path:** `server/middlewares/rate_limiter/rate_limiter.js`
- **Purpose:** `authLimiter` and `generalLimiter` via express-rate-limit.
- **Key Implementations:** Env-driven window/max with defaults.
- **Code Quality Review:**
  - Code default `GEN_MAX_REQUESTS || 5` is extremely aggressive (template documents 100). A dashboard page that fires multiple fetches can lock users out quickly if env unset.
  - In-memory store is fine for single instance; fails open/closed incorrectly under multi-instance serverless without Redis store.

---

### `server/middlewares/security_validation/auth_input_validation.js`

- **Path:** `server/middlewares/security_validation/auth_input_validation.js`
- **Purpose:** Higher-order Zod validation middleware.
- **Key Implementations:** `validate(schema, schemaName)`, replaces `req.body` with parsed data.
- **Code Quality Review:** Solid pattern. Unused `z` import. Prefer mapping Zod issues to a stable client-facing shape instead of raw `.format()`.

---

### `server/middlewares/security_validation/schemas/auth_schema.js`

- **Path:** `server/middlewares/security_validation/schemas/auth_schema.js`
- **Purpose:** Zod schemas for signup/login.
- **Key Implementations:** `signupSchema`, `loginSchema` (14-digit national ID, email, min password 8).
- **Code Quality Review:** Good baseline. Phone rules weaker than client (client enforces Egyptian `01[0125]…`). Add password complexity if required by policy. Consider email domain restriction (`@moe.edu.eg`) if that is a real constraint.

---

### `server/.env.template`

- **Path:** `server/.env.template`
- **Purpose:** Documents required environment variables.
- **Key Implementations:** JWT, Mongo URLs, rate-limit knobs.
- **Code Quality Review:** Contains a Mongo Atlas connection string template with username placeholder — acceptable as template, but ensure real secrets never commit. Placeholder `JWT_SECRET="JWT_SECRET"` encourages weak defaults.

---

### `server/package.json`

- **Path:** `server/package.json`
- **Purpose:** Dependencies and scripts.
- **Key Implementations:** `start`, `devstart`; stub `test`.
- **Code Quality Review:** No automated tests despite `test/` fixtures. `nodemon` should be a `devDependency`. `uuid` is declared but unused in reviewed source.

---

### Server test / docs fixtures (brief)

| Path | Purpose | Review |
|------|---------|--------|
| `server/test/auth/**/*.json` | Manual auth pass/fail cases | Not wired to a runner |
| `server/test/ticket_creation_tests/*.json` | Ticket payload fixtures | Same |
| `server/Commands.md`, hashing/Mongo notes | Operator notes | Keep out of production images if they contain secrets |

---

## Client Stack

### `client/package.json` / `client/next.config.ts` / `client/tsconfig.json`

- **Paths:** `client/package.json`, `client/next.config.ts`, `client/tsconfig.json`
- **Purpose:** Next 16 + React 19 app config; React Compiler enabled.
- **Key Implementations:** Scripts `dev`/`build`/`start`/`lint`; `reactCompiler: true`.
- **Code Quality Review:** Modern stack. No env-based API URL — hardcoded in `API_handler.ts`. Consider `NEXT_PUBLIC_API_URL`.

---

### `client/src/tools/API_handler.ts`

- **Path:** `client/src/tools/API_handler.ts`
- **Purpose:** Exports `BASE_URL` for API calls.
- **Key Implementations:** Hostname `localhost` → `:3500`; else production Vercel API URL.
- **Code Quality Review:**
  - Breaks for LAN IP / preview deployments (non-localhost hostname uses prod API).
  - Must stay in sync with server CORS allowlist (currently mismatched naming).

**Refactor:**

```ts
export const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  (typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:3500'
    : 'https://unifiedmaintenanceescalationsystem.vercel.app');
```

---

### `client/src/tools/verfiy_user.ts`

- **Path:** `client/src/tools/verfiy_user.ts` *(typo: verify)*
- **Purpose:** Calls `/auth/me` to determine session.
- **Key Implementations:** `isAUTH()`.
- **Code Quality Review:** Correct use of `credentials: 'include'`. Filename typo hurts discoverability. No caching — every page remount hits `/me`.

---

### `client/src/tools/Fetch_tickets.ts`

- **Path:** `client/src/tools/Fetch_tickets.ts`
- **Purpose:** Client wrappers for ticket list/approve/resolve.
- **Key Implementations:** `Fetch_tickets_my`, `Fetch_tickets_all`, `Update_ticket_approval`, `Resolve_ticket`.
- **Code Quality Review:** Consistent error handling returning `null`. Unused `Ticket` import usage is only as return type (fine). `Fetch_tickets_all` unused by Main_page (always uses `_my`). No create helper (inline in page).

---

### `client/src/tools/Form_validation.ts`

- **Path:** `client/src/tools/Form_validation.ts`
- **Purpose:** Client-side signup/login validation with bilingual messages.
- **Key Implementations:** `validate_signup_data`, `validate_login_data`.
- **Code Quality Review:** Clear and practical. Login does not enforce password min length (server does). Keep in sync with Zod schemas.

---

### `client/src/tools/LanguageHandler.ts`

- **Path:** `client/src/tools/LanguageHandler.ts`
- **Purpose:** `useLanguage` hook for EN/AR toggle with hydration safety.
- **Key Implementations:** localStorage `umes_lang`, custom `langChanged` event, SSR-safe `mounted` gate.
- **Code Quality Review:** Thoughtful hydration handling. **Mismatch:** root `layout.tsx` reads cookie `lang`, hook uses localStorage — SEO/`<html lang>` can disagree with UI language until client mounts.

---

### `client/src/Types/tickets.ts`

- **Path:** `client/src/Types/tickets.ts`
- **Purpose:** Ticket and view prop TypeScript contracts.
- **Key Implementations:** `Ticket`, `TeacherViewProps`, `PrincipalViewProps`, `AdminViewProps`.
- **Code Quality Review:** `date` and nested `createdBy` assumed always present — `/tickets/my` does not populate `createdBy`, so runtime shape may lack it. Prefer `createdBy?: string | {…}` and `createdAt` from timestamps.

---

### `client/src/Types/Routing.ts`

- **Path:** `client/src/Types/Routing.ts`
- **Purpose:** Central route constants.
- **Key Implementations:** `ROUTES`, `RouteKey`.
- **Code Quality Review:** Good pattern. Comment above `RouteKey` is stale (lists wrong keys).

---

### `client/src/Types/TranslationKey.ts`

- **Path:** `client/src/Types/TranslationKey.ts`
- **Purpose:** Strong typing for dictionary structure.
- **Key Implementations:** `TranslationKeys` interface.
- **Code Quality Review:** Keeps `Content_DICT` honest. Some signup keys unused in current signup UI (role select removed).

---

### `client/src/Dict/Content_DICT.ts`

- **Path:** `client/src/Dict/Content_DICT.ts`
- **Purpose:** Full EN/AR copy for marketing, auth forms, profile, footer.
- **Key Implementations:** `contentDict` record.
- **Code Quality Review:** High quality localization. Large static module — fine at this scale. Consider splitting by namespace if it grows.

---

### `client/src/app/layout.tsx`

- **Path:** `client/src/app/layout.tsx`
- **Purpose:** Root layout, metadata, font variables, html `lang`/`dir`.
- **Key Implementations:** `generateMetadata`, cookie-based language for SSR.
- **Code Quality Review:** Cookie `lang` unused by client toggle — sync cookie on toggle or drop cookie and accept client-only language for `<html>`.

---

### `client/src/app/globals.css`

- **Path:** `client/src/app/globals.css`
- **Purpose:** Tailwind import + body defaults.
- **Key Implementations:** `@import "tailwindcss"`; body colors.
- **Code Quality Review:** Forces `font-family: Arial` which overrides Geist CSS variables from layout — branding inconsistency.

---

### `client/src/app/page.tsx`

- **Path:** `client/src/app/page.tsx`
- **Purpose:** Landing / intro page with CTAs.
- **Key Implementations:** `IntroPage` client component; NavBar + Fotter1.
- **Code Quality Review:** Clean layout. Uses emoji as hero visual. Entire page is `'use client'` — could keep static shell on server for performance.

---

### `client/src/app/Staff_Login/page.tsx`

- **Path:** `client/src/app/Staff_Login/page.tsx`
- **Purpose:** Staff login form.
- **Key Implementations:** `request_login`, validation, fetch login, navigate to Main_page.
- **Code Quality Review:** Solid UX (loading/error). Zod error parsing assumes message starts with `[` but server returns object `errors` — dead branch. Prefer `Link` over `<a href>` for client navigation.

---

### `client/src/app/Staff_Signup/page.tsx`

- **Path:** `client/src/app/Staff_Signup/page.tsx`
- **Purpose:** Staff signup form.
- **Key Implementations:** `request_signup`, confirm password, whitelist-backed API.
- **Code Quality Review:** Import uses relative `../../tools/API_handler` while peers use `@/` — inconsistent. Content-type guard is good. Role is server-assigned (good) but UI still has unused translation keys for role select.

---

### `client/src/app/Main_page/page.tsx`

- **Path:** `client/src/app/Main_page/page.tsx`
- **Purpose:** Authenticated dashboard; role-based view switching; ticket metrics.
- **Key Implementations:** Auth gate, status fetch, `Fetch_tickets_my`, `approveFunding`, `resolveTicket`, conditional Principal/Admin/Teacher views.
- **Code Quality Review:**
  - Dead branch: `elevatedRoles` if/else both call `Fetch_tickets_my`.
  - Defaults school name to `"Al-Najah Secondary School"` — misleading if status fails.
  - Auth redirect via `window.location` full reload instead of `router.replace`.
  - `console.log` of tickets left in production path.
  - No empty-state when `tickets` is `[]`.
  - Client-only protection.

---

### `client/src/app/Main_page/Ticket_creation/page.tsx`

- **Path:** `client/src/app/Main_page/Ticket_creation/page.tsx`
- **Purpose:** Create maintenance ticket form.
- **Key Implementations:** Loads school from `/fetch/status`; POST create; category map AR labels.
- **Code Quality Review:**
  - No `isAUTH` gate — unauthenticated users see form until submit fails.
  - Uses `alert()` for UX — replace with inline banners.
  - Local `NewTicket` status `"Pending"` ≠ server `"Pending_Approval"`.
  - No NavBar/footer — inconsistent chrome.

---

### `client/src/app/profile/page.tsx`

- **Path:** `client/src/app/profile/page.tsx`
- **Purpose:** Profile display and logout.
- **Key Implementations:** `loadProfile`, `handleLogout`, field list.
- **Code Quality Review:** Clean. `useEffect` depends on `t.profilePage.error` causing refetch on language change — acceptable but slightly odd; prefer `[lang]` or `[]`. Displays full national ID — consider masking.

---

### `client/src/app/About/page.tsx`

- **Path:** `client/src/app/About/page.tsx`
- **Purpose:** About / product narrative.
- **Key Implementations:** Localized sections.
- **Code Quality Review:** Commented tech stack still claims PostgreSQL + Prisma — **incorrect** vs Mongo/Mongoose. Remove or update to avoid misleading stakeholders.

---

### `client/src/components/Navbar.tsx`

- **Path:** `client/src/components/Navbar.tsx`
- **Purpose:** Five navbar variants for public/auth contexts.
- **Key Implementations:** `NavBar`, `NavBarAUTH`, `NavBarNoOptions_login`, `NavBarNoOptionsAUTH`, `NavBarNoOptions`.
- **Code Quality Review:** Heavy duplication (~same markup ×5). Extract shared shell with props (`showLogin`, `showProfile`, `backTarget`). Unused `MoveRight` import path is used; `isRTL` sometimes unused (lint noise).

**Refactor sketch:**

```tsx
type NavProps = { homeHref: string; links?: { href: string; label: string }[]; showBack?: boolean };
export function AppNav({ homeHref, links = [], showBack }: NavProps) { /* one implementation */ }
```

---

### `client/src/components/Fotter.tsx`

- **Path:** `client/src/components/Fotter.tsx` *(typo: Footer)*
- **Purpose:** Two footer style variants.
- **Key Implementations:** `Fotter1`, `Fotter2`.
- **Code Quality Review:** Rename for professionalism. Tiny duplication only.

---

### `client/src/components/Teacher_view.tsx`

- **Path:** `client/src/components/Teacher_view.tsx`
- **Purpose:** Read-only ticket table for teacher-like roles.
- **Key Implementations:** Maps tickets; shows admin/principal flags.
- **Code Quality Review:** No empty state. Displays raw Mongo `_id` as “Ticket ID”. Status logic ignores `ticket.status` field in favor of flags — can disagree with Admin view.

---

### `client/src/components/Admin_view.tsx`

- **Path:** `client/src/components/Admin_view.tsx`
- **Purpose:** Admin/IT execution table with resolve action.
- **Key Implementations:** `onResolve` when `In_Progress`.
- **Code Quality Review:** Clear workflow UI. No loading/disabled state on resolve button (double-click risk). Empty list not handled.

---

### `client/src/components/PrincipalFunding_View.tsx`

- **Path:** `client/src/components/PrincipalFunding_View.tsx`
- **Purpose:** Principal funding decisions table.
- **Key Implementations:** `onFund` when not `principalFunded`.
- **Code Quality Review:** Same double-submit risk. No confirmation dialog for disbursement (financial action).

---

### `client/public/ColorPallet.json`

- **Path:** `client/public/ColorPallet.json`
- **Purpose:** Design token reference (if used externally).
- **Code Quality Review:** Not imported by app code reviewed — colors are hardcoded hex in components. Either wire tokens into CSS variables or remove dead asset.

---

### Client misc

| Path | Purpose | Review |
|------|---------|--------|
| `client/src/app/Main_page/old_main_page.md` | Archived UI notes | Should not confuse active docs; move to `docs/` or delete |
| `client/AGENTS.md` / `CLAUDE.md` | Agent guidance for Next 16 | Keep |
| `client/eslint.config.mjs` | Lint config | Standard |
| `client/postcss.config.mjs` | Tailwind PostCSS | Standard |

---

## Cross-Cutting Findings (All Files)

1. **Naming debt:** `Fotter`, `verfiy_user`, `staff_school` vs `school`, CORS host mismatch.
2. **DRY debt:** Auth verification copied in multiple server routers; five near-identical navbars.
3. **Contract drift:** Client Ticket type vs Mongoose schema vs create payload.
4. **Observability:** Debug `console.log` / `console.dir` everywhere — replace with leveled logger gated by `NODE_ENV`.
5. **Testing gap:** JSON fixtures exist; no Jest/Vitest/Supertest suite executes them.

---

## Priority File Hotspots

| Priority | File | Why |
|----------|------|-----|
| P0 | `server/routes/Ticket_data.js` | RBAC/tenancy gaps, schema drift |
| P0 | `server/DB/DB.js` | Broken URI fallback |
| P0 | `server/index.js` + `API_handler.ts` | CORS / BASE_URL mismatch |
| P0 | Auth JWT files | Weak secret fallback; thin claims |
| P1 | `Main_page/page.tsx` | Dead logic, defaults, client-only auth |
| P1 | `allowed_staff.json` | PII in repo |
| P2 | `Navbar.tsx` | Duplication |
| P2 | Typos / About outdated stack claims | Maintainability / trust |
)