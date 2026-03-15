import { useState } from "react";
import { Plus, Check } from "lucide-react";
import QueryBuilder from "../components/QueryBuilder";
import TimeSeriesChart from "../components/TimeSeriesChart";
import {
  fetchTimeSeries,
  fetchDashboard,
  updateDashboard,
  type TimeSeriesPoint,
  type PanelConfig,
} from "../api/metrics";

interface QueryResult {
  measurement: string;
  field: string;
  aggregation: string;
  points: TimeSeriesPoint[];
}

export default function ExplorePage() {
  const [results, setResults] = useState<QueryResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [addedFields, setAddedFields] = useState<Set<string>>(new Set());

  async function handleRunQuery(
    measurement: string,
    fields: string[],
    range: string,
    aggregation: string
  ) {
    setLoading(true);
    setAddedFields(new Set());
    try {
      const responses = await Promise.all(
        fields.map((field) => fetchTimeSeries(measurement, field, range, aggregation))
      );
      setResults(
        responses.map((response, index) => ({
          measurement,
          field: fields[index],
          aggregation,
          points: response.points,
        }))
      );
    } catch (error) {
      console.error("Query failed:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddToDashboard(result: QueryResult) {
    try {
      const dashboard = await fetchDashboard("default");
      const panelId = `p${Date.now()}`;
      const panelCount = dashboard.panels.length;
      const newPanel: PanelConfig = {
        id: panelId,
        title: `${result.measurement}.${result.field}`,
        chartType: "area",
        measurement: result.measurement,
        field: result.field,
        aggregation: result.aggregation,
        grid: {
          x: (panelCount % 2) * 6,
          y: Math.floor(panelCount / 2) * 4,
          width: 6,
          height: 4,
        },
      };
      await updateDashboard("default", {
        ...dashboard,
        panels: [...dashboard.panels, newPanel],
      });
      setAddedFields((prev) => new Set(prev).add(result.field));
    } catch (error) {
      console.error("Failed to add panel:", error);
    }
  }

  return (
    <div className="space-y-8 max-w-[1440px]">
      {/* Page header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl font-extrabold tracking-tight"
          style={{ color: "var(--text-primary)" }}
        >
          Explore
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          Query and visualize any metric in your data
        </p>
      </div>

      <QueryBuilder onRunQuery={handleRunQuery} />

      {loading && (
        <div className="space-y-5">
          <div className="card p-5"><div className="skeleton h-64 w-full" /></div>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="space-y-5 animate-stagger">
          {results.map((result) => (
            <div key={result.field} className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-[13px] font-bold uppercase tracking-[0.08em]"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {result.field}
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md"
                    style={{ background: "var(--surface-3)", color: "var(--text-muted)" }}
                  >
                    {result.measurement}
                  </span>
                </div>
                <button
                  onClick={() => handleAddToDashboard(result)}
                  disabled={addedFields.has(result.field)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all duration-200 disabled:opacity-50"
                  style={{
                    background: addedFields.has(result.field) ? "rgba(0, 230, 138, 0.1)" : "var(--accent-dim)",
                    color: addedFields.has(result.field) ? "var(--success)" : "var(--accent)",
                    border: `1px solid ${addedFields.has(result.field) ? "rgba(0, 230, 138, 0.2)" : "rgba(0, 212, 255, 0.15)"}`,
                  }}
                >
                  {addedFields.has(result.field) ? <Check size={13} /> : <Plus size={13} />}
                  {addedFields.has(result.field) ? "Added" : "Add to dashboard"}
                </button>
              </div>
              <div className="h-72">
                {result.points.length > 0 ? (
                  <TimeSeriesChart data={result.points} chartType="area" />
                ) : (
                  <div className="flex items-center justify-center h-full text-sm"
                    style={{ color: "var(--text-muted)" }}
                  >
                    No data
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
