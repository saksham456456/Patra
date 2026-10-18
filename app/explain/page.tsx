"use client";
import { useMemo, useRef, useState } from "react";
import { redact } from "@/lib/redact";
import type { ExplainResult } from "@/lib/ai/schema";
import { ResultCard } from "@/components/ResultCard";
import { useSettings } from "@/components/Providers";
import type { Key, Lang } from "@/lib/i18n";
import { ExtractError } from "@/lib/ocr/text";

type Step = "add" | "check" | "loading" | "result";
type Source = "paste" | "file";

export default function ExplainPage() {
  const { t, lang } = useSettings();
  const [step, setStep] = useState<Step>("add");
  const [text, setText] = useState("");
  const [outLang, setOutLang] = useState<Lang | null>(null);
  const [age, setAge] = useState(false);
  const [ack, setAck] = useState(false);
  const [extra, setExtra] = useState<string[]>([]);
  const [keep, setKeep] = useState<string[]>([]);
  const [more, setMore] = useState("");
  const [result, setResult] = useState<ExplainResult | null>(null);
  const [error, setError] = useState<Key | null>(null);
  const abort = useRef<AbortController | null>(null);
  const [source, setSource] = useState<Source>("paste");
  const [reading, setReading] = useState<string | null>(null);
  const [fileMsg, setFileMsg] = useState<{ key: Key; kind: "ok" | "warn" | "err" } | null>(null);

  const language = outLang ?? lang;
  const redaction = useMemo(() => redact(text, extra, keep), [text, extra, keep]);
  const canContinue = age && ack && text.trim().length >= 20;

  function clearAll() {
    abort.current?.abort();
    setText(""); setExtra([]); setKeep([]); setMore(""); setResult(null); setError(null); setStep("add");
  }

  async function onFile(file: File | undefined) {
    if (!file) return;
    setFileMsg(null); setReading(t("e_reading_load"));
    try {
      // Loaded only when needed: keeps the OCR engine out of the normal page weight.
      const { extractFromFile } = await import("@/lib/ocr/client");
      const out = await extractFromFile(file, (p) =>
        setReading(p.stage === "loading" ? t("e_reading_load") : `${t("e_reading_page")} ${p.page}/${p.pages}${p.pct ? ` (${Math.round(p.pct * 100)}%)` : ""}`));
      setText(out.text); setExtra([]); setKeep([]); setSource("paste");
      setFileMsg({ key: out.lowConfidence ? "e_ocr_low" : "e_ocr_ok", kind: out.lowConfidence ? "warn" : "ok" });
    } catch (e) {
      const code = e instanceof ExtractError ? e.code : "unreadable";
      setFileMsg({ key: `e_err_${code}` as Key, kind: "err" });
    } finally { setReading(null); }
  }

  async function explain() {
    setError(null); setStep("loading");
    const ctl = new AbortController(); abort.current = ctl;
    try {
      const res = await fetch("/api/explain", {
        method: "POST", signal: ctl.signal, headers: { "content-type": "application/json" },
        body: JSON.stringify({
          text: redaction.masked, outputLang: language,
          clientTz: Intl.DateTimeFormat().resolvedOptions().timeZone,
          consent: { age18: true, privacyAck: true },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        const k = `err_${data.error}` as Key;
        setError(["err_rate_limited", "err_capacity_reached", "err_invalid"].includes(k) ? k : "err_generic");
        setStep("check"); return;
      }
      setResult(data as ExplainResult); setStep("result");
    } catch (e) {
      if ((e as Error).name === "AbortError") return;
      setError("err_generic"); setStep("check");
    }
  }

  return (
    <div className="wrap page" id="main-inner">
      <div className="page-head">
        <h1>{t("e_title")}</h1>
        {step !== "add" && <button className="btn btn-quiet" onClick={clearAll}>{t("e_clear")}</button>}
      </div>

      {step === "add" && (
        <div className="stack">
          <div className="seg seg-wide" role="group" aria-label="Input type">
            <button aria-pressed={source === "paste"} onClick={() => setSource("paste")}>{t("e_tab_paste")}</button>
            <button aria-pressed={source === "file"} onClick={() => setSource("file")}>{t("e_tab_file")}</button>
          </div>
          {fileMsg && <div className={fileMsg.kind === "err" ? "banner banner-stakes" : fileMsg.kind === "warn" ? "banner banner-low" : "banner"} role={fileMsg.kind === "err" ? "alert" : "status"}>{t(fileMsg.key)}</div>}
          {source === "file" ? (
            <div className="stack">
              <div className="row">
                <label className="btn btn-primary file-btn">{t("e_choose_file")}
                  <input type="file" className="sr" accept="image/jpeg,image/png,image/webp,application/pdf" disabled={!!reading}
                    onChange={(e) => { void onFile(e.target.files?.[0]); e.target.value = ""; }} />
                </label>
                <label className="btn file-btn">{t("e_take_photo")}
                  <input type="file" className="sr" accept="image/*" capture="environment" disabled={!!reading}
                    onChange={(e) => { void onFile(e.target.files?.[0]); e.target.value = ""; }} />
                </label>
              </div>
              {reading && <p role="status" aria-live="polite" className="loading">{reading}</p>}
              <p className="hint">{t("e_file_hint")}</p>
            </div>
          ) : (
            <label className="field">
              <span className="field-label">{t("e_paste_label")}</span>
              <textarea rows={12} value={text} onChange={(e) => setText(e.target.value)} aria-describedby="paste-hint" spellCheck={false} />
              <span id="paste-hint" className="hint">{t("e_paste_hint")}</span>
            </label>
          )}
          <label className="field field-inline">
            <span className="field-label">{t("e_lang")}</span>
            <select value={language} onChange={(e) => setOutLang(e.target.value as Lang)}>
              <option value="en">English</option><option value="hi">हिन्दी</option>
            </select>
          </label>
          <label className="check"><input type="checkbox" checked={age} onChange={(e) => setAge(e.target.checked)} /> <span>{t("e_age")}</span></label>
          <label className="check"><input type="checkbox" checked={ack} onChange={(e) => setAck(e.target.checked)} /> <span>{t("e_ack")}</span></label>
          <div>
            <button className="btn btn-primary" disabled={!canContinue} aria-describedby="need" onClick={() => setStep("check")}>{t("e_continue")}</button>
            {!canContinue && <p id="need" className="hint">{t("e_need")}</p>}
          </div>
        </div>
      )}

      {(step === "check" || step === "loading") && (
        <div className="stack">
          {error && <div className="banner banner-stakes" role="alert">{t(error)}</div>}
          <div className="split">
            <section aria-labelledby="sendtext">
              <h2 id="sendtext" className="h3">{t("e_leaves")}</h2>
              <pre className="doc">{redaction.masked}</pre>
            </section>
            <section aria-labelledby="hid">
              <h2 id="hid" className="h3">{t("e_hidden_h")}</h2>
              {redaction.items.length === 0 && <p className="muted">{t("e_none")}</p>}
              <ul className="hidden-list">
                {redaction.items.map((it, i) => (
                  <li key={i}><code>{it.token}</code>
                    {extra.includes(it.original) ? null : (
                      <button className="linkish" onClick={() => setKeep([...keep, it.original])}>{t("e_unhide")}</button>)}
                  </li>
                ))}
              </ul>
              {keep.length > 0 && <button className="linkish" onClick={() => setKeep([])}>↺</button>}
              <form className="inline-form" onSubmit={(e) => { e.preventDefault(); if (more.trim().length > 1) { setExtra([...extra, more.trim()]); setMore(""); } }}>
                <label className="field"><span className="field-label">{t("e_hide_more")}</span>
                  <input value={more} onChange={(e) => setMore(e.target.value)} /></label>
                <button className="btn" type="submit">{t("e_add")}</button>
              </form>
            </section>
          </div>
          <div className="row">
            <button className="btn" onClick={() => setStep("add")} disabled={step === "loading"}>{t("e_back")}</button>
            {step === "check"
              ? <button className="btn btn-primary" onClick={explain}>{t("e_go")}</button>
              : <><span role="status" aria-live="polite" className="loading">{t("e_loading")}</span>
                  <button className="btn" onClick={() => { abort.current?.abort(); setStep("check"); }}>{t("e_cancel")}</button></>}
          </div>
        </div>
      )}

      {step === "result" && result && (
        <div className="stack">
          <ResultCard r={result} />
          <div className="row"><button className="btn btn-primary" onClick={clearAll}>{t("e_again")}</button></div>
        </div>
      )}
    </div>
  );
}
