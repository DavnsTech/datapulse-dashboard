import { useEffect, useState, useCallback } from "react";
import AlertRuleForm from "../components/AlertRuleForm";
import AlertEventList from "../components/AlertEventList";
import {
  fetchAlertRules,
  fetchAlertEvents,
  createAlertRule,
  deleteAlertRule,
  type AlertRule,
  type AlertEvent,
} from "../api/alerts";
import { Trash2, Plus, ShieldCheck } from "lucide-react";

export default function AlertsPage() {
  const [rules, setRules] = useState<AlertRule[]>([]);
  const [events, setEvents] = useState<AlertEvent[]>([]);
  const [showForm, setShowForm] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [rulesData, eventsData] = await Promise.all([
        fetchAlertRules(),
        fetchAlertEvents(),
      ]);
      setRules(rulesData);
      setEvents(eventsData);
    } catch (error) {
      console.error("Failed to load alerts:", error);
    }
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, [loadData]);

  async function handleCreateRule(rule: Omit<AlertRule, "id">) {
    await createAlertRule(rule);
    setShowForm(false);
    loadData();
  }

  async function handleDeleteRule(id: string) {
    await deleteAlertRule(id);
    loadData();
  }

  return (
    <div className="space-y-8 max-w-[1440px]">
      {/* Page header */}
      <div className="flex items-start justify-between animate-fade-in">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            Alerts
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            Configure threshold rules and monitor events
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-accent flex items-center gap-2 px-5 py-2.5 text-sm"
        >
          <Plus size={16} />
          New Rule
        </button>
      </div>

      {showForm && (
        <AlertRuleForm onSubmit={handleCreateRule} onCancel={() => setShowForm(false)} />
      )}

      {/* Rules section */}
      <div>
        <div className="flex items-center gap-4 mb-4">
          <h2 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
            Rules
          </h2>
          <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
          <span className="text-xs font-mono font-medium"
            style={{ color: "var(--text-muted)" }}
          >
            {rules.length} configured
          </span>
        </div>

        {rules.length === 0 ? (
          <div className="card p-10 text-center">
            <ShieldCheck size={32} className="mx-auto mb-3" style={{ color: "var(--text-muted)" }} />
            <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
              No alert rules configured
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              Create a rule to start monitoring
            </p>
          </div>
        ) : (
          <div className="space-y-2 animate-stagger">
            {rules.map((rule) => (
              <div key={rule.id} className="card flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: rule.enabled ? "rgba(0, 230, 138, 0.08)" : "var(--surface-3)",
                    }}
                  >
                    <div className={`status-dot ${rule.enabled ? "active" : ""}`}
                      style={{ background: rule.enabled ? undefined : "var(--text-muted)" }}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                      {rule.name}
                    </p>
                    <p className="text-xs font-mono mt-0.5" style={{ color: "var(--text-muted)" }}>
                      {rule.measurement}.{rule.field} {rule.condition} {rule.threshold}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg"
                    style={{
                      background: rule.enabled ? "rgba(0, 230, 138, 0.1)" : "var(--surface-3)",
                      color: rule.enabled ? "var(--success)" : "var(--text-muted)",
                      border: `1px solid ${rule.enabled ? "rgba(0, 230, 138, 0.2)" : "var(--border)"}`,
                    }}
                  >
                    {rule.enabled ? "Active" : "Disabled"}
                  </span>
                  <button
                    onClick={() => handleDeleteRule(rule.id)}
                    className="p-2 rounded-lg transition-colors hover:bg-white/5"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Events section */}
      <div>
        <div className="flex items-center gap-4 mb-4">
          <h2 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
            Recent Events
          </h2>
          <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
          <span className="text-xs font-mono font-medium"
            style={{ color: "var(--text-muted)" }}
          >
            {events.length} events
          </span>
        </div>
        <AlertEventList events={events} />
      </div>
    </div>
  );
}
