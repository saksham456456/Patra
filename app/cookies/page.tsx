import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Cookie policy | Patra" };

export default function Cookies() {
  return (
    <LegalPage title="Cookie policy" short="Patra sets no cookies and uses no analytics or advertising trackers. It saves three display settings in your browser’s local storage, which are needed to remember your choices.">
      <h2>Cookies</h2>
      <p>Patra does not set any cookies.</p>

      <h2>Local storage</h2>
      <p>To remember your choices on this device, Patra saves these items in your browser’s local storage. They never leave your device and contain no personal data.</p>
      <table className="tbl">
        <thead><tr><th>Name</th><th>What it remembers</th></tr></thead>
        <tbody>
          <tr><td><code>patra.lang</code></td><td>Your language (English or Hindi)</td></tr>
          <tr><td><code>patra.size</code></td><td>Your text size</td></tr>
          <tr><td><code>patra.theme</code></td><td>Light, dark or high-contrast theme</td></tr>
        </tbody>
      </table>
      <p>Because these are strictly needed for features you ask for, no consent banner is shown.</p>

      <h2>If this changes</h2>
      <p>If Patra ever adds optional analytics or other non-essential storage, we will ask for your consent first, make “reject” as easy as “accept”, and add a page where you can change your choice at any time.</p>

      <h2>How to clear these</h2>
      <p>Clear this site’s data in your browser settings. Your letter itself is never saved in local storage.</p>
    </LegalPage>
  );
}
