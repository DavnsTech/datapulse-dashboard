import { useState } from "react";
import type { AlertRule } from "../api/alerts";

interface AlertRuleFormProps {
  onSubmit: (rule: Omit<AlertRule, "id">) => void;
  onCancel: () => void;
}

const CONDITIONS = [">", "<", ">=", "<=", "="];

export default function AlertRuleForm({ onSubmit, onCancel }: AlertRuleFormProps) {
  const [name, setName] = useState("");
  const [measurement, setMeasurement] = useState("");
  const [field, setField] = useState("");
  const [condition, setCondition] = useState(">");
  const [threshold, setThreshold] = useState(0);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    onSubmit({ name, measurement, field, condition, threshold, enabled: true });
  }

  const inputStyle = {
    background: "var(--surface-2)",
    border: "1px solid var(--border)",
    color: "var(--text-primary)",
  };

  return (
    <form onSubmit={handleSubmit} className="card p-6 space-y-5 animate-fade-in">
      <h3 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
        New Alert Rule
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-[0.12em] mb-2"
            style={{ color: "var(--text-muted)" }}
          >
            Name
          </label>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl text-sm font-medium"
            style={inputStyle}
            placeholder="CPU High"
            required
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-[0.12em] mb-2"
            style={{ color: "var(--text-muted)" }}
          >
            Measurement
          </label>
          <input
            value={measurement}
            onChange={(event) => setMeasurement(event.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl text-sm font-medium"
            style={inputStyle}
            placeholder="cpu"
            required
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-[0.12em] mb-2"
            style={{ color: "var(--text-muted)" }}
          >
            Field
          </label>
          <input
            value={field}
            onChange={(event) => setField(event.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl text-sm font-medium"
            style={inputStyle}
            placeholder="usage_idle"
            required
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-[0.12em] mb-2"
            style={{ color: "var(--text-muted)" }}
          >
            Condition
          </label>
          <select
            value={condition}
            onChange={(event) => setCondition(event.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl text-sm font-mono font-medium"
            style={inputStyle}
          >
            {CONDITIONS.map((cond) => (
              <option key={cond} value={cond}>{cond}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-[0.12em] mb-2"
            style={{ color: "var(--text-muted)" }}
          >
            Threshold
          </label>
          <input
            type="number"
            step="any"
            value={threshold}
            onChange={(event) => setThreshold(Number(event.target.value))}
            className="w-full px-3.5 py-2.5 rounded-xl text-sm font-mono font-medium"
            style={inputStyle}
            required
          />
        </div>
      </div>
      <div className="flex gap-3">
        <button type="submit" className="btn-accent px-5 py-2.5 text-sm">
          Create rule
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 text-sm font-semibold rounded-xl transition-colors"
          style={{
            background: "var(--surface-3)",
            color: "var(--text-secondary)",
            border: "1px solid var(--border)",
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
