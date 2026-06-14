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
      <svg width={size} height={size / 2 + 18} viewBox={`0 0 ${size} ${size / 2 + 18}`}>
        <path
          d={`M 12 ${cy} A ${r} ${r} 0 0 1 ${size - 12} ${cy}`}
          fill="none"
          stroke="var(--color-line)"
          strokeWidth={9}
          strokeLinecap="round"
        />
        <path
          d={`M 12 ${cy} A ${r} ${r} 0 0 1 ${size - 12} ${cy}`}
          fill="none"
          stroke={band.color}
          strokeWidth={9}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          style={{ transition: "stroke-dasharray 0.8s cubic-bezier(0.22,1,0.36,1)" }}
        />
        <text
          x={cx}
          y={cy - 4}
          textAnchor="middle"
          className="font-display tabular"
          style={{ fontSize: size * 0.21, fontWeight: 600, fill: "var(--color-ink)" }}
        >
          {score}
        </text>
        <text
          x={cx}
          y={cy + 13}
          textAnchor="middle"
          className="font-grotesk"
          style={{ fontSize: size * 0.075, letterSpacing: "0.1em", fill: "var(--color-faint)" }}
        >
          300–850
        </text>
      </svg>
      <span
        className="chip -mt-1"
        style={{
          background: `color-mix(in srgb, ${band.color} 16%, white)`,
          color: `color-mix(in srgb, ${band.color} 72%, black)`,
        }}
      >
        {band.label}
      </span>
    </div>
  );
}
