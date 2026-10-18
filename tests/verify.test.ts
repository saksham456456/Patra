import { describe, expect, it } from "vitest";
import { quoteInDocument, verifyQuotes } from "@/lib/ai/verify";
import { enrichDeadlines } from "@/lib/ai/dates";
import { explainDocument } from "@/lib/ai/pipeline";
import { MockProvider } from "@/lib/ai/providers";
import type { ExplainResult } from "@/lib/ai/schema";

const DOC = "Dear customer,\nYour account will be   blocked on 30 November 2026 unless KYC is updated.\nRegards, Bank";

describe("quote verification", () => {
  it("accepts quotes regardless of case and whitespace", () => {
    expect(quoteInDocument("account will be blocked on 30 November 2026", DOC)).toBe(true);
    expect(quoteInDocument("ACCOUNT WILL BE BLOCKED", DOC)).toBe(true);
  });
  it("rejects invented text", () => {
    expect(quoteInDocument("you must pay a fine of Rs 5,000", DOC)).toBe(false);
  });
  it("flags unverified claims without removing them", () => {
    const r = { what_it_means: [{ text: "a", source_quote: "blocked on 30 November 2026" }, { text: "b", source_quote: "totally made up line" }] } as unknown as ExplainResult;
    const out = verifyQuotes(r, DOC);
    expect(out).toEqual({ total: 2, verified: 1 });
    expect(r.what_it_means.map((c) => c.verified)).toEqual([true, false]);
  });
});

describe("dates", () => {
  it("computes days left and drops impossible dates", () => {
    const r = { deadlines: [{ date_iso: "2026-10-28" }, { date_iso: "2026-02-31" }] } as unknown as ExplainResult;
    enrichDeadlines(r, "Asia/Kolkata", new Date("2026-10-18T06:00:00Z"));
    expect(r.deadlines[0]!.days_left).toBe(10);
    expect(r.deadlines[1]!.date_iso).toBeNull();
  });
});

describe("pipeline (mock provider)", () => {
  it("returns a schema-valid result with verified quotes", async () => {
    const out = await explainDocument({ provider: new MockProvider(), maskedText: DOC, outputLang: "en", clientTz: "Asia/Kolkata" });
    expect(out.result.what_it_means.length).toBeGreaterThan(0);
    expect(out.meta.quotesVerified).toBe(out.meta.quotesTotal);
    expect(out.result.disclaimers?.length).toBeGreaterThan(0);
  });
});
