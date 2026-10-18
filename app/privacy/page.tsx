import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { siteConfig as c } from "@/lib/siteConfig";

export const metadata: Metadata = { title: "Privacy policy | Patra" };

export default function Privacy() {
  return (
    <LegalPage title="Privacy policy" short="Your letter stays in your browser. Only text with private numbers hidden is sent to an AI service to be explained. Patra does not save it, has no accounts, and sets no cookies. The AI service’s free plan may use or review what it receives, so don’t share anything you wouldn’t want seen.">
      <h2>Who runs Patra</h2>
      <p>{c.operatorName}, {c.operatorAddress}. Contact: {c.contactEmail}.</p>

      <h2>What happens to your letter</h2>
      <ol>
        <li>You add a letter by pasting text, or by choosing a photo or PDF. Photos and PDFs are read <strong>on your device</strong>. They are not uploaded.</li>
        <li>Patra hides private numbers (Aadhaar, PAN, card, phone, email, account, date of birth and similar) on your device. You can see what was hidden and change it before anything is sent.</li>
        <li>Only the text with those items hidden is sent to our server, and from there to an AI service, to produce the explanation.</li>
        <li>The explanation comes back to your browser. Patra does not store your letter, the hidden text or the explanation. Closing the tab or choosing “Clear everything” removes it from your device.</li>
      </ol>

      <h2>The AI service</h2>
      <p>Explanations are produced by {c.aiProvider}. On free plans, the provider’s terms may allow it to use the text it receives to improve its products, and people may review it. This is why Patra hides private numbers first, and why you should not add anything you would not want a stranger to read. Names, addresses and other details that are not on the hidden list can still be in the text, and you can hide more words yourself before sending.</p>

      <h2>What Patra does not collect</h2>
      <p>No accounts, no passwords, no cookies, no advertising, no analytics and no tracking. Patra does not build a profile of you.</p>

      <h2>What Patra does process</h2>
      <ul>
        <li><strong>Request details.</strong> To prevent abuse, the server briefly uses your IP address to count how many explanations you ask for. The address is scrambled with a secret value, held in server memory for at most 24 hours, and never written to a database.</li>
        <li><strong>Hosting logs.</strong> Our hosting provider ({c.hosting}) may keep standard server logs such as time, page and IP address, under its own policy. Patra does not log letter text or explanations.</li>
        <li><strong>Display settings.</strong> Language, text size and theme are saved in your browser only. See the <a href="/cookies">cookie policy</a>.</li>
      </ul>

      <h2>Your consent</h2>
      <p>Before your text is sent, you confirm that you are 18 or older and that you understand how it is handled. You can stop at any time by not pressing “Looks good, explain”. Nothing is sent before that. Patra does not keep a record of your consent on the server.</p>

      <h2>Your rights</h2>
      <p>You can ask to access, correct or delete personal data we hold about you, to withdraw consent, and to complain. Because Patra does not store your letters, there is usually nothing to delete, but you can still ask. See <a href="/data-request">data requests</a> and <a href="/contact">contact</a>. If we cannot resolve your complaint, you may approach the relevant authority under Indian law.</p>

      <h2>Children</h2>
      <p>Patra is for people aged 18 and over. We do not knowingly collect children’s data. If you believe a child has used Patra, contact us and we will help.</p>

      <h2>Service providers</h2>
      <table className="tbl">
        <thead><tr><th>Provider</th><th>Purpose</th><th>What it can see</th></tr></thead>
        <tbody>
          <tr><td>{c.aiProvider}</td><td>Writes the explanation</td><td>The text with private numbers hidden</td></tr>
          <tr><td>{c.hosting}</td><td>Runs the website</td><td>Standard request details</td></tr>
        </tbody>
      </table>
      <p>These providers may process data outside India.</p>

      <h2>Security</h2>
      <p>Connections use HTTPS. The website sends strict security headers, loads no third-party scripts, and the on-device reader is hosted by Patra itself. No system is perfectly secure. To report a problem, email {c.contactEmail}.</p>

      <h2>Changes</h2>
      <p>When this policy changes we update the version and date at the top, and keep a record of changes.</p>

      <h2>Complaints</h2>
      <p>Grievance officer: {c.grievanceOfficer.name}, {c.grievanceOfficer.email}. We aim to reply within {c.grievanceOfficer.responseTime}.</p>
    </LegalPage>
  );
}
