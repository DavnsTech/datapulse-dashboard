import { Menu, RefreshCw, LogOut } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import type { TimeRange } from "../layouts/DashboardLayout";

const TIME_RANGES: TimeRange[] = ["1h", "6h", "24h", "7d", "30d"];

interface TopBarProps {
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
  autoRefresh: boolean;
  onAutoRefreshToggle: () => void;
  onMenuToggle: () => void;
}

export default function TopBar({
  timeRange,
  onTimeRangeChange,
  autoRefresh,
  onAutoRefreshToggle,
  onMenuToggle,
}: TopBarProps) {
  const { logout } = useAuth();

  return (
    <header className="h-16 flex items-center justify-between px-6"
      style={{ background: "var(--surface-1)", borderBottom: "1px solid var(--border)" }}
    >
      <button onClick={onMenuToggle}
        className="lg:hidden p-2 rounded-lg transition-colors hover:bg-white/5"
        style={{ color: "var(--text-muted)" }}
      >
        <Menu size={20} />
      </button>

      {/* Time range selector — pill style */}
      <div className="flex items-center gap-1 p-1 rounded-xl"
        style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
      >
        {TIME_RANGES.map((range) => (
          <button
            key={range}
            onClick={() => onTimeRangeChange(range)}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200"
            style={{
              color: timeRange === range ? "#fff" : "var(--text-muted)",
              background: timeRange === range
                ? "linear-gradient(135deg, #00d4ff, #0091ff)"
                : "transparent",
              boxShadow: timeRange === range
                ? "0 2px 8px rgba(0, 212, 255, 0.25)"
                : undefined,
            }}
          >
            {range}
          </button>
        ))}
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={onAutoRefreshToggle}
          className="p-2.5 rounded-xl transition-all duration-200"
          style={{
            color: autoRefresh ? "var(--accent)" : "var(--text-muted)",
            background: autoRefresh ? "var(--accent-dim)" : "transparent",
            border: autoRefresh ? "1px solid rgba(0, 212, 255, 0.15)" : "1px solid transparent",
          }}
          title={autoRefresh ? "Auto-refresh on" : "Auto-refresh off"}
        >
          <RefreshCw size={15} className={autoRefresh ? "animate-[spin_3s_linear_infinite]" : ""} />
        </button>
        <div className="w-px h-6 mx-1" style={{ background: "var(--border)" }} />
        <button
          onClick={logout}
          className="p-2.5 rounded-xl transition-colors hover:bg-white/5"
          style={{ color: "var(--text-muted)" }}
          title="Logout"
        >
          <LogOut size={15} />
        </button>
      </div>
    </header>
  );
}
