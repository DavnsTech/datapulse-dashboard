import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import { useState } from "react";

export type TimeRange = "1h" | "6h" | "24h" | "7d" | "30d";

export default function DashboardLayout() {
  const [timeRange, setTimeRange] = useState<TimeRange>("1h");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--surface-0)" }}>
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <TopBar
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
          autoRefresh={autoRefresh}
          onAutoRefreshToggle={() => setAutoRefresh(!autoRefresh)}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        />
        <main className="flex-1 overflow-auto p-8" style={{ background: "var(--surface-0)" }}>
          <Outlet context={{ timeRange, autoRefresh }} />
        </main>
      </div>
    </div>
  );
}
