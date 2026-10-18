import type { ExplainResult } from "@/lib/ai/schema";

type Level = ExplainResult["urgency"];
const COLOR: Record<Level, string> = { ignore: "var(--leaf)", soon: "var(--amber)", urgent: "var(--stamp)", legal_deadline: "var(--stamp)" };

/** The postmark. Level is conveyed by text and ring style as well as colour. */
export function Stamp({ level, label, animate = false }: { level: Level; label: string; animate?: boolean }) {
  const c = COLOR[level];
  const double = level === "legal_deadline";
  return (
    <svg viewBox="0 0 180 180" width="150" height="150" role="img" aria-label={label} className={animate ? "stamp stamp-in" : "stamp"}>
      <g fill="none" stroke={c} strokeLinecap="round">
        <circle cx="90" cy="90" r="82" strokeWidth="5" />
        {double && <circle cx="90" cy="90" r="74" strokeWidth="2" />}
        <circle cx="90" cy="90" r={double ? 66 : 70} strokeWidth="2" strokeDasharray={level === "ignore" ? "0" : "3 6"} />
      </g>
      <text x="90" y="98" textAnchor="middle" fontFamily="var(--font-display)" fontWeight="700" fontSize={label.length > 10 ? 19 : 26} fill={c}>
        {label}
      </text>
      <g fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" opacity="0.8">
        <path d="M44 122 q8 -7 16 0 t16 0 t16 0 t16 0" />
      </g>
    </svg>
  );
}
