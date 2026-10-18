import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { siteConfig as c } from "@/lib/siteConfig";

export const metadata: Metadata = { title: "Data requests | Patra" };

const link = (subject: string) => `mailto:${c.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent("Please describe your request. Do not include your letter or any ID numbers.")}`;

export default function DataRequest() {
  return (
    <LegalPage title="Data requests" short="Patra does not store your letters, so there is normally nothing to delete. You can still ask us to confirm that, or to access, correct or delete anything else we may hold.">
      <h2>What we hold</h2>
      <p>Not your letters, the hidden text or the explanations. The only data that could exist is an email you send us, and short-lived server and hosting logs described in the <a href="/privacy">privacy policy</a>.</p>
      <h2>Make a request</h2>
      <ul>
        <li><a href={link("Patra data access request")}>Ask what data we hold about me</a></li>
        <li><a href={link("Patra data deletion request")}>Ask us to delete my data</a></li>
        <li><a href={link("Patra data correction request")}>Ask us to correct my data</a></li>
        <li><a href={link("Patra withdraw consent")}>Withdraw my consent</a></li>
      </ul>
      <p>We will reply within {c.grievanceOfficer.responseTime}. We may ask a simple question to check that the request comes from you. We keep your email only to handle the request, and delete it 30 days after we finish.</p>
      <h2>Delete it yourself, right now</h2>
      <p>Choose “Clear everything” on the explain page, or close the tab. Clear this site’s data in your browser to remove saved display settings.</p>
    </LegalPage>
  );
}
