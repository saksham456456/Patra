export interface TextItemLike { str?: string; hasEOL?: boolean }

/** Joins PDF.js text items into readable text, keeping line breaks where the PDF has them. */
export function joinTextItems(items: TextItemLike[]): string {
  let out = "";
  for (const it of items) {
    if (typeof it.str !== "string") continue;
    out += it.str + (it.hasEOL ? "\n" : " ");
  }
  return out.replace(/[ \t]+\n/g, "\n").replace(/ {2,}/g, " ").replace(/\n{3,}/g, "\n\n").trim();
}

export const MAX_PAGES = 15;
export const MAX_IMAGE_BYTES = 12 * 1024 * 1024;
export const MAX_PDF_BYTES = 15 * 1024 * 1024;
export const MAX_EDGE_PX = 2000;
export const LOW_CONFIDENCE = 60;

export type ExtractErrorCode = "type" | "too_big" | "password" | "unreadable" | "unavailable";
export class ExtractError extends Error {
  constructor(public code: ExtractErrorCode) { super(code); }
}
