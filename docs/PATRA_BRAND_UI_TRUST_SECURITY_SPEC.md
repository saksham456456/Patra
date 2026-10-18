# PATRA — Brand, Interface, Trust & Security Spec (Companion to PATRA_MASTER_SPEC.md)

This file **extends** `PATRA_MASTER_SPEC.md`. If the two conflict, this file wins for anything about look, feel, brand, trust signals and security. Section numbers here are prefixed `B` (Brand), `U` (UI), `T` (Trust), `S` (Security) to avoid clashes.

---

# PART B — BRAND

## B1. Brand foundation

**Name:** Patra (पत्र, "letter"). Working name; run a trademark and domain check before launch. Avoid any name containing "gov", "official", "sarkar", "india", "bharat", "tax" or a bank name, since these imply affiliation.

**One-line promise:** "Understand any official letter in 30 seconds."
**Hindi:** "कोई भी सरकारी या बैंक का पत्र, 30 सेकंड में समझें।"

**What Patra is:** a calm, careful reading companion. Think *a patient neighbour who happens to know how paperwork works*.
**What Patra is not:** a government body, a lawyer, a CA, a bank, a chatbot toy, a "magic AI".

**Brand personality (5 words):** Calm · Careful · Plain-spoken · Respectful · Honest.
**Positioning:** the trusted layer between confusing paperwork and the person who has to act on it.

**Audience emotion map**
| Arrives feeling | Must leave feeling |
|---|---|
| Anxious, confused, rushed | Calm, informed, in control |
| Afraid of being scammed | Able to verify safely |
| Embarrassed they don't understand | Respected, never talked down to |

## B2. Voice and tone

Rules: short sentences, everyday words, active voice, no jargon without a plain meaning, never blame the user, never scare for effect, never use hype.

| Situation | Say | Never say |
|---|---|---|
| Greeting | "Let's read this together." | "Unlock the power of AI!" |
| Urgent | "This has a deadline in 6 days. Here's what to do first." | "⚠️ URGENT!!! ACT NOW" |
| Unsure | "I couldn't find a date in this letter. Don't assume one." | "No deadline." |
| Scam signs | "Two things here look unusual. Here's how to check safely." | "This is a scam." (unless strong evidence) |
| Error | "That didn't work. Your letter is still here. Try again?" | "Error 500" |
| High stakes | "This may have serious consequences. Please show it to a CA or lawyer soon." | "You will be fined." |
| Privacy | "Your letter is not saved. Closing this tab erases it." | "Military-grade encryption" |

Hindi voice: simple spoken Hindi, "आप" form, familiar loanwords (नोटिस, डेडलाइन, बैंक) preferred over heavy Sanskritized terms. Native-speaker review is mandatory before launch.

Reading level target: Class 8 (English) and equivalent in Hindi. Check with a readability script on all UI copy.

## B3. Logo and identity

### Concept: "The Postmark"
A circular postmark stamp containing the Devanagari letter **प**, with three wavy cancellation lines to the right. It signals *letter, official-ness handled, and 'received and understood'*. It must **not** resemble any government emblem, seal, Ashoka Chakra, tricolour, or national symbol.

### Logo set
1. **Primary lockup:** postmark mark + wordmark "Patra" in Fraunces (SemiBold, slight optical size) + small Devanagari "पत्र" beneath at 40% size.
2. **Mark only:** for favicon, app icon, avatar, stamps.
3. **Monochrome (ink)** and **reversed (paper on ink)** versions.
4. **Stamp variants (UI):** NO ACTION (green), SOON (amber), URGENT (vermilion), LEGAL DEADLINE (double ring vermilion).

### Starter SVG (builder must convert text to outlined paths before shipping)
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 100" role="img" aria-label="Patra">
  <title>Patra</title>
  <g fill="none" stroke="#B3261E" stroke-width="4" stroke-linecap="round">
    <circle cx="50" cy="50" r="40"/>
    <circle cx="50" cy="50" r="32" stroke-width="2"/>
    <path d="M96 38 q6 -6 12 0 t12 0 t12 0 t12 0"/>
    <path d="M96 50 q6 -6 12 0 t12 0 t12 0 t12 0"/>
    <path d="M96 62 q6 -6 12 0 t12 0 t12 0 t12 0"/>
  </g>
  <text x="50" y="66" text-anchor="middle" font-family="Noto Serif Devanagari, serif"
        font-size="44" font-weight="700" fill="#1B1A17">प</text>
</svg>
```

### Usage rules
- **Clear space:** height of the "प" on all sides.
- **Minimum size:** 24px mark, 96px lockup.
- **Never:** rotate beyond the stamp's -6° UI tilt, add gradients, add drop shadows, change the stamp's color to green/blue in the logo, put it on busy photos, or place it next to government or bank logos.
- **Favicon set:** 16/32/48 ico, 180 apple-touch, 192/512 maskable PWA icons, SVG favicon with dark-mode variant.
- **Social/OG image (1200×630):** paper background, big stamp left, headline "Understand any official letter in 30 seconds", small privacy line. Generate per-language.

## B4. Color, type, texture (summary; tokens are in MASTER_SPEC §9.2–9.3)

| Role | Token | Use |
|---|---|---|
| Page | `--paper` | 60% of any screen |
| Surface | `--paper-2` | cards, panels |
| Text | `--ink` | all body text |
| Brand accent | `--stamp` | CTAs, urgent states, logo. Max 10% of a screen |
| Info/links | `--indigo` | links, focus |
| Positive | `--leaf` | "no action", success |
| Caution | `--amber` | soon, low confidence |

Hard rules: one primary vermilion CTA per screen; no more than two typefaces visible per screen (Fraunces + Inter, plus Noto Devanagari for Hindi); no pure white backgrounds except high-contrast theme.

## B5. Iconography and illustration
- **UI icons:** Lucide, 1.75px stroke, rounded.
- **Illustrations:** a small original set drawn in flat ink style on paper: envelope, magnifying lens, stamp, calendar, checklist, shield. Max 6 colours from the palette. Commission/draw originals or generate and record licenses in `/docs/assets-licenses.md`. No stock photos of people, no robot/brain/circuit imagery.
- **Empty states:** always an illustration + one sentence + one action.

## B6. Naming and domain checklist
- Prefer `.in` or `.app` / `.co`. Avoid `.gov`/`.nic` lookalikes (e.g. `patra-gov`, `incometax-help`).
- Check: trademark search (India), app-store name clashes, social handles, Google search clutter.
- Register defensive typo domains if affordable. Set up email on the domain: `hello@`, `privacy@`, `grievance@`, `security@`.

---

# PART U — INTERFACE

## U1. Global layout

**Header (sticky, 64px):** logo left; nav (How it works · Examples · Scam guide); right: language toggle (EN / हिं), text size (A A+ A++), theme (Light / Dark / High contrast), and primary CTA "Explain a letter" (only on non-app pages).
**Mobile:** compact header with logo + CTA + menu button; bottom sheet for settings (language, text size, theme).
**Footer:** 4 columns: Product · Trust · Legal · Contact. Includes operator name, grievance officer link, last updated date, independence disclaimer: *"Patra is an independent tool. It is not affiliated with any government department, bank, insurer or other sender of letters."*
**Skip link** first in DOM. Max content width 1120px; reading width 68ch.

## U2. Page wireframes

### U2.1 Landing `/`
```
[ Header ]
HERO
  H1: "Understand any official letter in 30 seconds."
  Sub: "Tax notices, bank letters, legal notices, forms. In plain English or Hindi."
  [ Explain a letter ]  [ See an example ]
  Right/below: animated before/after: dense letter → Patra result card with stamp "SOON"
  Trust strip: "Not saved · Sensitive numbers hidden on your device · Free"
HOW IT WORKS (3 steps, icons)
  1 Add your letter (photo, PDF, or text)  2 We hide private numbers  3 Get clear steps and deadlines
WHAT YOU GET (result card preview, annotated)
IS THIS REAL? (scam check feature teaser + link to /scam-guide)
PRIVACY PROMISE block (the "privacy label": Stays on device / Sent / Never stored)
EXAMPLES (3 synthetic letters, clearly labeled "Synthetic example")
LANGUAGES & ACCESSIBILITY (big text, read aloud, Hindi)
FAQ (accordion, ≥10)
FINAL CTA
[ Footer ]
```

### U2.2 Explain `/explain`
```
Step indicator: 1 Add  →  2 Check privacy  →  3 Your explanation
STEP 1: Tabs [ Paste ] [ Upload ] [ Camera ]
        Big dropzone; mobile: two big buttons "Take photo" / "Choose file"
        Mode switch (radio cards):
          (•) Private mode (recommended)  Reads on your device, sends only text with private numbers hidden.
          ( ) Quick mode                  Sends the photo to the AI service. Cannot hide numbers inside photos.
        Output language select; Document type (optional, "Not sure" default)
        Consent checkboxes (unchecked): I'm 18+ · I understand how my letter is handled (link)
        [ Continue ] disabled until consents checked, with visible reason
STEP 2: Two-column (stacked on mobile): left = text with highlighted masked items;
        right = "What we hid" list with toggles. [ Hide more ] [ Show again ]
        Privacy meter: "Will leave your device: masked text only"
        [ Back ]  [ Looks good, explain ]
STEP 3: Result card (see U2.3)
Persistent: [ Clear everything ] top-right
```

### U2.3 Result
```
[ STAMP ]  Headline (display serif, 28–36px)
Urgency reason (one line)
[High-stakes banner]  [Low-confidence note]
DEADLINES (chips with countdown, calendar button)
WHAT THIS MEANS            | Sticky action rail (desktop):
WHAT THEY WANT FROM YOU    |  Ask a follow-up
MONEY                      |  Draft a reply
IF YOU IGNORE IT           |  Read aloud
NEXT STEPS (numbered)      |  Export PDF
IS THIS REAL?              |  Copy for WhatsApp
JARGON                     |  Clear everything
ASK A PROFESSIONAL         |  [ Original text drawer ]
Disclaimer + feedback
```

### U2.4 Other pages
`/examples` (grid of letters → pre-run results with no API call), `/how-it-works` (pipeline diagram with privacy highlights), `/scam-guide` (10 scams: red flags, what to do, official reporting links), legal pages (see U6), `/trust` (T section), `/404` (stamp "RETURN TO SENDER" with a friendly link home).

## U3. Component library (all custom, accessible)

| Component | Spec |
|---|---|
| **Button** | 48px min height; primary (vermilion), secondary (ink outline), tertiary (text). Loading state with spinner + label change. Disabled states explain *why* via adjacent text |
| **Input / Textarea** | Visible label, helper text, error text linked with `aria-describedby`, 2px ink border, 3px focus ring |
| **Dropzone** | Keyboard operable (Enter/Space opens picker), drag-over state, file chips with remove button |
| **Radio cards** | Whole card clickable, check icon + border (not color only) |
| **Stamp** | SVG; props: `level`, `size`; `role="img"` + `aria-label="Urgency: Soon"` |
| **Deadline chip** | Icon + date + countdown text; urgency by icon and text, plus color |
| **Claim block** | Text + "See the line" disclosure; quote shown in monospace with marker highlight; "verified" tick or "couldn't verify" note |
| **Redaction chip** | Highlighted token; toggle by click/Enter; tooltip says what it was |
| **Jargon term** | Dotted underline button; popover with plain meaning; Esc closes |
| **Tabs / Accordion / Dialog / Tooltip** | Radix primitives, styled; focus trapped in dialogs |
| **Toast** | `aria-live`, auto-dismiss ≥ 8s, pausable, never for critical info |
| **Banner** | High-stakes (vermilion border), low-confidence (amber), info (indigo) |
| **Progress** | Staged labels, determinate when possible, cancel button |
| **Text size control** | 3 steps, persisted locally |
| **Theme switch** | Light / Dark / High contrast / System |

### States every component must define
default, hover, focus-visible, active, disabled, loading, error, success, empty, reduced-motion.

## U4. Responsive and device behavior
- Mobile first at 360px; test on low-end Android (2 GB RAM) and iOS Safari.
- Camera capture uses `<input type="file" accept="image/*" capture="environment">` plus a live preview option via `getUserMedia` when permitted; guide overlay for framing the letter.
- Tablet: two-column result at ≥ 768px.
- Desktop: sticky action rail; original-text drawer docked right.
- **Print stylesheet:** result prints cleanly in black and white, stamp becomes outlined text label.
- **PDF export design:** A4, header with logo and date, headline, stamp, sections as on screen, footer with disclaimer and "Generated by Patra, patra.example (not affiliated…)". No document text included unless the user ticks "Include original text".

## U5. Motion and feel
- Stamp "thunk" (scale 1.15 → 1, 180 ms, slight rotation settle) on result reveal.
- Staged loader: envelope flap opens as stages complete.
- Page transitions: fade 150 ms only.
- Everything off under `prefers-reduced-motion`; replaced by instant state changes.
- No autoplay audio. No confetti. No pulsing urgency animations.

## U6. Legal and policy page design
- Plain-language summary box at the top of every policy ("The short version"), then full text.
- Table of contents, last-updated date, version number, change log, print button, Hindi version.
- Readable at 18px, 68ch measure.

## U7. Performance and polish bar
| Metric | Target |
|---|---|
| Lighthouse (mobile) Performance / Accessibility / Best Practices / SEO | ≥ 90 / 100 / 100 / 100 |
| LCP | < 2.0 s on 4G mid-range Android |
| CLS | < 0.05 |
| INP | < 200 ms |
| Landing JS | < 150 KB gz |
| Fonts | self-hosted, `font-display: swap`, subset Latin + Devanagari, preload the display face |

SEO: server-rendered landing, `hreflang` en/hi, structured data (`WebApplication`, `FAQPage`), sitemap, robots (disallow nothing sensitive since nothing is stored), canonical URLs, unique titles/descriptions, OG images.

---

# PART T — TRUST AND "OFFICIALNESS"

"Official" here means **credible, accountable and professional**, not looking like a government site. Impersonating or resembling government is illegal and would destroy trust.

## T1. What must never appear
- Government emblems, Ashoka Chakra, tricolour bands, national symbols, "Govt. of India", "official portal", "authorized by", "approved by", "certified", "verified by [authority]" unless literally true and documented.
- Bank/insurer/tax-department logos, even in examples (use fictional senders like "Example Bank Ltd").
- Fake testimonials, fake user counts, fake "as seen in", fake security badges, fake review stars.
- Absolute claims: "100% accurate", "guaranteed", "legally valid", "lawyer-approved".

## T2. Accountability signals (all required)
1. **Operator identity:** `/about` shows legal name (individual or entity), registered/contact address or a verifiable contact, email, and short founder note (real, truthful).
2. **Grievance officer:** name, email, response time, escalation path (footer + `/contact`).
3. **Versioned policies:** version, effective date, changelog on each legal page.
4. **Independence disclaimer** in footer and on `/about`.
5. **Domain and email hygiene:** HTTPS everywhere, HSTS, SPF/DKIM/DMARC on the domain, `security@` mailbox, branded email templates.
6. **`/.well-known/security.txt`** with contact, expiry, policy link, PGP key if available.
7. **Public changelog** (`/changelog`) of product and policy changes.
8. **Open methodology:** `/how-it-works` and `/trust/accuracy` describe the pipeline and publish the real evaluation numbers (from `/eval/report.md`) with date and test-set size, plus known limitations.
9. **Status page** `/status` (uptime and incidents).
10. **Optional open-source repo** (frontend + redaction + prompts) so privacy claims are auditable. Strongly recommended and a great portfolio point.

## T3. Trust Center `/trust`
Sections: Privacy label · Security practices · Data inventory (user-friendly version) · Sub-processors list (AI provider, hosting, rate-limit store, email) with purpose, region and link · Accuracy and limitations · How to report a problem · Responsible disclosure · Compliance notes (DPDP, accessibility statement).

### Privacy label (shown on landing, input step and trust page)
| | Private mode | Quick mode |
|---|---|---|
| Letter stays on your device | ✅ (original) | ❌ (image sent) |
| Private numbers hidden before sending | ✅ | ⚠️ Not possible in photos |
| Stored by Patra | ❌ Never | ❌ Never |
| Seen by the AI service | Masked text only | Full image |
| AI service may use content to improve its products | **State the real answer for the provider in use** (free tiers may; see note) | same |

> **Honesty rule:** If a free-tier AI provider is used, its terms may allow product improvement use and human review of inputs. The label, the privacy policy and the notice shown before every explain action must say so plainly. Never claim "no training" unless the provider's current terms for the plan in use say so and that is recorded in `/docs/third-parties.md` with the date checked.

## T4. Microcopy that builds trust
- Before send: "Only the text with private numbers hidden will be sent for explanation. Nothing is saved by Patra."
- After result: "This explains your letter. It isn't legal or financial advice. For serious matters, please talk to a professional."
- Footer: "Patra is independent and not connected to any government, bank or insurer."
- Source line under claims: "From your letter: '…'" so users see the evidence.

## T5. Social proof (honest only)
Allowed once real: anonymized aggregate stats ("Median time to understand a letter in our test: 1m 40s, 20 participants, Oct 2026"), named testimonials with written consent, GitHub stars, published eval results. Until then: none.

---

# PART S — SECURITY (deep dive)

## S1. Threat model summary

| Asset | Threat | Mitigation |
|---|---|---|
| User's document | Leak via logs, analytics, error trackers, CDN, extensions | No content logging; no third-party scripts on `/explain`; strict CSP; Sentry (if used) with `beforeSend` scrubbing and body capture off |
| User's document in transit | Interception | HTTPS only, HSTS preload, TLS 1.2+ |
| Document at AI provider | Retention/training/human review | Mask first; disclose truthfully; provider abstraction so you can switch; synthetic data in dev |
| API key | Theft, abuse (denial-of-wallet) | Server-only env, restricted key (API restrictions + quota caps), rotation schedule, per-client and global rate limits, daily cap |
| Service availability | Bot floods, quota exhaustion | Edge rate limit, cheap pre-checks before model call, capacity mode, fallback provider |
| Output integrity | Prompt injection making Patra lie or exfiltrate | Untrusted-data wrapping, schema validation, quote verification, URL allowlist, no remote images/markdown rendering |
| Users | Phishing via lookalike domain | Defensive domains, DMARC, clear canonical domain on all pages |
| Supply chain | Malicious dependency | Lockfile, `pnpm audit`, Dependabot/Renovate, pinned versions, minimal dependencies, provenance checks |
| Source repo | Account takeover, leaked secrets | 2FA, branch protection, secret scanning, no secrets in git, signed commits recommended |

## S2. Browser/transport hardening

### Security headers (set in `next.config.ts` / middleware)
```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'nonce-{NONCE}' 'strict-dynamic' 'wasm-unsafe-eval';
  style-src 'self' 'nonce-{NONCE}';
  img-src 'self' data: blob:;
  font-src 'self';
  connect-src 'self';
  worker-src 'self' blob:;
  media-src 'self' blob:;
  frame-ancestors 'none';
  base-uri 'none';
  form-action 'self';
  object-src 'none';
  upgrade-insecure-requests
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
Referrer-Policy: no-referrer
Permissions-Policy: camera=(self), microphone=(), geolocation=(), payment=(), usb=()
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-origin
X-Frame-Options: DENY
```
Notes:
- **Self-host Tesseract assets** (worker, core WASM, `eng` and `hin` traineddata) and pdf.js worker so `connect-src 'self'` holds and no CDN sees user activity.
- Tesseract/pdf.js need `worker-src blob:` and `'wasm-unsafe-eval'`; avoid `'unsafe-eval'` and `'unsafe-inline'`.
- Enable **Trusted Types** (`require-trusted-types-for 'script'`) where feasible.
- Add Subresource Integrity if any external script is ever allowed (target: none).
- Submit the domain to the **HSTS preload** list once stable.
- Target: A+ on securityheaders.com and Mozilla Observatory; SSL Labs A+.

### Cookies and storage
- No cookies in v1. Preferences (language, theme, text size) in `localStorage`.
- Optional local history uses IndexedDB with a session-scoped key (see MASTER_SPEC §5.4); default off.
- Never put document text in `localStorage`, URLs, query strings, or service-worker caches.

## S3. API and server hardening
- Validate every request with Zod; reject unknown fields; enforce size caps before parsing large bodies.
- Same-origin only: check `Origin`/`Sec-Fetch-Site`; no CORS wildcard.
- **Rate limiting layers:** (1) edge/IP-hash limit, (2) route-specific limits, (3) global daily budget with graceful "capacity reached" state, (4) challenge (Turnstile or proof-of-work) only after bursts.
- **Cheap rejection first:** size, MIME, empty/garbage text and language checks run before any model call.
- **Idempotent, stateless handlers**; no server session; no request body in logs; errors return generic messages plus a request id.
- **Timeouts and abort** on upstream calls; circuit breaker if the provider errors repeatedly; automatic fallback provider.
- **Key hygiene:** keys only in server env; scope/restrict the key; separate keys for dev/preview/prod; rotate every 90 days or on suspicion; alert on spend/quota spikes.
- **Preview deployments** use a throwaway key with a tiny quota and are not publicly indexable.
- **Dependency policy:** only well-maintained packages; review any new dependency; no postinstall scripts from untrusted packages (`pnpm` `onlyBuiltDependencies` allowlist).

## S4. AI-specific security
1. **Prompt injection:** document inside `<document>` tags, closing-tag lookalikes escaped; system rule to treat content as data; injection attempts become a visible `prompt_injection` legitimacy signal; eval set of ≥ 6 injection letters must be 100% resisted.
2. **Exfiltration via rendering:** never render model output as HTML or Markdown with remote images/links; render as text; links only from an allowlist of official domains.
3. **Output verification:** schema validation + quote verification + date sanity; unverifiable claims are flagged, never silently trusted.
4. **Jailbreak/abuse:** refuse to forge or falsify documents, evade lawful notices, or craft deceptive replies; draft replies must contain only placeholders for identifiers and no false statements.
5. **Denial-of-wallet:** input length caps, page caps, output token cap, per-client quotas, global cap.
6. **Model/provider drift:** model ID via env; eval harness gates any change; free-tier model IDs rotate often, so run a daily health check and alert when the configured model is deprecated.
7. **Data handling at provider:** only masked text in Private mode; record provider retention/training terms and date checked in `/docs/third-parties.md`; re-check monthly.

## S5. Privacy engineering tests (automated)
- **No-network-before-consent test (Playwright):** assert zero requests to `/api/*` or third parties before the user clicks "Looks good, explain".
- **Payload test:** intercept the explain request in Private mode; assert it contains no strings matching Aadhaar/PAN/card/phone/email patterns from the fixtures.
- **Image test (Quick mode):** assert EXIF/GPS stripped and image downscaled.
- **Log test:** run the app with a canary string in a letter; grep all logs and error output; fail if found.
- **Storage test:** after "Clear everything", assert `localStorage`, `sessionStorage`, IndexedDB, caches contain no document data.
- **CSP test:** assert the CSP header on every route; fail on `unsafe-inline`/`unsafe-eval`.

## S6. Secure development lifecycle
- Branch protection on `main`, required CI, required review (self-review checklist if solo).
- Secret scanning + push protection on GitHub; `gitleaks` in CI.
- `pnpm audit --prod` and license check in CI; Dependabot weekly.
- SAST: `eslint-plugin-security`, CodeQL (free for public repos).
- Align test plan with **OWASP ASVS Level 1** (aim for L2 on the API) and **OWASP Top 10 / Top 10 for LLM Apps**; keep a checklist in `/docs/security-checklist.md`.
- Pre-launch self penetration test: ZAP baseline scan, manual injection/XSS/CSRF/SSRF attempts, rate-limit bypass attempts, large-file/zip-bomb-style inputs, malformed PDFs/images.
- Threat model reviewed each phase.

## S7. Operations and incident response
- **Monitoring:** uptime check, error rate, p95 latency, provider quota, spend; alerts to email/phone. Error tracker with content scrubbing.
- **Kill switch:** one env flag to disable AI calls and show a maintenance notice; documented in runbook.
- **Incident runbook** (1 page): detect → contain (kill switch, rotate keys) → assess (what data, if any, was exposed; by design: none stored) → notify (users/regulator as required) → fix → post-mortem published on `/changelog`.
- **Responsible disclosure policy** at `/security` with safe-harbor language, scope, contact, response SLA (e.g. acknowledge in 3 days).
- **Backups:** nothing to back up (no database) except config, content and feedback store; keep infrastructure as code and env documented.
- **Domain security:** registrar 2FA, DNSSEC, CAA records, registrar lock, auto-renew.
- **Email security:** SPF, DKIM, DMARC `p=quarantine` then `reject`, BIMI optional.

## S8. Security acceptance checklist
- [ ] A+ on securityheaders.com and SSL Labs; CSP has no `unsafe-inline`/`unsafe-eval`.
- [ ] All Section S5 automated privacy tests pass in CI.
- [ ] Rate limits, global cap and capacity mode tested under load.
- [ ] Injection eval set 100% resisted.
- [ ] No secrets in repo history (`gitleaks` clean).
- [ ] `security.txt`, `/security` policy, `security@` mailbox live.
- [ ] Runbook and kill switch tested once.
- [ ] Provider terms and retention recorded with check date.
- [ ] Self-pentest report filed in `/docs`.

---

# PART Q — FINAL "LOOKS AND FEELS RIGHT" REVIEW

Before launch, a person who has never seen the product must be able to say yes to each of these within 10 seconds of opening the landing page:

1. I know what this does. (headline + before/after)
2. I know it's not the government. (footer + about + no emblems)
3. I know my letter isn't saved. (privacy strip)
4. I know who runs it. (about link in footer, operator named)
5. It looks careful and calm, not flashy. (paper/ink palette, no gimmicks)
6. I can read it comfortably on my phone. (18px text, contrast)
7. I can switch to Hindi in one tap. (header toggle)

**Visual QA checklist:** consistent spacing scale; one primary CTA per screen; stamp renders correctly in all themes; Hindi text never clips; no orphaned headings; focus ring visible everywhere; dark and high-contrast themes verified; print and PDF verified; empty/error/loading states designed for every screen; no lorem ipsum, placeholder logos or default framework favicons.

---

# PART O — OPEN DECISIONS FOR THE OWNER (this file)

1. Approve the postmark logo direction or request alternatives (I can produce 3 variations).
2. Final domain and TLD.
3. Operator identity (individual vs. entity) shown on `/about`.
4. Open-source the repo? (recommended: yes, MIT or AGPL; decide before launch)
5. Which free AI provider is primary, and whether to show the provider's name publicly on the trust page (recommended: yes).
6. Who reviews Hindi copy and the legal pages.
