import type { ExplainResult } from "./schema";

/** Normalize for comparison: case, whitespace, quote marks and stray punctuation spacing. */
export function normalize(s: string): string {
  return s
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[\u2018\u2019\u201C\u201D"'`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function quoteInDocument(quote: string, documentText: string): boolean {
  const q = normalize(quote).replace(/[.…]+$/g, "");
  if (q.length < 3) return false;
  return normalize(documentText).includes(q);
}

type Claimish = { source_quote?: string; verified?: boolean };

function visit(node: unknown, fn: (c: Claimish) => void) {
  if (Array.isArray(node)) return node.forEach((n) => visit(n, fn));
  if (node && typeof node === "object") {
    const o = node as Record<string, unknown>;
    if (typeof o.source_quote === "string") fn(o as Claimish);
    Object.values(o).forEach((v) => visit(v, fn));
  }
}

/** Marks every claim `verified` true/false based on whether its quote is really in the document. */
export function verifyQuotes(result: ExplainResult, documentText: string) {
  let total = 0;
  let verified = 0;
  visit(result, (c) => {
    total++;
    c.verified = quoteInDocument(c.source_quote ?? "", documentText);
    if (c.verified) verified++;
  });
  return { total, verified };
}
