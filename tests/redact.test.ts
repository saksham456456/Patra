import { describe, expect, it } from "vitest";
import { redact } from "@/lib/redact";
import { luhn, verhoeff } from "@/lib/redact/checksums";

describe("checksums", () => {
  it("luhn accepts the standard test card and rejects a bad one", () => {
    expect(luhn("4111111111111111")).toBe(true);
    expect(luhn("4111111111111112")).toBe(false);
  });
  it("verhoeff detects a single-digit error", () => {
    // generate a valid number by brute-forcing the check digit
    const base = "23456789012";
    const valid = Array.from({ length: 10 }, (_, d) => base + d).find(verhoeff)!;
    expect(valid).toBeTruthy();
    const bad = valid.slice(0, -1) + ((Number(valid.at(-1)) + 1) % 10);
    expect(verhoeff(bad)).toBe(false);
  });
});

function validAadhaar(): string {
  const base = "23456789012";
  return base + Array.from({ length: 10 }, (_, d) => d).find((d) => verhoeff(base + d))!;
}

describe("redact", () => {
  it("masks a valid Aadhaar (spaced) but not a random 12-digit amount", () => {
    const a = validAadhaar();
    const spaced = `${a.slice(0, 4)} ${a.slice(4, 8)} ${a.slice(8)}`;
    const r = redact(`Aadhaar: ${spaced}. Reference 100000000001.`);
    expect(r.masked).toContain("[AADHAAR-1]");
    expect(r.masked).not.toContain(spaced);
    expect(r.masked).toContain("100000000001"); // fails checksum, kept
  });

  it("masks PAN, email, phone and a Luhn-valid card", () => {
    const r = redact("PAN ABCDE1234F, mail raj.k@example.com, call +91 98765 43210, card 4111 1111 1111 1111.");
    expect(r.masked).toContain("[PAN-1]");
    expect(r.masked).toContain("[EMAIL-1]");
    expect(r.masked).toContain("[PHONE-1]");
    expect(r.masked).toContain("[CARD-1]");
    expect(r.masked).not.toMatch(/ABCDE1234F|raj\.k@|98765|4111/);
  });

  it("masks account numbers only after an account keyword", () => {
    const r = redact("Your A/C No. 123456789012 is overdue. Amount due 123456789012 rupees.");
    expect(r.masked).toContain("[ACCOUNT-1]");
    expect(r.items.filter((i) => i.type === "ACCOUNT")).toHaveLength(1);
  });

  it("gives the same token to the same value", () => {
    const r = redact("PAN ABCDE1234F ... again ABCDE1234F and other FGHIJ5678K");
    expect(r.masked).toBe("PAN [PAN-1] ... again [PAN-1] and other [PAN-2]");
  });

  it("does not mask years, PIN codes, or ordinary rupee amounts", () => {
    const text = "Pay Rs. 12,450 by 31 March 2027. PIN 110001. Assessment year 2025-26.";
    expect(redact(text).masked).toBe(text);
  });

  it("supports user-added masks (e.g. a name)", () => {
    const r = redact("Dear Sunita Devi, your notice is attached.", ["Sunita Devi"]);
    expect(r.masked).not.toContain("Sunita");
  });

  it("masks DOB only after a keyword", () => {
    const r = redact("DOB: 14/03/1968. Notice date 14/03/2026.");
    expect(r.masked).toContain("[DOB-1]");
    expect(r.masked).toContain("14/03/2026");
  });
});
