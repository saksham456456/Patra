import { describe, expect, it } from "vitest";
import { joinTextItems } from "@/lib/ocr/text";

function makePdf(lines: string[]): Uint8Array {
  const stream = "BT /F1 14 Tf 50 750 Td 18 TL " + lines.map((l) => `(${l}) Tj T*`).join(" ") + " ET";
  const objs = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>",
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ];
  let pdf = "%PDF-1.4\n"; const offsets: number[] = [];
  objs.forEach((o, i) => { offsets.push(pdf.length); pdf += `${i + 1} 0 obj\n${o}\nendobj\n`; });
  const xref = pdf.length;
  pdf += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n` + offsets.map((o) => String(o).padStart(10, "0") + " 00000 n \n").join("");
  pdf += `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return new TextEncoder().encode(pdf);
}

describe("joinTextItems", () => {
  it("keeps line breaks and collapses spacing", () => {
    expect(joinTextItems([{ str: "Dear", hasEOL: false }, { str: "customer,", hasEOL: true }, { str: "Pay  now", hasEOL: true }]))
      .toBe("Dear customer,\nPay now");
  });
  it("ignores items without text", () => {
    expect(joinTextItems([{ hasEOL: true }, { str: "ok" }])).toBe("ok");
  });
});

describe("PDF text extraction (pdf.js legacy build)", () => {
  it("reads text from a digital PDF", async () => {
    const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
    const doc = await pdfjs.getDocument({ data: makePdf(["Your account will be blocked on 30 November 2026", "Update KYC at your branch"]), useWorkerFetch: false }).promise;
    const page = await doc.getPage(1);
    const text = joinTextItems((await page.getTextContent()).items as { str?: string; hasEOL?: boolean }[]);
    expect(text).toContain("blocked on 30 November 2026");
    expect(text).toContain("Update KYC");
  });
});
