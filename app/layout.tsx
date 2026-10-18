import type { Metadata, Viewport } from "next";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/inter";
import "@fontsource/noto-sans-devanagari/devanagari-400.css";
import "@fontsource/noto-sans-devanagari/devanagari-700.css";
import "./globals.css";
import { headers } from "next/headers";
import { Providers } from "@/components/Providers";
import { Header, Footer } from "@/components/Header";

export const metadata: Metadata = {
  title: "Patra: understand any official letter in 30 seconds",
  description: "Plain-language explanations of tax notices, bank letters, legal notices and forms, in English or Hindi. Private numbers are hidden on your device first.",
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Reading headers opts the app into per-request rendering so the CSP nonce reaches Next's scripts.
  await headers();
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
