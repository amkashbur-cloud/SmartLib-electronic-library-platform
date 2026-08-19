export function BarChart({ data, height = 180 }: { data: { label: string; value: number }[]; height?: number }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  const barWidth = 100 / data.length;

  return (
    <div>
      <svg viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" className="w-full" style={{ height }}>
        {data.map((d, i) => {
          const barHeight = (d.value / max) * (height - 24);
          const x = i * barWidth + barWidth * 0.2;
          const w = barWidth * 0.6;
          return (
            <g key={d.label}>
              <rect x={x} y={height - 24 - barHeight} width={w} height={barHeight} rx={1} fill="var(--color-brand)" />
              <text x={x + w / 2} y={height - 24 - barHeight - 4} textAnchor="middle" fontSize="6" fill="var(--color-muted)">
                {d.value > 0 ? d.value : ""}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="mt-1 flex text-[10px] text-muted">
        {data.map((d) => (
          <div key={d.label} style={{ width: `${barWidth}%` }} className="text-center">
            {d.label}
          </div>
        ))}
      </div>
    </div>
  );
}

export function HorizontalBars({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div className="space-y-2.5">
      {data.map((d) => (
        <div key={d.label}>
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="truncate text-foreground">{d.label}</span>
            <span className="shrink-0 text-muted">{d.value}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-brand" style={{ width: `${(d.value / max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
