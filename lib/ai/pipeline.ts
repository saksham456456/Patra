import { ExplainResult } from "./schema";
import { systemPrompt, userPrompt } from "../prompts/base";
import { ProviderError, type AIProvider } from "./providers";
import { verifyQuotes } from "./verify";
import { enrichDeadlines } from "./dates";

const STANDARD_DISCLAIMERS = [
  "This explains your letter. It is not legal, tax or financial advice.",
  "Patra is independent and not connected to any government, bank or insurer.",
];

function parseJson(raw: string): unknown {
  const cleaned = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  return JSON.parse(cleaned);
}

export interface PipelineOutput {
  result: ExplainResult;
  meta: { quotesVerified: number; quotesTotal: number; provider: string };
}

export async function explainDocument(args: {
  provider: AIProvider; maskedText: string; outputLang: "en" | "hi"; clientTz: string; signal?: AbortSignal;
}): Promise<PipelineOutput> {
  const system = systemPrompt(args.outputLang);
  const user = userPrompt(args.maskedText);

  let raw = await args.provider.generateJson({ system, user, signal: args.signal });
  let parsed = tryParse(raw);

  // One repair attempt: tell the model exactly what was wrong.
  if (!parsed.ok) {
    raw = await args.provider.generateJson({
      system,
      user: `${user}\n\nYour previous answer was invalid: ${parsed.error}\nReturn corrected JSON only.`,
      signal: args.signal,
    });
    parsed = tryParse(raw);
    if (!parsed.ok) throw new ProviderError("bad_output", 502);
  }

  const result = parsed.value;
  const { total, verified } = verifyQuotes(result, args.maskedText);
  enrichDeadlines(result, args.clientTz);
  result.disclaimers = [...(result.disclaimers ?? []), ...STANDARD_DISCLAIMERS];
  return { result, meta: { quotesVerified: verified, quotesTotal: total, provider: args.provider.name } };
}

function tryParse(raw: string): { ok: true; value: ExplainResult } | { ok: false; error: string } {
  try {
    const r = ExplainResult.safeParse(parseJson(raw));
    if (r.success) return { ok: true, value: r.data };
    return { ok: false, error: r.error.issues.slice(0, 5).map((i) => `${i.path.join(".")}: ${i.message}`).join("; ") };
  } catch {
    return { ok: false, error: "not valid JSON" };
  }
}
