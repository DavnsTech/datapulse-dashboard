import { useEffect, useState } from "react";
import TimeSeriesChart from "./TimeSeriesChart";
import { fetchTimeSeries, type TimeSeriesPoint } from "../api/metrics";

interface ChartPanelProps {
  title: string;
  measurement: string;
  field: string;
  chartType: string;
  timeRange: string;
  color?: string;
}

const CHART_COLORS: Record<string, string> = {
  cpu: "#00d4ff",
  mem: "#ffb020",
  disk: "#00e68a",
  net: "#6366f1",
  business_metrics: "#ff4d6a",
  http_response: "#a78bfa",
};

export default function ChartPanel({
  title,
  measurement,
  field,
  chartType,
  timeRange,
  color,
}: ChartPanelProps) {
  const [data, setData] = useState<TimeSeriesPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetchTimeSeries(measurement, field, timeRange)
      .then((response) => {
        if (!cancelled) setData(response.points);
      })
      .catch((error) => {
        console.error(`Failed to fetch ${measurement}.${field}:`, error);
        if (!cancelled) setData([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [measurement, field, timeRange]);

  const chartColor = color ?? CHART_COLORS[measurement] ?? "#00d4ff";

  return (
    <div className="card p-5 group">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[13px] font-bold uppercase tracking-[0.08em]"
          style={{ color: "var(--text-secondary)" }}
        >
          {title}
        </h3>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ background: chartColor }} />
          <span className="text-[10px] font-mono font-medium"
            style={{ color: "var(--text-muted)" }}
          >
            {measurement}
          </span>
        </div>
      </div>
      <div className="h-56">
        {loading ? (
          <div className="skeleton w-full h-full" />
        ) : data.length === 0 ? (
          <div className="flex items-center justify-center h-full text-sm"
            style={{ color: "var(--text-muted)" }}
          >
            No data available
          </div>
        ) : (
          <TimeSeriesChart data={data} chartType={chartType} color={chartColor} />
        )}
      </div>
    </div>
  );
}
