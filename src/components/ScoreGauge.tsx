import { scoreBand } from "@/lib/format";

// Gauge semicircular del score crediticio híbrido (visible al prestamista).
export function ScoreGauge({ score, size = 160 }: { score: number; size?: number }) {
  const band = scoreBand(score);
  const r = size / 2 - 12;
  const cx = size / 2;
  const cy = size / 2;
  const circ = Math.PI * r; // medio círculo
  const dash = circ * band.pct;

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size / 2 + 16} viewBox={`0 0 ${size} ${size / 2 + 16}`}>
        <path
          d={`M 12 ${cy} A ${r} ${r} 0 0 1 ${size - 12} ${cy}`}
          fill="none"
          stroke="var(--color-gray-100)"
          strokeWidth={12}
          strokeLinecap="round"
        />
        <path
          d={`M 12 ${cy} A ${r} ${r} 0 0 1 ${size - 12} ${cy}`}
          fill="none"
          stroke={band.color}
          strokeWidth={12}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
        />
        <text
          x={cx}
          y={cy - 6}
          textAnchor="middle"
          className="font-mono"
          style={{ fontSize: size * 0.2, fontWeight: 700, fill: "var(--color-ink)" }}
        >
          {score}
        </text>
      </svg>
      <span
        className="chip -mt-2"
        style={{ background: "var(--color-primary-soft)", color: band.color }}
      >
        {band.label}
      </span>
    </div>
  );
}
