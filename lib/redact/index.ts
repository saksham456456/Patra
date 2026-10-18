import { luhn, verhoeff } from "./checksums";

export type EntityType =
  | "AADHAAR" | "PAN" | "CARD" | "PHONE" | "EMAIL" | "UPI" | "ACCOUNT" | "DOB" | "ID";

export interface RedactedItem {
  type: EntityType;
  token: string;      // e.g. [AADHAAR-1]
  original: string;
  start: number;      // offsets in the ORIGINAL text
  end: number;
}

export interface RedactionResult {
  masked: string;
  items: RedactedItem[];
}

interface Candidate { type: EntityType; start: number; end: number; text: string; priority: number }

const digitsOnly = (s: string) => s.replace(/\D/g, "");

/** Find every sensitive entity, resolve overlaps (higher priority wins, then longer), return candidates. */
function findCandidates(text: string): Candidate[] {
  const out: Candidate[] = [];
  const add = (type: EntityType, m: RegExpMatchArray, priority: number, group = 0) => {
    const s = group === 0 ? m[0]! : m[group]!;
    const start = (m.index ?? 0) + (group === 0 ? 0 : m[0]!.indexOf(s));
    out.push({ type, start, end: start + s.length, text: s, priority });
  };

  // Aadhaar: 12 digits (optionally 4-4-4), first digit 2-9, valid Verhoeff checksum.
  for (const m of text.matchAll(/(?<!\d)([2-9]\d{3}[\s-]?\d{4}[\s-]?\d{4})(?!\d)/g)) {
    if (verhoeff(digitsOnly(m[1]!))) add("AADHAAR", m, 90, 1);
  }
  // Payment card: 13-19 digits (spaces/dashes allowed) that pass Luhn.
  for (const m of text.matchAll(/(?<!\d)(\d(?:[\s-]?\d){12,18})(?!\d)/g)) {
    if (luhn(digitsOnly(m[1]!))) add("CARD", m, 95, 1);
  }
  // PAN: AAAAA9999A
  for (const m of text.matchAll(/\b([A-Z]{5}\d{4}[A-Z])\b/g)) add("PAN", m, 85, 1);
  // Email
  for (const m of text.matchAll(/\b([A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+)\b/g)) add("EMAIL", m, 80, 1);
  // UPI / VPA, only when a keyword is nearby (so we don't hit plain emails twice).
  for (const m of text.matchAll(/(?:UPI|VPA)[^\n]{0,30}?\b([\w.\-]{2,}@[a-z]{2,})\b/gi)) add("UPI", m, 88, 1);
  // Indian mobile numbers.
  for (const m of text.matchAll(/(?<!\d)((?:\+?91[\s-]?)?[6-9]\d{4}[\s-]?\d{5})(?!\d)/g)) add("PHONE", m, 60, 1);
  // Bank account: 9-18 digits right after an account keyword.
  for (const m of text.matchAll(/(?:a\/c|acct?|account|खाता)\.?(?:\s*(?:no|number|num|संख्या)\b\.?)?[\s:.#-]*([0-9][0-9\s-]{7,20}[0-9])/gi)) {
    const d = digitsOnly(m[1]!);
    if (d.length >= 9 && d.length <= 18) add("ACCOUNT", m, 70, 1);
  }
  // Date of birth, only after a DOB keyword.
  for (const m of text.matchAll(/(?:DOB|D\.O\.B\.?|date of birth|जन्म(?:\s*तिथि)?)[\s:.-]*(\d{1,2}[\/.\-]\d{1,2}[\/.\-]\d{2,4})/gi)) add("DOB", m, 75, 1);
  // Passport / voter-id style identifiers after a keyword.
  for (const m of text.matchAll(/(?:passport|voter\s*id|epic|driving\s*licen[cs]e|DL)\s*(?:no\.?|number)?[\s:.#-]*([A-Z]{1,3}[\s-]?\d{6,14}[A-Z]?)/gi)) add("ID", m, 72, 1);

  // Resolve overlaps: sort by priority desc, then length desc, keep non-overlapping.
  out.sort((a, b) => b.priority - a.priority || (b.end - b.start) - (a.end - a.start));
  const kept: Candidate[] = [];
  for (const c of out) {
    if (!kept.some((k) => c.start < k.end && k.start < c.end)) kept.push(c);
  }
  return kept.sort((a, b) => a.start - b.start);
}

/**
 * Mask sensitive identifiers. The same original value always gets the same token,
 * so explanations stay consistent ("[ACCOUNT-1]" means the same account everywhere).
 * `extraMasks` lets the user hide additional exact strings (e.g. their name).
 */
export function redact(text: string, extraMasks: string[] = [], keep: string[] = []): RedactionResult {
  // `keep` lets the user un-hide an auto-detected item by its original text.
  const candidates = findCandidates(text).filter((c) => !keep.includes(c.text));

  for (const raw of extraMasks) {
    const needle = raw.trim();
    if (needle.length < 2) continue;
    let from = 0;
    for (;;) {
      const i = text.indexOf(needle, from);
      if (i === -1) break;
      const end = i + needle.length;
      if (!candidates.some((k) => i < k.end && k.start < end)) {
        candidates.push({ type: "ID", start: i, end, text: needle, priority: 50 });
      }
      from = end;
    }
  }
  candidates.sort((a, b) => a.start - b.start);

  const counters = new Map<EntityType, number>();
  const seen = new Map<string, string>(); // normalized original -> token
  const items: RedactedItem[] = [];
  let masked = "";
  let cursor = 0;

  for (const c of candidates) {
    const key = `${c.type}:${digitsOnly(c.text) || c.text.toLowerCase()}`;
    let token = seen.get(key);
    if (!token) {
      const n = (counters.get(c.type) ?? 0) + 1;
      counters.set(c.type, n);
      token = `[${c.type}-${n}]`;
      seen.set(key, token);
    }
    masked += text.slice(cursor, c.start) + token;
    cursor = c.end;
    items.push({ type: c.type, token, original: c.text, start: c.start, end: c.end });
  }
  masked += text.slice(cursor);
  return { masked, items };
}
