import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { siteConfig as c } from "@/lib/siteConfig";

export const metadata: Metadata = { title: "Contact and grievances | Patra" };

export default function Contact() {
  return (
    <LegalPage title="Contact and grievances" short="Email us for anything. For a complaint about how your data is handled, write to the grievance officer.">
      <h2>General contact</h2>
      <p>{c.contactEmail}</p>
      <h2>Grievance officer</h2>
      <p>{c.grievanceOfficer.name}<br />{c.grievanceOfficer.email}<br />We aim to acknowledge and reply within {c.grievanceOfficer.responseTime}.</p>
      <h2>Reporting a security problem</h2>
      <p>Email {c.contactEmail} with the subject “Security”. Please give us reasonable time to fix a problem before sharing it publicly.</p>
      <h2>Data requests</h2>
      <p>See <a href="/data-request">data requests</a>.</p>
    </LegalPage>
  );
}
