import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { siteConfig as c } from "@/lib/siteConfig";

export const metadata: Metadata = { title: "Terms of service | Patra" };

export default function Terms() {
  return (
    <LegalPage title="Terms of service" short="Patra explains letters. It is not a lawyer, accountant or advisor, and it can be wrong. Check anything important with the sender or a professional. You must be 18 or older, and use Patra lawfully.">
      <h2>1. What Patra is</h2>
      <p>Patra is a free tool that uses AI to explain official letters and documents in plain language. It is run by {c.operatorName}. {c.independence}</p>

      <h2>2. Not advice</h2>
      <p>Explanations are for information only. They are not legal, tax, financial, medical or other professional advice, and they do not create any professional relationship. The AI can misread a letter or make mistakes. Patra shows the line of your letter behind each point so you can check it, and marks lines it could not find. Always confirm deadlines, amounts and instructions with the sender, using contact details you found yourself on their official website, and talk to a qualified professional about serious matters.</p>

      <h2>3. Who can use Patra</h2>
      <p>You must be 18 or older. By using Patra you confirm this.</p>

      <h2>4. Your responsibilities</h2>
      <ul>
        <li>Only add documents you have the right to use.</li>
        <li>Do not add passwords, OTPs or anything you would not want an AI service to see.</li>
        <li>Do not use Patra to break the law, to forge or falsify documents, to deceive others, or to evade a lawful notice.</li>
        <li>Do not attack, overload, scrape or try to bypass the limits of the service.</li>
      </ul>

      <h2>5. Scam checks</h2>
      <p>The “Is this real?” check looks for common warning signs. It cannot prove that a letter is genuine or fake. If in doubt, contact the sender through an official channel, and report fraud at cybercrime.gov.in or call 1930.</p>

      <h2>6. Availability and changes</h2>
      <p>Patra is provided free and may be limited, changed or stopped at any time, for example when a daily capacity limit is reached.</p>

      <h2>7. No warranty and limits on liability</h2>
      <p>Patra is provided “as is”. To the extent the law allows, we are not liable for loss caused by relying on an explanation, by missed deadlines, or by the service being unavailable. Nothing here limits any right you have under law that cannot be limited.</p>

      <h2>8. Privacy</h2>
      <p>See the <a href="/privacy">privacy policy</a> for how your letter is handled.</p>

      <h2>9. Governing law</h2>
      <p>Indian law applies. TODO(owner): name the city whose courts have jurisdiction, after legal review.</p>

      <h2>10. Contact</h2>
      <p>{c.contactEmail}</p>
    </LegalPage>
  );
}
