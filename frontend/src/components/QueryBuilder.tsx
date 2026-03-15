import { useEffect, useState } from "react";
import { Play } from "lucide-react";
import { fetchMeasurements, fetchFields } from "../api/metrics";

interface QueryBuilderProps {
  onRunQuery: (measurement: string, fields: string[], range: string, aggregation: string) => void;
}

const RANGES = ["1h", "6h", "24h", "7d", "30d"];
const AGGREGATIONS = ["mean", "max", "min", "last", "count"];

export default function QueryBuilder({ onRunQuery }: QueryBuilderProps) {
  const [measurements, setMeasurements] = useState<string[]>([]);
  const [fields, setFields] = useState<string[]>([]);
  const [selectedMeasurement, setSelectedMeasurement] = useState("");
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [range, setRange] = useState("1h");
  const [aggregation, setAggregation] = useState("mean");

  useEffect(() => {
    fetchMeasurements()
      .then(setMeasurements)
      .catch((error) => {
        console.error("Failed to fetch measurements:", error);
        setMeasurements([]);
      });
  }, []);

  useEffect(() => {
    if (!selectedMeasurement) return;
    setSelectedFields([]);
    fetchFields(selectedMeasurement)
      .then(setFields)
      .catch((error) => {
        console.error("Failed to fetch fields:", error);
        setFields([]);
      });
  }, [selectedMeasurement]);

  function toggleField(field: string) {
    setSelectedFields((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );
  }

  function handleRun() {
    if (selectedMeasurement && selectedFields.length > 0) {
      onRunQuery(selectedMeasurement, selectedFields, range, aggregation);
    }
  }

  const inputStyle = {
    background: "var(--surface-2)",
    border: "1px solid var(--border)",
    color: "var(--text-primary)",
  };

  return (
    <div className="card p-6 space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-[0.12em] mb-2"
            style={{ color: "var(--text-muted)" }}
          >
            Measurement
          </label>
          <select
            value={selectedMeasurement}
            onChange={(event) => setSelectedMeasurement(event.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl text-sm font-medium"
            style={inputStyle}
          >
            <option value="">Select...</option>
            {measurements.map((measurement) => (
              <option key={measurement} value={measurement}>{measurement}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-[0.12em] mb-2"
            style={{ color: "var(--text-muted)" }}
          >
            Field(s)
          </label>
          <div className="flex flex-wrap gap-1.5 min-h-[42px] px-3 py-2 rounded-xl"
            style={inputStyle}
          >
            {fields.map((field) => (
              <button
                key={field}
                onClick={() => toggleField(field)}
                className="px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all duration-200"
                style={{
                  background: selectedFields.includes(field) ? "var(--accent)" : "var(--surface-3)",
                  color: selectedFields.includes(field) ? "#fff" : "var(--text-secondary)",
                  boxShadow: selectedFields.includes(field) ? "0 2px 8px rgba(0,212,255,0.25)" : undefined,
                }}
              >
                {field}
              </button>
            ))}
            {fields.length === 0 && (
              <span className="text-[11px] self-center" style={{ color: "var(--text-muted)" }}>
                Select measurement first
              </span>
            )}
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-[0.12em] mb-2"
            style={{ color: "var(--text-muted)" }}
          >
            Range
          </label>
          <select
            value={range}
            onChange={(event) => setRange(event.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl text-sm font-medium"
            style={inputStyle}
          >
            {RANGES.map((rangeOption) => (
              <option key={rangeOption} value={rangeOption}>{rangeOption}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-[0.12em] mb-2"
            style={{ color: "var(--text-muted)" }}
          >
            Aggregation
          </label>
          <select
            value={aggregation}
            onChange={(event) => setAggregation(event.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl text-sm font-medium"
            style={inputStyle}
          >
            {AGGREGATIONS.map((agg) => (
              <option key={agg} value={agg}>{agg}</option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={handleRun}
        disabled={!selectedMeasurement || selectedFields.length === 0}
        className="btn-accent flex items-center gap-2 px-5 py-2.5 text-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
      >
        <Play size={14} />
        Run query
      </button>
    </div>
  );
}
