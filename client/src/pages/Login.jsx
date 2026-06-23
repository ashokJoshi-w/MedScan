import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { API_BASE } from "../config";

export default function Login({ onSwitch }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      login(data.user, data.token);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const msg = err.message === "Failed to fetch"
        ? "Cannot reach server. Run `npm run dev:server` from the project root."
        : err.message;
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-slate-950 px-4"
      style={{
        backgroundImage: "radial-gradient(circle, rgba(0,201,177,0.06) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }}
    >
      <div className="w-full max-w-4xl flex rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">

        {/* ── Brand Panel ── */}
        <div className="hidden md:flex flex-col justify-center w-1/2 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-12 border-r border-slate-800 relative overflow-hidden">
          <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-400 to-transparent opacity-50 top-1/3" />

          <div className="mb-6">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <rect x="4" y="4" width="40" height="40" rx="8" stroke="#2DD4BF" strokeWidth="2" />
              <path d="M14 24h4l3-8 4 16 3-10 3 6 3-4h4" stroke="#2DD4BF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">MedScan</h1>
          <p className="text-slate-400 text-sm leading-relaxed mb-10 max-w-xs">
            AI-powered medical imaging analysis for faster, more confident diagnoses.
          </p>

          <div className="flex items-center gap-6">
            <div>
              <p className="text-2xl font-bold text-teal-400">98.4%</p>
              <p className="text-xs text-slate-500 uppercase tracking-widest mt-0.5">Accuracy</p>
            </div>
            <div className="w-px h-8 bg-slate-700" />
            <div>
              <p className="text-2xl font-bold text-teal-400">2.3s</p>
              <p className="text-xs text-slate-500 uppercase tracking-widest mt-0.5">Avg scan</p>
            </div>
            <div className="w-px h-8 bg-slate-700" />
            <div>
              <p className="text-2xl font-bold text-teal-400">50K+</p>
              <p className="text-xs text-slate-500 uppercase tracking-widest mt-0.5">Scans</p>
            </div>
          </div>
        </div>

        {/* ── Form Panel ── */}
        <div className="w-full md:w-1/2 bg-slate-900 p-10 flex items-center justify-center">
          <div className="w-full max-w-sm">
            <h2 className="text-2xl font-bold text-white mb-1">Welcome back</h2>
            <p className="text-slate-400 text-sm mb-8">Sign in to your MedScan account</p>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Email address
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="doctor@hospital.com"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition"
                />
              </div>

              <div>
                <label className="flex justify-between text-xs font-medium text-slate-400 mb-1.5">
                  Password
                  <a href="#" className="text-teal-400 hover:underline">Forgot password?</a>
                </label>
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-teal-500 hover:bg-teal-400 disabled:opacity-60 disabled:cursor-not-allowed text-slate-950 font-semibold py-2.5 rounded-lg text-sm transition flex items-center justify-center mt-2"
              >
                {loading ? (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                ) : "Sign in"}
              </button>
            </form>

            <p className="text-center text-slate-500 text-xs mt-6">
              Don't have an account?{" "}
              <button onClick={onSwitch} className="text-teal-400 hover:underline">
                Create account
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
