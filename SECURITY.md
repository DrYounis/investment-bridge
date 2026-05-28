# Security Policy — marfa.sa Investment Platform

## Responsible Disclosure

If you discover a security vulnerability in marfa.sa, please report it immediately to:

**Email:** `security@marfa.sa`  
**Response time:** Within 48 hours  
**PGP Key:** Available upon request

Do NOT open a public GitHub issue. We follow a coordinated disclosure process.

---

## Data Breach Response Procedure

### 1. Immediate Response (First 15 minutes)
1. **Containment:** Rotate all API keys and credentials (Supabase service role, Anthropic API key, Resend API key, Strava credentials)
2. **Access revocation:** Invalidate all active sessions via Supabase dashboard → Authentication → Settings → Revoke all sessions
3. **Infrastructure freeze:** Pause all deployments (disable Vercel auto-deploy from Git)

### 2. Investigation (First 2 hours)
1. Check Supabase audit logs for unusual query patterns
2. Check Vercel deployment logs for unauthorized access
3. Review Sentry error logs for anomalies
4. Check `lib/security/audit.ts` logs for suspicious activity patterns

### 3. Impact Assessment (First 4 hours)
1. **What data was accessed?** — Profiles, KYC documents, financial data, deal terms
2. **How many users affected?** — Query Supabase for affected rows
3. **Is PII exposed?** — National IDs, phone numbers, emails, bank accounts
4. **Regulatory notification:** PDPL (Saudi Arabia) requires notification within 72 hours

### 4. Remediation (First 24 hours)
1. Apply the fix
2. Deploy patched version
3. Notify affected users via email (using Resend)
4. Update this SECURITY.md with lessons learned

### 5. Post-Incident (Within 1 week)
1. Conduct root cause analysis
2. Add automated tests for the vulnerability class
3. Update security monitoring rules
4. File regulatory report if required

---

## Security Architecture

### Authentication
- **Provider:** Supabase Auth (JWT-based with refresh token rotation)
- **Session cookies:** httpOnly, Secure, SameSite=Strict
- **Password hashing:** bcrypt (Supabase-managed)
- **Rate limiting:** 5 attempts per 15 minutes per IP on auth endpoints
- **CSRF protection:** Double-submit cookie pattern on all POST/PUT/PATCH/DELETE

### API Security
- **Validation:** Zod schema validation on all request bodies
- **Error messages:** Generic — no stack traces or DB errors exposed
- **Rate limiting:** Tiered (auth: 5/15min, API: 10/min, forms: 3/min)
- **Origin validation:** Allowed origins are marfa.sa, *.marfa.sa, *.vercel.app
- **Request size limits:** 1MB default, 10MB for document uploads

### Data Protection
- **PII encryption:** AES-256-GCM at rest for national IDs, phones, emails, bank accounts
- **Data masking:** Role-based masking in API responses (investors can't see other investors' PII)
- **KYC documents:** Service-role-only access, signed URLs with 15-min expiry
- **Right to erasure:** `POST /api/erasure` endpoint with confirmation required
- **No PII in logs:** Structured audit logging excludes all PII fields

### Infrastructure
- **CSP:** strict Content-Security-Policy with no unsafe-inline or unsafe-eval on scripts
- **HSTS:** max-age=63072000; includeSubDomains; preload
- **X-Frame-Options:** DENY
- **Supabase RLS:** Row-level security on all tables
- **Sentry:** Error monitoring (production only)
- **Vercel:** Auto-deploys from main, cron jobs authenticated

### Monitoring
- **Failed logins:** Logged with IP and timestamp (no passwords)
- **Permission denials:** Logged with user ID, path, and method
- **Admin access:** All admin data access logged for audit trail
- **Rate limit breaches:** Logged with IP and endpoint
- **Alert threshold:** >10 failed auth attempts per hour should trigger investigation

---

## Environment Variables

### Required (Production)
| Variable | Purpose | Sensitivity |
|----------|---------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Public |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | Public (anon role) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role | **SECRET** — server only |
| `CRON_SECRET` | Cron job authentication | **SECRET** |
| `ANTHROPIC_API_KEY` | Claude AI API key | **SECRET** — server only |
| `PII_ENCRYPTION_KEY` | AES-256 encryption key for PII | **SECRET** — never rotate without re-encrypting data |

### Optional
| Variable | Purpose |
|----------|---------|
| `RESEND_API_KEY` | Email service |
| `ADMIN_EMAIL` | Admin notification email |
| `STRAVA_CLIENT_ID` / `STRAVA_CLIENT_SECRET` | Strava OAuth |
| `NEXT_PUBLIC_SENTRY_DSN` | Error monitoring |

### NEVER in NEXT_PUBLIC_
These must remain server-only:
- `SUPABASE_SERVICE_ROLE_KEY`
- `ANTHROPIC_API_KEY`
- `CRON_SECRET`
- `PII_ENCRYPTION_KEY`
- `RESEND_API_KEY`
- `STRAVA_CLIENT_SECRET`

---

## Dependency Monitoring

We use `npm audit` for vulnerability scanning. Run weekly:

```bash
npm audit
npm audit fix
```

To add Snyk monitoring:
```bash
npm install -g snyk
snyk auth
snyk monitor
```

---

## Pre-Commit Security Hook

Install the pre-commit hook to prevent accidental secret commits:

```bash
cp scripts/pre-commit.sh .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

The hook checks for:
- `.env` files in staged changes
- JWT tokens, API keys, private keys
- Debug/output files with credentials

---

## Manual Review Checklist (Quarterly)

- [ ] Rotate all API keys
- [ ] Review Supabase RLS policies
- [ ] Audit all `NEXT_PUBLIC_*` variables for accidental secrets
- [ ] Check for new npm vulnerabilities
- [ ] Review access logs for unusual patterns
- [ ] Test data erasure endpoint
- [ ] Verify CSP headers haven't been weakened
- [ ] Review third-party dependencies for supply chain risks
- [ ] Test rate limiting effectiveness
- [ ] Verify KYC document access controls

---

## Regulatory Compliance

### PDPL (Saudi Arabia Personal Data Protection Law)
- PII is encrypted at rest (AES-256-GCM)
- Right to erasure implemented (`POST /api/erasure`)
- Data masking in API responses
- No PII in logs
- Breach notification within 72 hours

### GDPR (EU General Data Protection Regulation)
- Applicable if any EU users interact with the platform
- Same protections as PDPL apply
- Additional: Data Processing Agreement available upon request

---

## Known Limitations (as of 2026-05-29)

1. **Rate limiter is in-memory only** — in a multi-instance Vercel deployment, each instance has its own counter. An attacker can bypass by hitting different instances. For production, migrate to Upstash Redis or Vercel Edge Config.

2. **No WAF / DDoS protection** — Cloudflare or Vercel's WAF should be configured for production.

3. **KYC document scanning** — No ClamAV or equivalent virus scanning is integrated. Documents are stored in Supabase Storage with service-role-only access.

4. **PII encryption key management** — The `PII_ENCRYPTION_KEY` must be manually managed. If it's lost, all encrypted PII is irrecoverable. Use a KMS (key management service) for production.

5. **Audit log persistence** — Audit events are logged to stdout (captured by Vercel). For long-term retention, export to a SIEM or log aggregation service.

6. **CSRF token delivery** — The CSRF token must be read from the cookie and sent as an `x-csrf-token` header by the client. The Next.js client-side code needs to implement this pattern. Currently, the middleware will reject state-changing requests without this header.

---

## Contacts

- **Security issues:** security@marfa.sa
- **Emergency:** Contact the Vercel and Supabase dashboards directly
- **Legal/Compliance:** Contact via marfa.sa contact page
