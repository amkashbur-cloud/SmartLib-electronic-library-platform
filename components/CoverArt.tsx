function initials(title: string): string {
  const words = title.trim().split(/\s+/).filter(Boolean);
  const chars = words.slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "");
  return chars.join("") || "SL";
}

export function CoverArt({ title, color, className }: { title: string; color: string; className?: string }) {
  return (
    <svg viewBox="0 0 240 320" className={className} role="img" aria-label={`Cover for ${title}`}>
      <defs>
        <linearGradient id={`grad-${color.replace("#", "")}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor="#0f172a" stopOpacity="0.85" />
        </linearGradient>
      </defs>
      <rect width="240" height="320" rx="8" fill={`url(#grad-${color.replace("#", "")})`} />
      <rect x="10" y="10" width="220" height="300" rx="4" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
      <text x="120" y="175" textAnchor="middle" fontSize="56" fontWeight="700" fill="white" fontFamily="Arial, sans-serif">
        {initials(title)}
      </text>
      <line x1="24" y1="270" x2="216" y2="270" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
    </svg>
  );
}
