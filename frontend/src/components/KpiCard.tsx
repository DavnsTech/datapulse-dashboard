import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { TimeSeriesPoint } from "../api/metrics";

interface KpiCardProps {
  title: string;
  value: string;
  unit: string;
  trend: TimeSeriesPoint[];
  color: string;
  delta?: number;
}

export default function KpiCard({ title, value, unit, trend, color, delta }: KpiCardProps) {
  const gradientId = `kpi-${title.replace(/[^a-zA-Z0-9]/g, "-")}`;
  const chartData = trend.map((point) => ({
    time: point.timestamp,
    value: point.value,
  }));

  const isPositive = (delta ?? 0) >= 0;

  return (
    <div className="card p-6 group relative overflow-hidden">
      {/* Subtle top accent line */}
      <div className="absolute top-0 left-6 right-6 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${color}40, transparent)` }}
      />

      {/* Header row */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.12em]"
            style={{ color: "var(--text-muted)" }}
          >
            {title}
          </p>
        </div>
        {delta !== undefined && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold"
            style={{
              background: isPositive ? "rgba(0, 230, 138, 0.1)" : "rgba(255, 77, 106, 0.1)",
              color: isPositive ? "var(--success)" : "var(--danger)",
            }}
          >
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(delta).toFixed(1)}%
          </div>
        )}
      </div>

      {/* Big number */}
      <div className="flex items-baseline gap-2 mb-5">
        <span className="text-4xl font-extrabold tracking-tight font-mono"
          style={{ color: "var(--text-primary)" }}
        >
          {value}
        </span>
        <span className="text-sm font-semibold"
          style={{ color: "var(--text-muted)" }}
        >
          {unit}
        </span>
      </div>

      {/* Sparkline */}
      <div className="h-14 -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.25} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              fill={`url(#${gradientId})`}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
