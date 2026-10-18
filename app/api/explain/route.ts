import { NextResponse } from "next/server";
import { ExplainRequest } from "@/lib/ai/schema";
import { explainDocument } from "@/lib/ai/pipeline";
import { getProvider, ProviderError } from "@/lib/ai/providers";
import { hashKey, rateLimit, withinDailyBudget } from "@/lib/rateLimit";

export const runtime = "nodejs";

// NEVER log request bodies, quotes or model output (see spec §13).
const fail = (error: string, status: number, extra: Record<string, unknown> = {}) =>
  NextResponse.json({ error, ...extra }, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(req: Request) {
  if (Number(req.headers.get("content-length") ?? 0) > 100_000) return fail("too_large", 413);

  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (origin && host && new URL(origin).host !== host) return fail("forbidden", 403);

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const key = hashKey(ip);
  const hourly = rateLimit(`h:${key}`, 10, 3_600_000);
  if (!hourly.ok) return fail("rate_limited", 429, { retryAfterSec: hourly.retryAfterSec });
  const daily = rateLimit(`d:${key}`, 40, 86_400_000);
  if (!daily.ok) return fail("rate_limited", 429, { retryAfterSec: daily.retryAfterSec });

  let body: unknown;
  try { body = await req.json(); } catch { return fail("invalid", 400); }
  const parsed = ExplainRequest.safeParse(body);
  if (!parsed.success) return fail("invalid", 400, { issues: parsed.error.issues.map((i) => i.message).slice(0, 3) });

  if (!withinDailyBudget()) return fail("capacity_reached", 503);

  const started = Date.now();
  try {
    const out = await explainDocument({
      provider: getProvider(),
      maskedText: parsed.data.text,
      outputLang: parsed.data.outputLang,
      clientTz: parsed.data.clientTz,
      signal: AbortSignal.timeout(45_000),
    });
    return NextResponse.json({ ...out.result, meta: { ...out.meta, tookMs: Date.now() - started } }, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    if (e instanceof ProviderError) return fail(e.code, e.code === "rate_limited" ? 429 : 502);
    if (e instanceof Error && e.name === "TimeoutError") return fail("timeout", 504);
    return fail("provider_error", 502);
  }
}
