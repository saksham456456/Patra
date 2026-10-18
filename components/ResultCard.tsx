"use client";
import { useState } from "react";
import type { Claim, ExplainResult } from "@/lib/ai/schema";
import { Stamp } from "./Stamp";
import { useSettings } from "./Providers";
import type { Key } from "@/lib/i18n";

function ClaimView({ claim, text }: { claim: Claim; text?: string }) {
  const { t } = useSettings();
  const [open, setOpen] = useState(false);
  return (
    <div className="claim">
      {(text ?? claim.text) && <p>{text ?? claim.text}</p>}
      <button className="linkish" aria-expanded={open} onClick={() => setOpen(!open)}>{t("r_line")}</button>
      {open && (
        <blockquote className={claim.verified === false ? "quote quote-unverified" : "quote"}>
          <span className="mark">{claim.source_quote}</span>
          {claim.verified === false && <p className="note">{t("r_unverified")}</p>}
        </blockquote>
      )}
    </div>
  );
}

export function ResultCard({ r }: { r: ExplainResult }) {
  const { t } = useSettings();
  const dirLabel: Record<string, Key> = { you_pay: "r_pay", you_receive: "r_receive", informational: "r_info" };
  const countdown = (d: number | null | undefined) =>
    d == null ? null : d < 0 ? t("r_past") : d === 0 ? t("r_today") : `${d} ${t("r_days")}`;

  return (
    <article className="result" aria-labelledby="result-h">
      <div className="result-top">
        <Stamp level={r.urgency} label={t(`u_${r.urgency}` as Key)} animate />
        <div>
          <h2 id="result-h" className="result-headline">{r.headline}</h2>
          <p className="muted">{r.urgency_reason}</p>
        </div>
      </div>

      {r.high_stakes && <div className="banner banner-stakes" role="note">{t("r_stakes")}</div>}
      {r.confidence === "low" && <div className="banner banner-low" role="note">{r.confidence_note || t("r_low")}</div>}

      {r.deadlines.length > 0 && (
        <section><h3>{t("r_deadlines")}</h3>
          <ul className="deadlines">
            {r.deadlines.map((d, i) => (
              <li key={i}>
                <div className="deadline-head"><strong>{d.label}</strong>
                  <span className="chip">{d.date_text}{countdown(d.days_left) ? `, ${countdown(d.days_left)}` : ""}</span></div>
                <ClaimView claim={d.claim} />
                {d.consequence_if_missed && <ClaimView claim={d.consequence_if_missed} />}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section><h3>{t("r_means")}</h3>{r.what_it_means.map((c, i) => <ClaimView key={i} claim={c} />)}</section>

      {r.what_they_want.length > 0 && (
        <section><h3>{t("r_want")}</h3>
          <ul className="checklist">{r.what_they_want.map((w, i) => (
            <li key={i}><label><input type="checkbox" /> <span>{w.action}</span></label><ClaimView claim={w.claim} text="" /></li>
          ))}</ul>
        </section>
      )}

      {r.amounts.length > 0 && (
        <section><h3>{t("r_money")}</h3>
          <ul className="amounts">{r.amounts.map((a, i) => (
            <li key={i}><span className="amount">{a.value_text}</span> <span>{a.label}</span> <span className="muted">({t(dirLabel[a.direction]!)})</span></li>
          ))}</ul>
        </section>
      )}

      <section><h3>{t("r_ignore")}</h3>
        {r.if_you_ignore ? <ClaimView claim={r.if_you_ignore} /> : <p className="muted">{t("r_none")}</p>}
      </section>

      <section><h3>{t("r_steps")}</h3>
        <ol className="steps">{r.next_steps.map((s, i) => <li key={i}><strong>{s.step}</strong><span className="muted"> {s.why}</span></li>)}</ol>
        {r.documents_to_gather.length > 0 && (<><h4>{t("r_gather")}</h4><ul>{r.documents_to_gather.map((d, i) => <li key={i}>{d}</li>)}</ul></>)}
      </section>

      <section><h3>{t("r_real")}</h3>
        <p className={`verdict verdict-${r.legitimacy.verdict}`}>{t(`v_${r.legitimacy.verdict}` as Key)}</p>
        {r.legitimacy.signals.length > 0 && <ul>{r.legitimacy.signals.map((s, i) => <li key={i}>{s.detail}</li>)}</ul>}
        <ul>{r.legitimacy.how_to_verify.map((v, i) => <li key={i}>{v}</li>)}</ul>
      </section>

      {r.jargon.length > 0 && (
        <section><h3>{t("r_jargon")}</h3>
          <dl>{r.jargon.map((j, i) => <div key={i}><dt>{j.term}</dt><dd>{j.plain_meaning}</dd></div>)}</dl>
        </section>
      )}

      {r.questions_to_ask.length > 0 && (
        <section><h3>{t("r_ask")}</h3><ul>{r.questions_to_ask.map((q, i) => <li key={i}>{q}</li>)}</ul></section>
      )}

      <footer className="result-foot">{r.disclaimers?.map((d, i) => <p key={i}>{d}</p>)}</footer>
    </article>
  );
}
