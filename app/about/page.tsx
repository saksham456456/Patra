import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";
import { siteConfig as c } from "@/lib/siteConfig";

export const metadata: Metadata = { title: "About | Patra" };

export default function About() {
  return (
    <LegalPage title="About Patra" short="Patra helps people understand official letters. It is independent, free, and run by the person named below.">
      <h2>Why it exists</h2>
      <p>Official letters are often written in hard language, hide their deadlines, and are sometimes fake. Missing a deadline or falling for a scam can be costly. Patra reads the letter with you and says what it means, what it wants and what to do next.</p>
      <h2>What Patra is not</h2>
      <p>{c.independence} Patra is not a lawyer, a chartered accountant or a financial advisor, and it can make mistakes.</p>
      <h2>Who runs it</h2>
      <p>{c.operatorName}<br />{c.operatorAddress}<br />{c.contactEmail}</p>
      <h2>How it works</h2>
      <p>See <Link href="/#how">how it works</Link> and the <a href="/privacy">privacy policy</a>.</p>
    </LegalPage>
  );
}
