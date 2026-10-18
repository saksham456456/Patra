import type { ExplainResult } from "./schema";

function todayIn(tz: string, now = new Date()): string {
  try {
    return new Intl.DateTimeFormat("en-CA", { timeZone: tz }).format(now); // YYYY-MM-DD
  } catch {
    return now.toISOString().slice(0, 10);
  }
}

const isRealDate = (iso: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
  const d = new Date(iso + "T00:00:00Z");
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === iso;
};

/** Drops impossible dates and computes days_left in the user's timezone. */
export function enrichDeadlines(result: ExplainResult, tz: string, now = new Date()) {
  const today = todayIn(tz, now);
  for (const d of result.deadlines) {
    if (d.date_iso && !isRealDate(d.date_iso)) d.date_iso = null;
    d.days_left = d.date_iso
      ? Math.round((Date.parse(d.date_iso + "T00:00:00Z") - Date.parse(today + "T00:00:00Z")) / 86_400_000)
      : null;
  }
}
