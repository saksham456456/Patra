import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { siteConfig as c } from "@/lib/siteConfig";

export const metadata: Metadata = { title: "Refund policy | Patra" };

export default function Refunds() {
  return (
    <LegalPage title="Refund policy" short="Patra is free. There is nothing to pay and nothing to refund.">
      <h2>Today</h2>
      <p>Patra does not charge for any feature, has no subscriptions, and has no hidden fees. We never ask for payment details.</p>
      <h2>If paid plans are ever introduced</h2>
      <p>We will show the full price, what it includes and how to cancel before you pay, and publish the refund terms here before any plan goes on sale. Existing free features will not be quietly moved behind a payment.</p>
      <h2>Questions</h2>
      <p>{c.contactEmail}</p>
    </LegalPage>
  );
}
