import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { siteConfig as c } from "@/lib/siteConfig";

export const metadata: Metadata = { title: "Accessibility statement | Patra" };

export default function Accessibility() {
  return (
    <LegalPage title="Accessibility statement" short="We aim for WCAG 2.2 level AA. Patra works with a keyboard, offers larger text and a high-contrast theme, and supports Hindi. We have not yet had it audited with screen readers, and we list known gaps below.">
      <h2>Our goal</h2>
      <p>Patra is meant for people who find official paperwork hard, including older people and people who are not comfortable with English or with technology. Our target is WCAG 2.2 level AA.</p>
      <h2>What is in place</h2>
      <ul>
        <li>Everything can be used with a keyboard, with a clearly visible focus outline and a skip link.</li>
        <li>Three text sizes, and light, dark and high-contrast themes. Colour contrast is designed to meet AA.</li>
        <li>Urgency is shown with words and shapes, never colour alone.</li>
        <li>Animations are minimal and switch off if your device asks for reduced motion.</li>
        <li>English and Hindi.</li>
        <li>Images that carry meaning have text alternatives. Decorative ones are hidden from screen readers.</li>
      </ul>
      <h2>Known gaps</h2>
      <ul>
        <li>We have not yet completed testing with screen readers (NVDA, TalkBack, VoiceOver).</li>
        <li>Hindi text has not yet been reviewed by a native speaker.</li>
        <li>Read-aloud is not yet available.</li>
        <li>The legal pages are in English only for now.</li>
      </ul>
      <h2>Tell us about a problem</h2>
      <p>If something is hard to use, email {c.contactEmail}. We aim to reply within {c.grievanceOfficer.responseTime}.</p>
    </LegalPage>
  );
}
