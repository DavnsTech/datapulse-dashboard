import { NavLink } from "react-router-dom";
import { LayoutDashboard, Search, Bell, X, Activity } from "lucide-react";

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
}

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/explore", icon: Search, label: "Explore" },
  { to: "/alerts", icon: Bell, label: "Alerts" },
];

export default function Sidebar({ open, onToggle }: SidebarProps) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-20 lg:hidden"
          style={{ background: "rgba(6, 8, 13, 0.8)", backdropFilter: "blur(4px)" }}
          onClick={onToggle}
        />
      )}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-30
          flex flex-col transition-all duration-300 ease-out
          ${open ? "w-64 translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-[72px]"}
        `}
        style={{ background: "var(--surface-1)", borderRight: "1px solid var(--border)" }}
      >
        {/* Logo area */}
        <div className="flex items-center h-16 px-5"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #00d4ff, #0091ff)" }}
            >
              <Activity size={18} className="text-white" />
            </div>
            {open && (
              <span className="text-base font-bold tracking-tight truncate"
                style={{ color: "var(--text-primary)" }}
              >
                DataPulse
              </span>
            )}
          </div>
          {open && (
            <button onClick={onToggle} className="ml-auto lg:hidden p-1 rounded-lg transition-colors hover:bg-white/5"
              style={{ color: "var(--text-muted)" }}
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          <p className={`text-[10px] font-bold uppercase tracking-[0.15em] mb-3 ${open ? "px-3" : "text-center"}`}
            style={{ color: "var(--text-muted)" }}
          >
            {open ? "Menu" : ""}
          </p>
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200 ${
                  open ? "px-3" : "justify-center px-0"
                } ${
                  isActive
                    ? ""
                    : "hover:bg-white/[0.03]"
                }`
              }
              style={({ isActive }) => ({
                color: isActive ? "var(--accent)" : "var(--text-secondary)",
                background: isActive ? "var(--accent-dim)" : undefined,
                boxShadow: isActive ? "inset 0 0 0 1px rgba(0, 212, 255, 0.15)" : undefined,
              })}
            >
              <Icon size={20} strokeWidth={1.8} />
              {open && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Bottom branding */}
        {open && (
          <div className="px-5 py-4" style={{ borderTop: "1px solid var(--border)" }}>
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em]"
              style={{ color: "var(--text-muted)" }}
            >
              Business Intelligence
            </p>
          </div>
        )}
      </aside>
    </>
  );
}
