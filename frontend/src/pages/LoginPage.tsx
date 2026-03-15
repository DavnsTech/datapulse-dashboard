import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Activity } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(username, password);
      navigate("/", { replace: true });
    } catch {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "var(--surface-0)" }}
    >
      {/* Ambient glow */}
      <div className="absolute top-[-30%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-[0.07]"
        style={{ background: "radial-gradient(circle, #00d4ff, transparent 70%)" }}
      />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full opacity-[0.05]"
        style={{ background: "radial-gradient(circle, #0091ff, transparent 70%)" }}
      />

      <div className="w-full max-w-[420px] px-6 relative z-10 animate-fade-in">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #00d4ff, #0091ff)" }}
          >
            <Activity size={22} className="text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
            DataPulse
          </span>
        </div>

        {/* Card */}
        <div className="card p-8">
          <div className="mb-6">
            <h1 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
              Welcome back
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
              Sign in to your dashboard
            </p>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl text-sm font-medium"
              style={{ background: "rgba(255, 77, 106, 0.1)", color: "var(--danger)", border: "1px solid rgba(255, 77, 106, 0.2)" }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2"
                style={{ color: "var(--text-muted)" }}
              >
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: "var(--surface-2)",
                  border: "1px solid var(--border)",
                  color: "var(--text-primary)",
                }}
                placeholder="Enter username"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2"
                style={{ color: "var(--text-muted)" }}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: "var(--surface-2)",
                  border: "1px solid var(--border)",
                  color: "var(--text-primary)",
                }}
                placeholder="Enter password"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-accent w-full py-3.5 text-sm rounded-xl disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: "var(--text-muted)" }}>
          DataPulse v0.1 &middot; DavnsTech
        </p>
      </div>
    </div>
  );
}
