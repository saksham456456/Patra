export interface AIProvider {
  readonly name: string;
  /** Returns the raw text of the model's JSON answer. */
  generateJson(args: { system: string; user: string; signal?: AbortSignal }): Promise<string>;
}

/** Google Gemini via REST. Works on the free tier. Free-tier content may be used by Google to improve products. */
export class GeminiProvider implements AIProvider {
  readonly name = "gemini";
  constructor(private apiKey: string, private model: string) {}

  async generateJson({ system, user, signal }: { system: string; user: string; signal?: AbortSignal }) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(this.model)}:generateContent`;
    const res = await fetch(url, {
      method: "POST",
      signal,
      headers: { "content-type": "application/json", "x-goog-api-key": this.apiKey },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ role: "user", parts: [{ text: user }] }],
        generationConfig: { temperature: 0.15, responseMimeType: "application/json", maxOutputTokens: 4096 },
      }),
    });
    if (res.status === 429) throw new ProviderError("rate_limited", 429);
    if (!res.ok) throw new ProviderError("provider_error", res.status);
    const data = (await res.json()) as { candidates?: { content?: { parts?: { text?: string }[] } }[] };
    const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? "";
    if (!text) throw new ProviderError("empty_response", 502);
    return text;
  }
}

/** Offline provider for development, demos and tests. Needs no API key. */
export class MockProvider implements AIProvider {
  readonly name = "mock";
  async generateJson({ user }: { system: string; user: string }) {
    const doc = user.match(/<document>\n([\s\S]*?)\n<\/document>/)?.[1] ?? "";
    const first = doc.split(/\n/).find((l) => l.trim().length > 15)?.trim().slice(0, 120) ?? doc.slice(0, 60);
    const dateLine = doc.match(/\b(\d{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4})\b/i)?.[1];
    const iso = dateLine ? new Date(dateLine + " UTC").toISOString().slice(0, 10) : null;
    return JSON.stringify({
      doc_type: "other", detected_language: "en", confidence: "low",
      confidence_note: "Demo mode: this is a placeholder, not a real AI explanation.",
      headline: "Demo result: connect an AI provider to get a real explanation.",
      urgency: iso ? "soon" : "ignore", urgency_reason: iso ? "A date was found in the letter." : "No date found.",
      high_stakes: false, sender: { name: null, claimed_role: null },
      what_it_means: [{ text: "This is a placeholder summary of the first line of your letter.", source_quote: first.slice(0, 80) }],
      deadlines: dateLine && iso ? [{ label: "Date in letter", date_iso: iso, date_text: dateLine, consequence_if_missed: null,
        claim: { text: "The letter mentions this date.", source_quote: dateLine } }] : [],
      amounts: [], what_they_want: [], if_you_ignore: null,
      next_steps: [{ step: "Set GEMINI_API_KEY to enable real explanations.", why: "Demo mode only.", kind: "wait" }],
      documents_to_gather: [], jargon: [], questions_to_ask: [],
      legitimacy: { verdict: "uncertain", signals: [], how_to_verify: ["Contact the sender using details from their official website."] },
    });
  }
}

export class ProviderError extends Error {
  constructor(public code: "rate_limited" | "provider_error" | "empty_response" | "bad_output", public status: number) {
    super(code);
  }
}

export function getProvider(): AIProvider {
  const kind = process.env.AI_PROVIDER ?? (process.env.GEMINI_API_KEY ? "gemini" : "mock");
  if (kind === "gemini") {
    const key = process.env.GEMINI_API_KEY;
    if (!key) throw new Error("GEMINI_API_KEY is not set");
    // Model IDs on free tiers change often: keep this in env, never hardcode.
    return new GeminiProvider(key, process.env.AI_MODEL_ID ?? "gemini-flash-latest");
  }
  return new MockProvider();
}
