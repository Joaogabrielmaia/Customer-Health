import clsx from "clsx";
import { COLOR_LABEL, type HealthColor } from "@/lib/score/types";
import { signed } from "@/lib/format";

export const COLOR_HEX: Record<HealthColor, string> = { GREEN: "#15803d", YELLOW: "#d97706", RED: "#b91c1c" };

const badgeClass: Record<HealthColor, string> = {
  GREEN: "bg-green-100 text-green-900 ring-green-600/30",
  YELLOW: "bg-amber-100 text-amber-900 ring-amber-600/30",
  RED: "bg-red-100 text-red-900 ring-red-600/30",
};

export function ColorBadge({ color }: { color: HealthColor }) {
  return (
    <span className={clsx("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset", badgeClass[color])}>
      <span aria-hidden className="h-2 w-2 rounded-full" style={{ backgroundColor: COLOR_HEX[color] }} />
      {COLOR_LABEL[color]}
    </span>
  );
}

export function Delta({ value }: { value: number }) {
  if (Math.abs(value) < 0.5) return <span className="text-xs text-slate-500">estável</span>;
  return (
    <span className={clsx("text-xs font-semibold", value < 0 ? "text-red-700" : "text-green-700")}>
      {value < 0 ? "▼" : "▲"} {signed(value)}
    </span>
  );
}

export function Kpi({ label, value, hint, tone }: { label: string; value: string; hint?: string; tone?: "red" | "amber" | "green" }) {
  return (
    <div className="card">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">{label}</p>
      <p className={clsx("mt-1 text-2xl font-bold", tone === "red" && "text-red-700", tone === "amber" && "text-amber-700", tone === "green" && "text-green-700")}>{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-600">{hint}</p>}
    </div>
  );
}

export function ScoreDial({ score, color }: { score: number; color: HealthColor }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 120 120" className="h-32 w-32" role="img" aria-label={`Score ${score} de 100`}>
      <circle cx="60" cy="60" r={r} fill="none" stroke="#e2e8f0" strokeWidth="10" />
      <circle
        cx="60" cy="60" r={r} fill="none" stroke={COLOR_HEX[color]} strokeWidth="10" strokeLinecap="round"
        strokeDasharray={`${(score / 100) * c} ${c}`} transform="rotate(-90 60 60)"
      />
      <text x="60" y="64" textAnchor="middle" fontSize="28" fontWeight="700" fill="#0f172a">{Math.round(score)}</text>
      <text x="60" y="82" textAnchor="middle" fontSize="10" fill="#475569">de 100</text>
    </svg>
  );
}

export function Bar({ value, color = "#334155" }: { value: number; color?: string }) {
  return (
    <div className="h-2 w-full rounded-full bg-slate-200" aria-hidden>
      <div className="h-2 rounded-full" style={{ width: `${Math.max(0, Math.min(100, value))}%`, backgroundColor: color }} />
    </div>
  );
}
