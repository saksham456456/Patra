"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { dict, type Key, type Lang } from "@/lib/i18n";

type Size = "base" | "lg" | "xl";
type Theme = "system" | "light" | "dark" | "hc";
interface Ctx { lang: Lang; setLang(l: Lang): void; size: Size; setSize(s: Size): void; theme: Theme; setTheme(t: Theme): void; t(k: Key): string }
const SettingsCtx = createContext<Ctx | null>(null);

const read = (k: string) => { try { return localStorage.getItem(k); } catch { return null; } };
const write = (k: string, v: string) => { try { localStorage.setItem(k, v); } catch { /* storage can be unavailable */ } };

export function Providers({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const [size, setSizeState] = useState<Size>("base");
  const [theme, setThemeState] = useState<Theme>("system");

  useEffect(() => {
    const l = read("patra.lang"); if (l === "en" || l === "hi") setLangState(l);
    const s = read("patra.size"); if (s === "base" || s === "lg" || s === "xl") setSizeState(s);
    const th = read("patra.theme"); if (th === "system" || th === "light" || th === "dark" || th === "hc") setThemeState(th);
  }, []);
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  useEffect(() => { document.documentElement.dataset.size = size; }, [size]);
  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);

  const setLang = useCallback((l: Lang) => { setLangState(l); write("patra.lang", l); }, []);
  const setSize = useCallback((s: Size) => { setSizeState(s); write("patra.size", s); }, []);
  const setTheme = useCallback((th: Theme) => { setThemeState(th); write("patra.theme", th); }, []);
  const t = useCallback((k: Key) => dict[lang][k], [lang]);

  const value = useMemo(() => ({ lang, setLang, size, setSize, theme, setTheme, t }), [lang, setLang, size, setSize, theme, setTheme, t]);
  return <SettingsCtx.Provider value={value}>{children}</SettingsCtx.Provider>;
}

export function useSettings() {
  const c = useContext(SettingsCtx);
  if (!c) throw new Error("useSettings outside Providers");
  return c;
}
