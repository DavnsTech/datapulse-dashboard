import { AlertTriangle } from "lucide-react";
import type { AlertEvent } from "../api/alerts";

interface AlertEventListProps {
  events: AlertEvent[];
}

function formatTimestamp(timestamp: string): string {
  return new Date(timestamp).toLocaleString();
}

export default function AlertEventList({ events }: AlertEventListProps) {
  if (events.length === 0) {
    return (
      <div className="card p-10 text-center">
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          No alert events yet
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 animate-stagger">
      {events.map((event, index) => (
        <div
          key={`${event.ruleId}-${index}`}
          className="card flex items-center justify-between px-5 py-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(255, 77, 106, 0.1)" }}
            >
              <AlertTriangle size={16} style={{ color: "var(--danger)" }} />
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: "var(--danger)" }}>
                {event.ruleName}
              </p>
              <p className="text-xs font-mono mt-0.5" style={{ color: "var(--text-muted)" }}>
                {event.measurement}.{event.field}: {event.value.toFixed(2)} {event.condition} {event.threshold}
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono flex-shrink-0"
            style={{ color: "var(--text-muted)" }}
          >
            {formatTimestamp(event.firedAt)}
          </span>
        </div>
      ))}
    </div>
  );
}
