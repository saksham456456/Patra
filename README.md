# Patra

Understand any official letter in 30 seconds. Plain-language explanations of tax notices, bank letters, legal notices and forms, in English or Hindi. Photos and PDFs are read on the user's device, and private numbers are hidden before anything is sent.

Specs live in `docs/`: `PATRA_MASTER_SPEC.md` and `PATRA_BRAND_UI_TRUST_SECURITY_SPEC.md`.

## Run it

```bash
pnpm install                    # also downloads the OCR assets into public/ocr
cp .env.example .env.local      # works as-is in demo mode (AI_PROVIDER=mock)
pnpm dev                        # http://localhost:3000
```

Real explanations (free): create a key in Google AI Studio, then in `.env.local`:
```
AI_PROVIDER=gemini
GEMINI_API_KEY=your-key
AI_MODEL_ID=<a current Flash or Flash-Lite model id from AI Studio>
```
Free-tier terms may let the provider use and review the text it receives. Use only synthetic letters while developing.

## Scripts
`pnpm test` · `pnpm typecheck` · `pnpm lint` · `pnpm build` · `pnpm setup:ocr`

OCR assets (about 16 MB: worker, wasm, English and Hindi language data, PDF worker) are not committed. `pnpm install` copies them into `public/ocr`; run `pnpm setup:ocr` if that step was skipped.

## Status
Done: Next.js 15 + TypeScript strict; design tokens (light, dark, high contrast, 3 text sizes); English and Hindi UI; redaction (Aadhaar with Verhoeff, cards with Luhn, PAN, phone, email, UPI, account, DOB, IDs) with user controls; explain API (Zod validation, quote verification, date math, repair retry, rate limit, daily cap, origin check, no content logging); result card with postmark stamp; on-device photo and PDF reading (tesseract.js eng+hin, pdf.js, scanned-PDF fallback, EXIF stripped, self-hosted assets with their own CSP); legal and trust pages marked as drafts (privacy, terms, cookies, refunds, accessibility, about, contact, data requests); nonce CSP and security headers; CI; 17 tests.

Not yet: follow-up chat, draft reply, read aloud, .ics and PDF export, next-intl routing, Upstash rate limiting, golden evaluation set, Playwright and axe tests, screen-reader and native-Hindi review, Hindi legal pages, lawyer review of the legal pages.

## Before launch
Fill every `TODO(owner)` in `lib/siteConfig.ts`. Have a lawyer review the legal pages. Run the checklist in section 23 of the master spec.
