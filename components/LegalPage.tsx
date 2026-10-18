import { siteConfig } from "@/lib/siteConfig";

export function LegalPage({ title, short, children }: { title: string; short: string; children: React.ReactNode }) {
  return (
    <div className="wrap page legal">
      <h1>{title}</h1>
      <p className="muted">Version {siteConfig.legal.version}. Last updated {siteConfig.legal.lastUpdated}.</p>
      {!siteConfig.legal.lawyerReviewed && (
        <div className="banner banner-low" role="note">
          Draft: this page has not yet been reviewed by a lawyer. It describes what the service does today.
        </div>
      )}
      <aside className="short" aria-label="The short version"><strong>The short version.</strong> {short}</aside>
      {children}
    </div>
  );
}
