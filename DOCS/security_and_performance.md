# Security & Performance Review

**Audit date:** 2026-07-17  
**Scope:** Authentication, authorization, data validation, secrets, client behavior, and runtime performance across `client/` and `server/`.

---

## 1. Security Findings

### 1.1 Critical

#### S-C1 — JWT secret fallback to a known string

**Where:** `server/AUTH/is_auth.js`, `Staff_Auth_logIN.js`, `Staff_AUTH_signUP.js`, `routes/*.js`  
**Issue:** `process.env.JWT_SECRET || "JWT_SECRET"` allows token forgery if env is missing.  
**Remediation:**

1. Fail fast at boot if `JWT_SECRET` is unset or shorter than 32 random bytes.
2. Remove all hardcoded fallbacks.
3. Rotate any secret that may have been deployed with the placeholder.

```js
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be set to a strong value (>=32 chars)');
}
```

---

#### S-C2 — Broken / inconsistent multi-tenant authorization on tickets

**Where:** `server/routes/Ticket_data.js`  
**Issues:**

| Endpoint | Risk |
|----------|------|
| `PATCH .../approve` | No role 403; no school ownership check — any authenticated user can hit it; a principal can fund another school’s ticket by `_id`. |
| `GET .../all` | Returns every school’s tickets for Admin/IT/Super Admin. |
| `POST .../create` | Accepts client-supplied `school` — possible school spoofing if role check passes. |
| Admin approval | Commented out — workflow/security model incomplete. |

**Remediation:**

1. Centralize `requireAuth`, `requireRoles([...])`, `assertSameSchool(ticket, user)`.
2. Force `school` from authenticated user (ignore body) except Super Admin.
3. Scope `/tickets/all` by school unless Super Admin.
4. Return 403 (not silent no-op) when role insufficient.

---

#### S-C3 — Production CORS / cookie domain mismatch

**Where:** `server/index.js` vs `client/src/tools/API_handler.ts`  
**Issue:** Server allowlist uses `https://unifiedmaintenance.vercel.app`; client calls `https://unifiedmaintenanceescalationsystem.vercel.app`. Cross-origin credentialed requests fail or encourage unsafe CORS widening.  
**Remediation:** Single source of truth via env (`CLIENT_ORIGIN`, `NEXT_PUBLIC_API_URL`); document the exact pair; add staging origins explicitly.

---

#### S-C4 — Staff whitelist PII committed to git

**Where:** `server/AUTH/allowed_staff.json`  
**Issue:** National IDs, phones, names, roles, schools in version control.  
**Remediation:** Move to MongoDB collection or private secret store; scrub git history if real PII; seed via secure admin tooling.

---

### 1.2 High

#### S-H1 — Thin JWT claims + `/me` returns undefined `id`

**Where:** Login/signup sign `{ email }`; `/auth/me` exposes `decodedPayload.id`.  
**Risk:** Clients cannot reliably identify user from `/me`; encourages extra round-trips; future IDOR if code trusts client-supplied IDs.  
**Remediation:** Sign `{ sub: user._id, email, staff_Type, school }` or always re-hydrate from DB after verify (preferred for role changes).

---

#### S-H2 — Client-only route protection

**Where:** `Main_page`, `profile`, ticket create  
**Issue:** Auth checks run in the browser after JS loads. UI can be briefly visible; ticket create has no `isAUTH` at all.  
**Remediation:** Keep server as source of truth (already mostly true) **and** add Next.js middleware checking cookie presence for protected paths. Never rely on UI hiding for security.

---

#### S-H3 — Sensitive data in logs

**Where:** Auth and route handlers log national IDs, emails, cookie keys, stack traces.  
**Risk:** Log aggregation becomes a PII store; tokens may leak via debug.  
**Remediation:** Structured logger with redaction; disable debug in production; never log raw tokens or passwords.

---

#### S-H4 — Profile endpoint returns full national ID & phone

**Where:** `GET /routes/fetch/profile`  
**Risk:** XSS or compromised XSS-adjacent script can exfiltrate high-value PII.  
**Remediation:** Mask national ID (show last 4); require re-auth for full reveal; ensure CSP via Helmet defaults + tighten if needed.

---

#### S-H5 — CSRF posture with cookie sessions

**Where:** Cross-site cookie auth (`sameSite: 'none'` in production)  
**Issue:** `sameSite: none` enables cross-site cookie sends; CORS helps but is not a full CSRF defense for simple requests. Null-origin allowance weakens controls.  
**Remediation:** Prefer `sameSite: 'lax'` if frontend and API share a parent domain/proxy; otherwise add CSRF tokens or custom header requirement (`X-Requested-With`) enforced server-side; reject requests with no Origin in browser contexts when possible.

---

### 1.3 Medium

#### S-M1 — Validation gaps on ticket mutations

**Where:** Ticket create/approve/resolve  
**Issue:** Auth has Zod; tickets use manual `if (!asset)` checks. Enum/cost/length not strictly validated.  
**Remediation:** Add Zod schemas for create/update; reject unknown keys.

#### S-M2 — Signup whitelist only checks national ID

**Where:** `Staff_AUTH_signUP.js`  
**Issue:** Attacker with a leaked national ID can register with attacker-controlled email/phone/name.  
**Remediation:** Bind signup fields to whitelist record (name/phone match) or issue one-time invite codes.

#### S-M3 — Password policy weak

**Where:** Zod + client validators  
**Issue:** Minimum length 8 only; no complexity / breach checks.  
**Remediation:** Align with org policy (length + complexity or passphrase); consider HaveIBeenPwned k-anonymity API.

#### S-M4 — Rate limiter defaults mismatch

**Where:** `rate_limiter.js` default `GEN_MAX_REQUESTS = 5` vs template `100`  
**Issue:** Misconfiguration can DoS legitimate users or, if raised carelessly, weaken brute-force protection.  
**Remediation:** Safe production defaults in code matching template; Redis store for multi-instance; keep auth limiter strict.

#### S-M5 — Mongo URI construction / credential logging

**Where:** `DB/DB.js`  
**Issue:** Broken fallback; success log prints URI.  
**Remediation:** Fix URI assembly; log host only, never credentials.

#### S-M6 — Staff schema typo (`require` vs `required`)

**Where:** `Staff_model.js` `school` field  
**Issue:** School may be omitted → broken tenancy filters.  
**Remediation:** Fix to `required: true`; backfill existing docs.

---

### 1.4 Low

| ID | Issue | Remediation |
|----|-------|-------------|
| S-L1 | `uuid` unused dependency | Remove |
| S-L2 | Verbose error stacks to console | Gate by env |
| S-L3 | About page outdated security claims (Prisma/Postgres) | Update copy |
| S-L4 | No security headers tuning beyond Helmet defaults | Review CSP for Next assets |
| S-L5 | No account lockout beyond IP rate limit | Per-account lockout after N failures |

---

## 2. Performance Findings

### 2.1 High

#### P-H1 — Unbounded ticket queries

**Where:** `Ticket.find(filterQuery)` / `Ticket.find({})`  
**Issue:** No pagination, projection, or sort limits. Large schools or Super Admin “all” will degrade latency and memory.  
**Remediation:**

```js
const page = Math.max(1, Number(req.query.page) || 1);
const limit = Math.min(100, Number(req.query.limit) || 25);
const tickets = await Ticket.find(query)
  .sort({ createdAt: -1 })
  .skip((page - 1) * limit)
  .limit(limit)
  .lean();
```

Add indexes: `{ school: 1, status: 1, createdAt: -1 }`.

---

#### P-H2 — Aggressive general rate limit default

**Where:** `generalLimiter` default max 5 / 5 minutes  
**Issue:** Dashboard boot fires `/me` + `/fetch/status` + `/tickets/my` — users can trip limiter under default env.  
**Remediation:** Default max ≥ 100; exclude health checks; consider higher limit for authenticated GETs.

---

### 2.2 Medium

#### P-M1 — Serial waterfall on Main_page

**Where:** `Main_page/page.tsx`  
**Issue:** `isAUTH` → then status → then tickets (sequential awaits).  
**Remediation:** After auth, `Promise.all([statusFetch, ticketsFetch])` where possible; or single `/dashboard/bootstrap` endpoint.

#### P-M2 — Entire pages marked `'use client'`

**Where:** Landing, About, auth pages  
**Issue:** Larger JS bundles; slower TTI than hybrid server components.  
**Remediation:** Keep interactive islands client-side; leave static copy as Server Components.

#### P-M3 — Duplicate auth DB lookups

**Where:** Every protected request: JWT verify + `Staff.findOne({ email })`  
**Issue:** Acceptable at small scale; becomes hot path under load.  
**Remediation:** Cache staff session in short-TTL memory/Redis keyed by `sub`; or embed non-sensitive claims and revalidate on mutations.

#### P-M4 — `populate` only on `/tickets/all`

**Where:** Ticket routes  
**Issue:** Inconsistent payloads; populate adds join cost when unused by UI.  
**Remediation:** Only populate when needed; use `.lean()` for read-only lists.

---

### 2.3 Low

| ID | Issue | Remediation |
|----|-------|-------------|
| P-L1 | Multiple near-identical Navbar components | One shared component → smaller bundle |
| P-L2 | `console.log` in hot paths | Remove or sample |
| P-L3 | Language hook `setTimeout(0)` | Unnecessary; set state directly after read |
| P-L4 | Profile refetch when translation string identity changes | Depend on `[lang]` |
| P-L5 | No HTTP caching headers on static-ish GETs | Short private cache for profile if appropriate |

---

## 3. Remediation Roadmap (Security + Performance)

### Immediate (before production traffic)

1. Enforce strong `JWT_SECRET` (no fallback).
2. Fix CORS / `BASE_URL` alignment.
3. Fix ticket approve RBAC + school checks; stop trusting client `school` on create.
4. Fix Mongo URI fallback; stop logging secrets.
5. Remove or relocate `allowed_staff.json` PII.
6. Set sane rate-limit defaults.

### Short term

1. Shared auth middleware; richer JWT or DB-backed session.
2. Zod for all ticket inputs; pagination + indexes.
3. Next.js middleware for protected routes.
4. Redact logs; mask national IDs in UI/API.
5. Parallelize dashboard fetches.

### Medium term

1. CSRF strategy compatible with cross-origin deployment (or reverse-proxy same-site).
2. Automated security tests (authz matrix per role).
3. Dependency scanning in CI; pin/audit Express/Mongoose.
4. Consider Redis rate-limit store for multi-instance hosting.

---

## 4. AuthZ Matrix (Current Observed Behavior)

| Role | Create | List school | List all schools | Fund | Resolve |
|------|--------|-------------|------------------|------|---------|
| Teacher / similar | No | Yes (`/my`) | No | Endpoint callable, no effect* | No |
| Principal / VP | No | Yes | No | Yes (no school check) | No |
| Admin / IT / Super Admin | Yes | Yes | Yes (`/all`, unused by UI) | Endpoint callable, no effect* | Yes |

\*Approve handler only mutates when role ∈ Principal/VP; still returns 200 after save for others.

**Target:** Every “No” must be enforced with HTTP 403; every “Yes” scoped to `user.school` except Super Admin.
)