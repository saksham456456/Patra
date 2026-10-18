"use client";
import Link from "next/link";
import { LogoMark } from "./Logo";
import { useSettings } from "./Providers";

export function Header() {
  const { lang, setLang, size, setSize, theme, setTheme, t } = useSettings();
  return (
    <header className="site-header">
      <a className="skip" href="#main">Skip to content</a>
      <div className="wrap header-row">
        <Link href="/" className="brand" aria-label="Patra home">
          <LogoMark size={34} />
          <span className="brand-name">Patra</span>
        </Link>
        <nav className="nav" aria-label="Main">
          <Link href="/#how">{t("nav_how")}</Link>
        </nav>
        <div className="controls" role="group" aria-label="Display settings">
          <div className="seg" role="group" aria-label="Language">
            <button aria-pressed={lang === "en"} onClick={() => setLang("en")}>EN</button>
            <button aria-pressed={lang === "hi"} onClick={() => setLang("hi")} lang="hi">हिं</button>
          </div>
          <div className="seg" role="group" aria-label="Text size">
            <button aria-pressed={size === "base"} onClick={() => setSize("base")} aria-label="Normal text">A</button>
            <button aria-pressed={size === "lg"} onClick={() => setSize("lg")} aria-label="Larger text">A+</button>
            <button aria-pressed={size === "xl"} onClick={() => setSize("xl")} aria-label="Largest text">A++</button>
          </div>
          <label className="theme">
            <span className="sr">Theme</span>
            <select value={theme} onChange={(e) => setTheme(e.target.value as typeof theme)}>
              <option value="system">Auto</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="hc">High contrast</option>
            </select>
          </label>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  const { t } = useSettings();
  return (
    <footer className="site-footer">
      <div className="wrap">
        <p>{t("footer_ind")}</p>
      </div>
    </footer>
  );
}
