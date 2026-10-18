"use client";
import Link from "next/link";
import { useSettings } from "@/components/Providers";
import { Stamp } from "@/components/Stamp";

export default function Landing() {
  const { t } = useSettings();
  return (
    <>
      <section className="hero wrap">
        <div className="hero-copy">
          <h1>{t("hero_h1")}</h1>
          <p className="lead">{t("hero_sub")}</p>
          <div className="row">
            <Link href="/explain" className="btn btn-primary">{t("hero_cta")}</Link>
          </div>
          <p className="hint">{t("privacy_strip")}</p>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="sample-letter">
            <p>…your account will be blocked on 30 November 2026 unless your KYC is updated at your branch…</p>
          </div>
          <Stamp level="soon" label="Soon" animate />
        </div>
      </section>

      <section id="how" className="wrap band">
        <h2>{t("steps_h")}</h2>
        <ol className="how">
          <li><h3>{t("s1_t")}</h3><p>{t("s1_d")}</p></li>
          <li><h3>{t("s2_t")}</h3><p>{t("s2_d")}</p></li>
          <li><h3>{t("s3_t")}</h3><p>{t("s3_d")}</p></li>
        </ol>
      </section>

      <section className="wrap band">
        <h2>{t("priv_h")}</h2>
        <ul className="plain">
          <li>{t("priv_1")}</li><li>{t("priv_2")}</li><li>{t("priv_3")}</li><li>{t("priv_4")}</li>
        </ul>
      </section>
    </>
  );
}
