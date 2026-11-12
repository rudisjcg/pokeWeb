import { MAX_BASE_STAT, statPercent } from "@/lib/stats";

type Props = { label: string; value: number };

/** One base stat: name, number and a bar drawn against the highest possible stat. */
export default function StatBar({ label, value }: Props) {
  return (
    <div className="grid grid-cols-[minmax(0,9.5rem)_2.5rem_1fr] items-center gap-3" data-testid="stat-bar">
      <span className="text-muted text-[14px]">{label}</span>
      <span className="font-display font-semibold text-right tabular-nums">{value}</span>
      <div
        role="meter"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={MAX_BASE_STAT}
        aria-valuenow={value}
        className="h-2.5 bg-ink-700 -skew-x-12 overflow-hidden"
      >
        <div className="stat-fill h-full bg-type" style={{ width: `${statPercent(value)}%` }} />
      </div>
    </div>
  );
}
