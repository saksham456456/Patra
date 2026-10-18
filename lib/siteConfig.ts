// Single place for owner-specific details. Every legal/about page reads from here.
// TODO(owner): replace every placeholder before public launch.
export const siteConfig = {
  name: "Patra",
  nativeName: "पत्र",
  domain: "TODO(owner): your-domain.in",
  operatorName: "TODO(owner): your legal name or entity",
  operatorAddress: "TODO(owner): contact address",
  contactEmail: "TODO(owner): hello@your-domain.in",
  grievanceOfficer: { name: "TODO(owner)", email: "TODO(owner): grievance@your-domain.in", responseTime: "7 days" },
  hosting: "TODO(owner): hosting provider (for example Vercel) and region",
  aiProvider: "Google (Gemini API, free tier)",
  legal: { version: "0.1 (draft)", lastUpdated: "18 October 2026", lawyerReviewed: false },
  independence: "Patra is an independent tool. It is not affiliated with any government department, bank, insurer or other sender of letters.",
} as const;
