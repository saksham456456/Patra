export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <svg width={size * 1.6} height={size} viewBox="0 0 160 100" role="img" aria-label="Patra" className="logo-mark">
      <g fill="none" stroke="var(--stamp)" strokeWidth="4" strokeLinecap="round">
        <circle cx="50" cy="50" r="40" />
        <circle cx="50" cy="50" r="32" strokeWidth="2" />
        <path d="M96 38 q6 -6 12 0 t12 0 t12 0 t12 0" />
        <path d="M96 50 q6 -6 12 0 t12 0 t12 0 t12 0" />
        <path d="M96 62 q6 -6 12 0 t12 0 t12 0 t12 0" />
      </g>
      <text x="50" y="66" textAnchor="middle" fontFamily="var(--font-deva-serif)" fontSize="44" fontWeight="700" fill="var(--ink)">प</text>
    </svg>
  );
}
