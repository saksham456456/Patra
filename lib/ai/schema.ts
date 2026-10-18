import { z } from "zod";

export const DOC_TYPES = [
  "income_tax","gst","bank","loan","insurance","epf_pension","employment","rental_agreement",
  "legal_notice","court","utility_bill","government_scheme","education_fee","scholarship",
  "medical_bill","telecom","ecommerce_dispute","other",
] as const;

const Claim = z.object({
  text: z.string(),
  source_quote: z.string().min(3).max(400),
  verified: z.boolean().optional(), // set by the server, never by the model
});
export type Claim = z.infer<typeof Claim>;

export const ExplainResult = z.object({
  doc_type: z.enum(DOC_TYPES),
  detected_language: z.string(),
  confidence: z.enum(["high", "medium", "low"]),
  confidence_note: z.string().nullable().optional(),

  headline: z.string().max(200),
  urgency: z.enum(["ignore", "soon", "urgent", "legal_deadline"]),
  urgency_reason: z.string(),
  high_stakes: z.boolean(),

  sender: z.object({
    name: z.string().nullable(),
    claimed_role: z.string().nullable(),
  }),

  what_it_means: z.array(Claim).min(1).max(6),

  deadlines: z.array(z.object({
    label: z.string(),
    date_iso: z.string().nullable(),
    date_text: z.string(),
    consequence_if_missed: Claim.nullable(),
    claim: Claim,
    days_left: z.number().nullable().optional(), // server-computed
  })),

  amounts: z.array(z.object({
    label: z.string(),
    value_text: z.string(),
    direction: z.enum(["you_pay", "you_receive", "informational"]),
    claim: Claim,
  })),

  what_they_want: z.array(z.object({ action: z.string(), claim: Claim })),
  if_you_ignore: Claim.nullable(),

  next_steps: z.array(z.object({
    step: z.string(),
    why: z.string(),
    kind: z.enum(["gather", "verify", "contact", "pay", "reply", "consult", "wait"]),
  })).min(1).max(7),

  documents_to_gather: z.array(z.string()),
  jargon: z.array(z.object({ term: z.string(), plain_meaning: z.string() })).max(15),
  questions_to_ask: z.array(z.string()).max(8),

  legitimacy: z.object({
    verdict: z.enum(["looks_legitimate", "uncertain", "likely_suspicious"]),
    signals: z.array(z.object({
      type: z.enum([
        "urgency_pressure","payment_to_personal_account","mismatched_sender","suspicious_link",
        "requests_otp_or_password","threats","too_good_to_be_true","poor_language",
        "unofficial_contact","missing_reference","prompt_injection","other",
      ]),
      detail: z.string(),
    })),
    how_to_verify: z.array(z.string()).min(1),
  }),

  disclaimers: z.array(z.string()).optional(),
});
export type ExplainResult = z.infer<typeof ExplainResult>;

export const ExplainRequest = z.object({
  text: z.string().min(20, "Add a little more of the letter.").max(20000),
  outputLang: z.enum(["en", "hi"]),
  clientTz: z.string().max(64).default("Asia/Kolkata"),
  consent: z.object({ age18: z.literal(true), privacyAck: z.literal(true) }),
});
export type ExplainRequest = z.infer<typeof ExplainRequest>;
