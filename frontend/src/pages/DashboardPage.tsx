import { useEffect, useState, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import KpiCard from "../components/KpiCard";
import ChartPanel from "../components/ChartPanel";
import {
  fetchSummary,
  fetchTimeSeries,
  fetchDashboard,
  type MetricSummary,
  type TimeSeriesPoint,
  type DashboardConfig,
} from "../api/metrics";
import type { TimeRange } from "../layouts/DashboardLayout";

interface LayoutContext {
  timeRange: TimeRange;
  autoRefresh: boolean;
}

const KPI_CONFIGS = [
  { measurement: "cpu", field: "usage_idle", title: "CPU Usage", unit: "%", color: "#00d4ff", invert: true },
  { measurement: "mem", field: "used_percent", title: "Memory", unit: "%", color: "#ffb020", invert: false },
  { measurement: "disk", field: "used_percent", title: "Disk", unit: "%", color: "#00e68a", invert: false },
  { measurement: "net", field: "bytes_recv", title: "Network In", unit: "B/s", color: "#6366f1", invert: false },
];

export default function DashboardPage() {
  const { timeRange, autoRefresh } = useOutletContext<LayoutContext>();
  const [summaries, setSummaries] = useState<MetricSummary[]>([]);
  const [sparklines, setSparklines] = useState<Record<string, TimeSeriesPoint[]>>({});
  const [dashboard, setDashboard] = useState<DashboardConfig | null>(null);

  const loadData = useCallback(async () => {
    try {
      const [summaryData, dashboardData] = await Promise.all([
        fetchSummary(),
        fetchDashboard("default"),
      ]);
      setSummaries(summaryData);
      setDashboard(dashboardData);

      const sparklineResults = await Promise.all(
        KPI_CONFIGS.map((kpi) => fetchTimeSeries(kpi.measurement, kpi.field, timeRange))
      );
      const sparklineMap: Record<string, TimeSeriesPoint[]> = {};
      sparklineResults.forEach((result, index) => {
        sparklineMap[KPI_CONFIGS[index].measurement] = result.points;
      });
      setSparklines(sparklineMap);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    }
  }, [timeRange]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, [autoRefresh, loadData]);

  function formatKpiValue(summary: MetricSummary | undefined, invert: boolean): string {
    if (!summary) return "—";
    const value = invert ? 100 - summary.lastValue : summary.lastValue;
    return value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value.toFixed(1);
  }

  function computeDelta(summary: MetricSummary | undefined): number | undefined {
    if (!summary || summary.meanValue === 0) return undefined;
    return ((summary.lastValue - summary.meanValue) / summary.meanValue) * 100;
  }

  return (
    <div className="space-y-8 max-w-[1440px]">
      {/* Page header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl font-extrabold tracking-tight"
          style={{ color: "var(--text-primary)" }}
        >
          Dashboard
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          Real-time system and business metrics
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 animate-stagger">
        {KPI_CONFIGS.map((kpi) => {
          const summary = summaries.find(
            (s) => s.measurement === kpi.measurement && s.field === kpi.field
          );
          return (
            <KpiCard
              key={kpi.measurement}
              title={kpi.title}
              value={formatKpiValue(summary, kpi.invert)}
              unit={kpi.unit}
              trend={sparklines[kpi.measurement] ?? []}
              color={kpi.color}
              delta={computeDelta(summary)}
            />
          );
        })}
      </div>

      {/* Chart Grid */}
      {dashboard && (
        <>
          <div className="flex items-center gap-4">
            <h2 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
              Panels
            </h2>
            <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
            <span className="text-xs font-mono font-medium"
              style={{ color: "var(--text-muted)" }}
            >
              {dashboard.panels.length} panels
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 animate-stagger">
            {dashboard.panels.map((panel) => (
              <ChartPanel
                key={panel.id}
                title={panel.title}
                measurement={panel.measurement}
                field={panel.field}
                chartType={panel.chartType}
                timeRange={timeRange}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
