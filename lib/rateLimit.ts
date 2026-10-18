// Simple in-memory sliding window. Fine for one server instance and local dev.
// Production: swap for Upstash Ratelimit (see PATRA_MASTER_SPEC §10.7). Keys are hashed; no raw IPs kept.
import { createHash } from "node:crypto";

const hits = new Map<string, number[]>();

export function hashKey(ip: string): string {
  return createHash("sha256").update((process.env.RATE_LIMIT_SALT ?? "dev-salt") + ip).digest("hex").slice(0, 24);
}

export function rateLimit(key: string, limit: number, windowMs: number, now = Date.now()) {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    const retryAfterSec = Math.ceil((windowMs - (now - recent[0]!)) / 1000);
    hits.set(key, recent);
    return { ok: false as const, retryAfterSec };
  }
  recent.push(now);
  hits.set(key, recent);
  return { ok: true as const };
}

// Global daily cap: protects the free-tier quota ("capacity reached" mode).
let day = new Date().toISOString().slice(0, 10);
let count = 0;
export function withinDailyBudget(): boolean {
  const today = new Date().toISOString().slice(0, 10);
  if (today !== day) { day = today; count = 0; }
  const cap = Number(process.env.DAILY_BUDGET_REQUESTS ?? 500);
  if (count >= cap) return false;
  count++;
  return true;
}
