import React, { useState, useRef } from "react";
import {
  LayoutDashboard, Users, ShieldCheck, Globe, Monitor,
  FileText, AlertTriangle, Settings, LogOut, Search,
  Bell, User, Lock, Eye, EyeOff, RefreshCw, Download,
  Activity, Key, AlertCircle, CheckCircle, Clock,
  Fingerprint, ChevronDown, X, Menu, Plus, Filter,
  Shield, Database, ShieldAlert, Wifi, Laptop,
  Smartphone, Mail, Info, Zap, Hash, Terminal,
  MoreVertical, ExternalLink, ChevronRight, UserCheck,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Page =
  | "dashboard"
  | "users"
  | "user-detail"
  | "roles"
  | "applications"
  | "sessions"
  | "audit-logs"
  | "security-events"
  | "settings"
  | "profile";

// ─── Shared primitives ────────────────────────────────────────────────────────

function Badge({
  variant,
  children,
}: {
  variant: "success" | "error" | "warning" | "info" | "muted" | "cyan";
  children: React.ReactNode;
}) {
  const cls = {
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    error: "bg-red-500/10 text-red-400 border-red-500/20",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    info: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    muted: "bg-white/5 text-muted-foreground border-white/10",
    cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  }[variant];
  return (
    <span
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono border ${cls}`}
    >
      {children}
    </span>
  );
}

function Toggle({
  enabled,
  onChange,
  disabled,
}: {
  enabled: boolean;
  onChange: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onChange}
      disabled={disabled}
      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${
        enabled ? "bg-blue-500" : "bg-white/10"
      } ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200 ${
          enabled ? "translate-x-[18px]" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center select-none">
      <div className="p-3.5 rounded-full bg-white/[0.03] border border-white/[0.06] mb-3">
        <Icon size={20} className="text-muted-foreground" />
      </div>
      <p className="text-xs font-medium text-secondary-foreground">{title}</p>
      {description && (
        <p className="text-[11px] text-muted-foreground mt-1 max-w-xs leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  accent?: "blue" | "emerald" | "amber" | "red" | "cyan";
}) {
  const iconCls = {
    blue: "text-blue-400",
    emerald: "text-emerald-400",
    amber: "text-amber-400",
    red: "text-red-400",
    cyan: "text-cyan-400",
  }[accent ?? "blue"];
  return (
    <div className="bg-card border border-border rounded p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
        <Icon size={13} className={iconCls} />
      </div>
      <p className="text-2xl font-mono font-semibold text-foreground leading-none">
        {value}
      </p>
    </div>
  );
}

function SectionCard({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-card border border-border rounded">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
          {title}
        </span>
        {action}
      </div>
      {children}
    </div>
  );
}

function TableHead({ cols }: { cols: string[] }) {
  return (
    <thead>
      <tr className="border-b border-border bg-white/[0.02]">
        {cols.map((c) => (
          <th
            key={c}
            className="text-left px-4 py-2.5 text-[10px] font-mono uppercase tracking-widest text-muted-foreground"
          >
            {c}
          </th>
        ))}
      </tr>
    </thead>
  );
}

function Pill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-[11px] font-mono transition-colors ${
        active
          ? "bg-blue-500/10 text-blue-400 border border-blue-500/25"
          : "text-muted-foreground hover:text-secondary-foreground border border-transparent"
      }`}
    >
      {label}
    </button>
  );
}

function InputField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  disabled,
  mono,
}: {
  label: string;
  type?: string;
  value: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
  mono?: boolean;
}) {
  return (
    <div>
      <label className="block text-[11px] font-medium text-secondary-foreground mb-1.5">
        {label}
      </label>
      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-3 py-2 rounded bg-secondary border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-blue-500/40 focus:border-blue-500/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
          mono ? "font-mono" : ""
        }`}
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      {label && (
        <label className="block text-[11px] font-medium text-secondary-foreground mb-1.5">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-2.5 py-2 rounded bg-secondary border border-border text-xs text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-blue-500/40"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// ─── Login page ────────────────────────────────────────────────────────────────

function LoginPage({ onLogin }: { onLogin: (email: string) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError("Email and password are required.");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin(email.trim());
    }, 900);
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[46%] flex-col justify-between p-10 bg-[#040d18] border-r border-border">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded bg-blue-500/10 border border-blue-500/20">
            <Shield size={16} className="text-blue-400" />
          </div>
          <span className="text-sm font-semibold tracking-wide">IAM Portal</span>
          <span className="ml-auto text-[10px] font-mono text-muted-foreground border border-border px-1.5 py-0.5 rounded">
            v1.0
          </span>
        </div>

        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-mono text-emerald-400">
              All systems operational
            </span>
          </div>
          <h1 className="text-2xl font-semibold leading-snug text-foreground mb-3">
            Identity & Access
            <br />
            Management
          </h1>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
            Centralized authentication, role-based access control, session
            management, and real-time security monitoring across your
            organization.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Authentication", icon: Key },
            { label: "RBAC", icon: ShieldCheck },
            { label: "Audit Logs", icon: FileText },
          ].map(({ label, icon: Icon }) => (
            <div
              key={label}
              className="p-3 rounded border border-border bg-white/[0.02]"
            >
              <Icon size={13} className="text-blue-400 mb-2" />
              <p className="text-[11px] font-mono text-muted-foreground">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-[340px]">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="p-1.5 rounded bg-blue-500/10 border border-blue-500/20">
              <Shield size={15} className="text-blue-400" />
            </div>
            <span className="text-sm font-semibold">IAM Portal</span>
          </div>

          <p className="text-base font-semibold text-foreground mb-0.5">
            Sign in
          </p>
          <p className="text-xs text-muted-foreground mb-6">
            Enter your administrator credentials to continue.
          </p>

          {error && (
            <div className="flex items-start gap-2 p-3 rounded bg-red-500/8 border border-red-500/20 mb-4">
              <AlertCircle
                size={13}
                className="text-red-400 mt-px shrink-0"
              />
              <p className="text-[11px] text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={submit} className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-medium text-secondary-foreground mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="admin@company.com"
                className="w-full px-3 py-2.5 rounded bg-secondary border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-blue-500/40 focus:border-blue-500/40 font-mono transition-colors"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-medium text-secondary-foreground">
                  Password
                </label>
                <button
                  type="button"
                  className="text-[11px] text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 pr-9 rounded bg-secondary border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-blue-500/40 focus:border-blue-500/40 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-secondary-foreground transition-colors"
                >
                  {showPw ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-1"
            >
              {loading ? (
                <>
                  <RefreshCw size={12} className="animate-spin" />
                  Authenticating…
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="mt-5 p-3 rounded bg-white/[0.025] border border-border">
            <div className="flex items-center gap-1.5 mb-1">
              <Lock size={11} className="text-muted-foreground" />
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                Secure connection
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Sessions are encrypted and monitored. Unauthorized access
              attempts are logged and may trigger account lockout.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MFA page ─────────────────────────────────────────────────────────────────

function MFAPage({
  email,
  onVerify,
  onBack,
}: {
  email: string;
  onVerify: () => void;
  onBack: () => void;
}) {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  function handleInput(i: number, v: string) {
    if (!/^\d*$/.test(v)) return;
    const next = [...digits];
    next[i] = v.slice(-1);
    setDigits(next);
    if (v && i < 5) refs.current[i + 1]?.focus();
  }

  function handleKey(i: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !digits[i] && i > 0)
      refs.current[i - 1]?.focus();
  }

  function verify() {
    if (digits.join("").length !== 6) {
      setError("Enter all 6 digits.");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onVerify();
    }, 900);
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-[320px]">
        <div className="flex items-center gap-2 mb-10">
          <div className="p-1.5 rounded bg-blue-500/10 border border-blue-500/20">
            <Shield size={15} className="text-blue-400" />
          </div>
          <span className="text-sm font-semibold">IAM Portal</span>
        </div>

        <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
          <Fingerprint size={20} className="text-blue-400" />
        </div>

        <p className="text-base font-semibold text-foreground mb-0.5">
          Two-factor authentication
        </p>
        <p className="text-xs text-muted-foreground mb-0.5">
          Enter the 6-digit code from your authenticator app.
        </p>
        <p className="text-[11px] font-mono text-muted-foreground mb-5">
          {email}
        </p>

        {error && (
          <div className="flex items-center gap-2 p-2.5 rounded bg-red-500/8 border border-red-500/20 mb-4">
            <AlertCircle size={12} className="text-red-400 shrink-0" />
            <p className="text-[11px] text-red-400">{error}</p>
          </div>
        )}

        <div className="flex gap-2 mb-4">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={(e) => handleInput(i, e.target.value)}
              onKeyDown={(e) => handleKey(i, e)}
              className="flex-1 aspect-square text-center text-base font-mono bg-secondary border border-border rounded text-foreground focus:outline-none focus:ring-1 focus:ring-blue-500/40 focus:border-blue-500/40 transition-colors"
            />
          ))}
        </div>

        <button
          onClick={verify}
          disabled={loading}
          className="w-full py-2.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mb-3"
        >
          {loading ? (
            <>
              <RefreshCw size={12} className="animate-spin" /> Verifying…
            </>
          ) : (
            "Verify"
          )}
        </button>

        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="text-[11px] text-muted-foreground hover:text-secondary-foreground transition-colors"
          >
            ← Back to sign in
          </button>
          <button className="text-[11px] text-blue-400 hover:text-blue-300 transition-colors">
            Resend code
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "users", label: "Users", icon: Users },
  { id: "roles", label: "Roles & Permissions", icon: ShieldCheck },
  { id: "applications", label: "Applications", icon: Globe },
  { id: "sessions", label: "Active Sessions", icon: Monitor },
  { id: "audit-logs", label: "Audit Logs", icon: FileText },
  { id: "security-events", label: "Security Events", icon: AlertTriangle },
  { id: "settings", label: "Security Settings", icon: Settings },
] as const;

function Sidebar({
  current,
  onNavigate,
  onLogout,
  open,
  onClose,
}: {
  current: Page;
  onNavigate: (p: Page) => void;
  onLogout: () => void;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/70 z-20 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-52 flex flex-col bg-[#040d18] border-r border-border transition-transform duration-200 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="flex items-center gap-2 px-4 py-3.5 border-b border-border">
          <div className="p-1.5 rounded bg-blue-500/10 border border-blue-500/20 shrink-0">
            <Shield size={14} className="text-blue-400" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold leading-none">IAM Portal</p>
            <p className="text-[10px] font-mono text-muted-foreground mt-0.5">
              v1.0.0
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto lg:hidden text-muted-foreground hover:text-foreground"
          >
            <X size={13} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2.5 py-3 overflow-y-auto space-y-0.5">
          <p className="text-[9px] font-mono uppercase tracking-[0.15em] text-muted-foreground px-2 mb-2">
            Navigation
          </p>
          {NAV.map(({ id, label, icon: Icon }) => {
            const active = current === id || (id === "users" && current === "user-detail");
            return (
              <button
                key={id}
                onClick={() => {
                  onNavigate(id as Page);
                  onClose();
                }}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded text-[11px] font-medium transition-colors text-left ${
                  active
                    ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    : "text-muted-foreground hover:text-secondary-foreground hover:bg-white/[0.04] border border-transparent"
                }`}
              >
                <Icon size={13} className="shrink-0" />
                {label}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-2.5 py-3 border-t border-border">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded text-[11px] text-muted-foreground hover:text-red-400 hover:bg-red-500/8 transition-colors border border-transparent"
          >
            <LogOut size={13} />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────

function Header({
  title,
  email,
  onNavigate,
  onToggle,
}: {
  title: string;
  email: string;
  onNavigate: (p: Page) => void;
  onToggle: () => void;
}) {
  return (
    <header className="h-11 flex items-center justify-between px-4 border-b border-border bg-background shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggle}
          className="lg:hidden text-muted-foreground hover:text-foreground"
        >
          <Menu size={15} />
        </button>
        <span className="text-xs font-medium text-foreground">{title}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <button className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-white/[0.04] transition-colors">
          <Bell size={13} />
        </button>
        <button
          onClick={() => onNavigate("profile")}
          className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-white/[0.04] transition-colors"
        >
          <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0">
            <User size={11} className="text-blue-400" />
          </div>
          <span className="text-[11px] font-mono text-muted-foreground hidden sm:block max-w-[120px] truncate">
            {email || "Admin"}
          </span>
        </button>
      </div>
    </header>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

function DashboardPage() {
  return (
    <div className="p-5 space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Total Users" value="—" icon={Users} accent="blue" />
        <StatCard
          label="Active Sessions"
          value="—"
          icon={Activity}
          accent="cyan"
        />
        <StatCard
          label="Connected Apps"
          value="—"
          icon={Globe}
          accent="emerald"
        />
        <StatCard
          label="Failed Logins (24h)"
          value="—"
          icon={AlertTriangle}
          accent="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SectionCard
          title="Recent Activity"
          action={
            <button className="text-[11px] text-blue-400 hover:text-blue-300 transition-colors">
              View all
            </button>
          }
        >
          <div className="lg:col-span-2">
            <EmptyState
              icon={Activity}
              title="No recent activity"
              description="Activity will appear here as users authenticate and perform actions."
            />
          </div>
        </SectionCard>

        <SectionCard
          title="Security Alerts"
          action={
            <span className="text-[10px] font-mono text-muted-foreground">
              0 active
            </span>
          }
        >
          <EmptyState
            icon={ShieldCheck}
            title="No active alerts"
            description="Alerts appear when security policies are violated."
          />
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard
          title="Authentication Activity — Last 30 Days"
          action={
            <span className="text-[10px] font-mono text-muted-foreground">
              No data available
            </span>
          }
        >
          <div className="h-36 flex items-center justify-center mx-4 my-4 border border-dashed border-white/[0.06] rounded">
            <div className="text-center">
              <Database size={14} className="text-muted-foreground mx-auto mb-2" />
              <p className="text-[11px] text-muted-foreground">
                Chart renders when authentication data is available
              </p>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="System Status">
          <div className="p-4 space-y-2.5">
            {[
              { label: "Authentication Service", status: "operational" },
              { label: "Session Manager", status: "operational" },
              { label: "Audit Logger", status: "operational" },
              { label: "Threat Detection", status: "operational" },
            ].map(({ label, status }) => (
              <div
                key={label}
                className="flex items-center justify-between py-1.5 border-b border-border last:border-0"
              >
                <span className="text-xs text-secondary-foreground">
                  {label}
                </span>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[10px] font-mono text-emerald-400 capitalize">
                    {status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

// ─── Users ────────────────────────────────────────────────────────────────────

function UsersPage({ onViewUser }: { onViewUser: () => void }) {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");
  const [mfa, setMfa] = useState("all");

  return (
    <div className="p-5 space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search
            size={12}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="w-full pl-8 pr-3 py-2 rounded bg-secondary border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-blue-500/40 font-mono"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="px-2.5 py-2 rounded bg-secondary border border-border text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-blue-500/40 font-mono"
          >
            <option value="all">All Roles</option>
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-2.5 py-2 rounded bg-secondary border border-border text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-blue-500/40 font-mono"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
          <select
            value={mfa}
            onChange={(e) => setMfa(e.target.value)}
            className="px-2.5 py-2 rounded bg-secondary border border-border text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-blue-500/40 font-mono"
          >
            <option value="all">MFA: All</option>
            <option value="enabled">Enabled</option>
            <option value="disabled">Disabled</option>
          </select>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors shrink-0">
            <Plus size={12} />
            Add User
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded overflow-hidden">
        <table className="w-full">
          <TableHead
            cols={[
              "Name",
              "Email",
              "Role",
              "Status",
              "Last Login",
              "MFA",
              "",
            ]}
          />
          <tbody>
            <tr>
              <td colSpan={7}>
                <EmptyState
                  icon={Users}
                  title="No users found"
                  description="Add users to your organization to grant access to connected applications."
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono text-muted-foreground">
          0 users
        </span>
        <span className="text-[10px] font-mono text-muted-foreground">
          Page 1 of 1
        </span>
      </div>
    </div>
  );
}

// ─── User detail ──────────────────────────────────────────────────────────────

function UserDetailPage({ onBack }: { onBack: () => void }) {
  return (
    <div className="p-5 space-y-4">
      <button
        onClick={onBack}
        className="text-[11px] text-muted-foreground hover:text-secondary-foreground transition-colors"
      >
        ← Back to Users
      </button>
      <EmptyState
        icon={User}
        title="No user selected"
        description="Select a user from the Users list to view their profile, sessions, roles, and audit history."
      />
    </div>
  );
}

// ─── Roles & Permissions ──────────────────────────────────────────────────────

function RolesPage() {
  const PERMISSION_GROUPS = [
    {
      group: "User Management",
      perms: ["View Users", "Create Users", "Edit Users", "Delete Users"],
    },
    {
      group: "Role Management",
      perms: ["View Roles", "Create Roles", "Edit Roles", "Delete Roles"],
    },
    {
      group: "Application Access",
      perms: ["View Apps", "Connect Apps", "Configure Apps", "Revoke Apps"],
    },
    {
      group: "Security",
      perms: ["View Audit Logs", "View Security Events", "Edit Security Settings"],
    },
    {
      group: "Sessions",
      perms: ["View Sessions", "Terminate Sessions"],
    },
  ];

  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">
            Roles & Permissions
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Define roles and assign granular permissions to control access
          </p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors">
          <Plus size={12} />
          Create Role
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Role list */}
        <SectionCard
          title="Roles"
          action={
            <span className="text-[10px] font-mono text-muted-foreground">
              0 configured
            </span>
          }
        >
          <EmptyState
            icon={ShieldCheck}
            title="No roles configured"
            description="Create roles to assign permission sets to your users."
          />
        </SectionCard>

        {/* Permission matrix */}
        <div className="lg:col-span-2 bg-card border border-border rounded overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              Permission Matrix
            </span>
          </div>
          <div className="p-4 space-y-4">
            {PERMISSION_GROUPS.map(({ group, perms }) => (
              <div key={group}>
                <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-2">
                  {group}
                </p>
                <div className="space-y-1">
                  {perms.map((p) => (
                    <div
                      key={p}
                      className="flex items-center justify-between py-1.5 px-3 rounded bg-white/[0.02] border border-border"
                    >
                      <span className="text-xs text-secondary-foreground">
                        {p}
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        No role selected
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Applications ─────────────────────────────────────────────────────────────

function ApplicationsPage() {
  const [filter, setFilter] = useState("all");
  const filters = ["All", "Active", "Inactive", "Pending"];

  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">
            Connected Applications
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage SSO integrations for your company websites and services
          </p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors">
          <Plus size={12} />
          Connect Application
        </button>
      </div>

      <div className="flex items-center gap-1.5">
        {filters.map((f) => (
          <Pill
            key={f}
            label={f}
            active={filter === f.toLowerCase()}
            onClick={() => setFilter(f.toLowerCase())}
          />
        ))}
      </div>

      <div className="bg-card border border-border rounded">
        <EmptyState
          icon={Globe}
          title="No connected applications"
          description="Connect your company websites and internal tools to enable single sign-on and centralized access management."
        />
      </div>

      <div className="bg-card border border-border rounded p-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-3">
          Supported Protocols
        </p>
        <div className="flex flex-wrap gap-2">
          {["SAML 2.0", "OpenID Connect", "OAuth 2.0", "LDAP", "SCIM 2.0"].map(
            (p) => (
              <span
                key={p}
                className="px-2.5 py-1 rounded border border-border text-[11px] font-mono text-muted-foreground"
              >
                {p}
              </span>
            )
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Sessions ─────────────────────────────────────────────────────────────────

function SessionsPage() {
  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">
            Active Sessions
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Monitor and manage all current authenticated sessions
          </p>
        </div>
        <button className="px-3 py-2 rounded bg-red-500/8 hover:bg-red-500/15 border border-red-500/25 text-red-400 text-xs font-medium transition-colors">
          Terminate All Sessions
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Active", value: "0", icon: Activity },
          { label: "Unique Users", value: "0", icon: Users },
          { label: "Unique Devices", value: "0", icon: Laptop },
          { label: "Suspicious", value: "0", icon: AlertTriangle },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-card border border-border rounded p-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                {label}
              </p>
              <Icon size={12} className="text-muted-foreground" />
            </div>
            <p className="text-xl font-mono font-semibold text-foreground">
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded overflow-hidden">
        <table className="w-full">
          <TableHead
            cols={[
              "User",
              "Device",
              "Browser",
              "IP Address",
              "Login Time",
              "Last Activity",
              "Status",
              "",
            ]}
          />
          <tbody>
            <tr>
              <td colSpan={8}>
                <EmptyState
                  icon={Monitor}
                  title="No active sessions"
                  description="Active sessions will appear here as users authenticate."
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Audit Logs ───────────────────────────────────────────────────────────────

function AuditLogsPage() {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [eventType, setEventType] = useState("all");
  const [severity, setSeverity] = useState("all");
  const [result, setResult] = useState("all");

  const hasFilters =
    dateFrom || dateTo || eventType !== "all" || severity !== "all" || result !== "all";

  function clearFilters() {
    setDateFrom("");
    setDateTo("");
    setEventType("all");
    setSeverity("all");
    setResult("all");
  }

  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">Audit Logs</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Immutable, tamper-evident record of all system events
          </p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 rounded bg-secondary border border-border text-muted-foreground hover:text-secondary-foreground text-xs transition-colors">
          <Download size={12} />
          Export CSV
        </button>
      </div>

      {/* Filter bar */}
      <div className="bg-card border border-border rounded p-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 shrink-0">
            <Filter size={11} className="text-muted-foreground" />
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
              Filters
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono text-muted-foreground">
              From
            </span>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="px-2 py-1 rounded bg-secondary border border-border text-[11px] text-foreground focus:outline-none focus:ring-1 focus:ring-blue-500/40 font-mono"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono text-muted-foreground">
              To
            </span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="px-2 py-1 rounded bg-secondary border border-border text-[11px] text-foreground focus:outline-none focus:ring-1 focus:ring-blue-500/40 font-mono"
            />
          </div>
          <select
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            className="px-2 py-1 rounded bg-secondary border border-border text-[11px] text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-blue-500/40"
          >
            <option value="all">All Event Types</option>
            <option value="auth">Authentication</option>
            <option value="user">User Management</option>
            <option value="role">Role Changes</option>
            <option value="app">Application Access</option>
            <option value="session">Session Events</option>
            <option value="settings">Settings Changes</option>
          </select>
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            className="px-2 py-1 rounded bg-secondary border border-border text-[11px] text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-blue-500/40"
          >
            <option value="all">All Severity</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
            <option value="info">Info</option>
          </select>
          <select
            value={result}
            onChange={(e) => setResult(e.target.value)}
            className="px-2 py-1 rounded bg-secondary border border-border text-[11px] text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-blue-500/40"
          >
            <option value="all">All Results</option>
            <option value="success">Success</option>
            <option value="failure">Failure</option>
            <option value="blocked">Blocked</option>
          </select>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-secondary-foreground transition-colors"
            >
              <X size={10} /> Clear
            </button>
          )}
        </div>
      </div>

      <div className="bg-card border border-border rounded overflow-hidden">
        <table className="w-full">
          <TableHead
            cols={[
              "Timestamp",
              "Event Type",
              "User",
              "Application",
              "Severity",
              "Result",
            ]}
          />
          <tbody>
            <tr>
              <td colSpan={6}>
                <EmptyState
                  icon={FileText}
                  title="No audit activity"
                  description="Events are recorded here as users authenticate, modify settings, and access applications."
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono text-muted-foreground">
          0 events
        </span>
        <span className="text-[10px] font-mono text-muted-foreground">
          Page 1 of 1
        </span>
      </div>
    </div>
  );
}

// ─── Security Events ──────────────────────────────────────────────────────────

function SecurityEventsPage() {
  const [sev, setSev] = useState("all");
  const [status, setStatus] = useState("all");

  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-sm font-semibold text-foreground">
            Security Events
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time threat detection and security incident tracking
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-mono text-emerald-400">
              Monitoring active
            </span>
          </div>
        </div>
      </div>

      {/* Severity counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Critical", value: "0", cls: "text-red-400" },
          { label: "High", value: "0", cls: "text-orange-400" },
          { label: "Medium", value: "0", cls: "text-amber-400" },
          { label: "Low / Info", value: "0", cls: "text-blue-400" },
        ].map(({ label, value, cls }) => (
          <div key={label} className="bg-card border border-border rounded p-3">
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
              {label}
            </p>
            <p className={`text-2xl font-mono font-semibold ${cls}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <select
          value={sev}
          onChange={(e) => setSev(e.target.value)}
          className="px-2.5 py-1.5 rounded bg-secondary border border-border text-[11px] text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-blue-500/40"
        >
          <option value="all">All Severity</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
          <option value="info">Info</option>
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-2.5 py-1.5 rounded bg-secondary border border-border text-[11px] text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-blue-500/40"
        >
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="investigating">Investigating</option>
          <option value="resolved">Resolved</option>
          <option value="false-positive">False Positive</option>
        </select>
        <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-secondary border border-border text-[11px] text-muted-foreground hover:text-secondary-foreground transition-colors ml-auto">
          <Download size={11} />
          Export
        </button>
      </div>

      <div className="bg-card border border-border rounded overflow-hidden">
        <table className="w-full">
          <TableHead
            cols={[
              "Event Type",
              "Severity",
              "Timestamp",
              "Affected User",
              "Application",
              "Status",
            ]}
          />
          <tbody>
            <tr>
              <td colSpan={6}>
                <EmptyState
                  icon={ShieldCheck}
                  title="No security events"
                  description="Security events will appear here when the threat detection engine identifies anomalies."
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Security Settings ────────────────────────────────────────────────────────

function SettingsPage() {
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [mfaRequired, setMfaRequired] = useState(false);
  const [mfaTOTP, setMfaTOTP] = useState(true);
  const [mfaSMS, setMfaSMS] = useState(false);
  const [saml, setSaml] = useState(false);
  const [oidc, setOidc] = useState(false);
  const [selfReg, setSelfReg] = useState(false);
  const [minLen, setMinLen] = useState("12");
  const [upper, setUpper] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(false);
  const [passExpiry, setPassExpiry] = useState("90");
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [concurrentSessions, setConcurrentSessions] = useState("5");
  const [maxAttempts, setMaxAttempts] = useState("5");
  const [lockoutDur, setLockoutDur] = useState("30");
  const [emailAlerts, setEmailAlerts] = useState(false);
  const [slackAlerts, setSlackAlerts] = useState(false);
  const [webhookAlerts, setWebhookAlerts] = useState(false);
  const [ipAllowlist, setIpAllowlist] = useState(false);
  const [geoRestrict, setGeoRestrict] = useState(false);
  const [trustedDevices, setTrustedDevices] = useState(false);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function Row({
    label,
    desc,
    children,
  }: {
    label: string;
    desc?: string;
    children: React.ReactNode;
  }) {
    return (
      <div className="flex items-center justify-between py-2.5 border-b border-border last:border-0 gap-4">
        <div className="min-w-0">
          <p className="text-xs font-medium text-foreground">{label}</p>
          {desc && (
            <p className="text-[11px] text-muted-foreground mt-0.5">{desc}</p>
          )}
        </div>
        <div className="shrink-0">{children}</div>
      </div>
    );
  }

  function SectionTitle({
    title,
    desc,
  }: {
    title: string;
    desc: string;
  }) {
    return (
      <div className="mb-3">
        <p className="text-xs font-semibold text-foreground">{title}</p>
        <p className="text-[11px] text-muted-foreground mt-0.5">{desc}</p>
      </div>
    );
  }

  const numInput = (val: string, set: (v: string) => void, min = 1, max = 999) => (
    <input
      type="number"
      min={min}
      max={max}
      value={val}
      onChange={(e) => set(e.target.value)}
      className="w-16 px-2 py-1 rounded bg-secondary border border-border text-xs text-foreground font-mono text-center focus:outline-none focus:ring-1 focus:ring-blue-500/40"
    />
  );

  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">
            Security Settings
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure authentication policies and security controls for your
            organization
          </p>
        </div>
        {saved && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-500/10 border border-emerald-500/20">
            <CheckCircle size={12} className="text-emerald-400" />
            <span className="text-[11px] font-mono text-emerald-400">
              Settings saved
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* MFA */}
        <div className="bg-card border border-border rounded p-4">
          <SectionTitle
            title="Multi-Factor Authentication"
            desc="Configure MFA requirements for your organization"
          />
          <Row label="Enable MFA" desc="Allow users to enroll in MFA">
            <Toggle enabled={mfaEnabled} onChange={() => setMfaEnabled(!mfaEnabled)} />
          </Row>
          <Row label="Require MFA for all users" desc="Force MFA enrollment on next sign-in">
            <Toggle
              enabled={mfaRequired}
              onChange={() => setMfaRequired(!mfaRequired)}
              disabled={!mfaEnabled}
            />
          </Row>
          <Row label="TOTP (Authenticator App)">
            <Toggle enabled={mfaTOTP} onChange={() => setMfaTOTP(!mfaTOTP)} disabled={!mfaEnabled} />
          </Row>
          <Row label="SMS One-Time Code">
            <Toggle enabled={mfaSMS} onChange={() => setMfaSMS(!mfaSMS)} disabled={!mfaEnabled} />
          </Row>
        </div>

        {/* Auth Methods */}
        <div className="bg-card border border-border rounded p-4">
          <SectionTitle
            title="Authentication Methods"
            desc="Enable external identity providers for federation"
          />
          <Row label="SAML 2.0" desc="Enterprise SSO via SAML assertions">
            <Toggle enabled={saml} onChange={() => setSaml(!saml)} />
          </Row>
          <Row label="OpenID Connect / OAuth 2.0" desc="OIDC federation with external IdPs">
            <Toggle enabled={oidc} onChange={() => setOidc(!oidc)} />
          </Row>
          <Row label="Self-service Registration" desc="Allow users to create accounts without an invitation">
            <Toggle enabled={selfReg} onChange={() => setSelfReg(!selfReg)} />
          </Row>
        </div>

        {/* Password Policy */}
        <div className="bg-card border border-border rounded p-4">
          <SectionTitle
            title="Password Policy"
            desc="Set minimum password requirements for all accounts"
          />
          <Row label="Minimum length">
            {numInput(minLen, setMinLen, 6, 128)}
          </Row>
          <Row label="Require uppercase letters" desc="At least one A–Z character">
            <Toggle enabled={upper} onChange={() => setUpper(!upper)} />
          </Row>
          <Row label="Require numeric characters" desc="At least one 0–9 digit">
            <Toggle enabled={numbers} onChange={() => setNumbers(!numbers)} />
          </Row>
          <Row label="Require special characters" desc="At least one symbol ( !@#$%… )">
            <Toggle enabled={symbols} onChange={() => setSymbols(!symbols)} />
          </Row>
          <Row label="Password expiry (days)" desc="0 = never expires">
            {numInput(passExpiry, setPassExpiry, 0, 365)}
          </Row>
        </div>

        {/* Session & Lockout */}
        <div className="bg-card border border-border rounded p-4">
          <SectionTitle
            title="Session & Account Lockout"
            desc="Control session lifetime and brute-force protection"
          />
          <Row label="Idle session timeout" desc="Minutes of inactivity before session expires">
            <select
              value={sessionTimeout}
              onChange={(e) => setSessionTimeout(e.target.value)}
              className="px-2 py-1 rounded bg-secondary border border-border text-[11px] text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-blue-500/40"
            >
              <option value="15">15 min</option>
              <option value="30">30 min</option>
              <option value="60">1 hour</option>
              <option value="120">2 hours</option>
              <option value="480">8 hours</option>
              <option value="0">Never</option>
            </select>
          </Row>
          <Row label="Max concurrent sessions per user">
            {numInput(concurrentSessions, setConcurrentSessions, 1, 50)}
          </Row>
          <Row label="Max failed login attempts before lockout">
            {numInput(maxAttempts, setMaxAttempts, 1, 20)}
          </Row>
          <Row label="Account lockout duration (minutes)">
            {numInput(lockoutDur, setLockoutDur, 1, 1440)}
          </Row>
        </div>

        {/* Notifications */}
        <div className="bg-card border border-border rounded p-4">
          <SectionTitle
            title="Alert Notifications"
            desc="Choose where security alerts and incident reports are sent"
          />
          <Row label="Email alerts" desc="Send alerts to administrator email addresses">
            <Toggle enabled={emailAlerts} onChange={() => setEmailAlerts(!emailAlerts)} />
          </Row>
          <Row label="Slack integration" desc="Forward alerts to a configured Slack channel">
            <Toggle enabled={slackAlerts} onChange={() => setSlackAlerts(!slackAlerts)} />
          </Row>
          <Row label="Webhook endpoint" desc="POST events to a custom HTTPS endpoint">
            <Toggle enabled={webhookAlerts} onChange={() => setWebhookAlerts(!webhookAlerts)} />
          </Row>
        </div>

        {/* Access Control */}
        <div className="bg-card border border-border rounded p-4">
          <SectionTitle
            title="Network Access Control"
            desc="Restrict sign-ins by IP address or geographic region"
          />
          <Row label="IP address allowlist" desc="Only permit sign-ins from specified CIDRs">
            <Toggle enabled={ipAllowlist} onChange={() => setIpAllowlist(!ipAllowlist)} />
          </Row>
          {ipAllowlist && (
            <div className="my-2">
              <textarea
                placeholder={"192.168.1.0/24\n10.0.0.0/8"}
                rows={3}
                className="w-full px-3 py-2 rounded bg-secondary border border-border text-[11px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-blue-500/40 font-mono resize-none"
              />
            </div>
          )}
          <Row label="Geographic restrictions" desc="Block sign-ins from specific countries">
            <Toggle enabled={geoRestrict} onChange={() => setGeoRestrict(!geoRestrict)} />
          </Row>
          <Row label="Trust verified devices" desc="Skip MFA on devices that passed a previous MFA check">
            <Toggle enabled={trustedDevices} onChange={() => setTrustedDevices(!trustedDevices)} />
          </Row>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-1">
        <button className="px-4 py-2 rounded bg-secondary border border-border text-xs text-muted-foreground hover:text-secondary-foreground transition-colors">
          Discard Changes
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}

// ─── Profile ──────────────────────────────────────────────────────────────────

function ProfilePage({ email }: { email: string }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [dept, setDept] = useState("");
  const [curPw, setCurPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confPw, setConfPw] = useState("");
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="p-5 space-y-4 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">
            Administrator Profile
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage your account information and personal security settings
          </p>
        </div>
        {saved && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-500/10 border border-emerald-500/20">
            <CheckCircle size={12} className="text-emerald-400" />
            <span className="text-[11px] font-mono text-emerald-400">
              Profile saved
            </span>
          </div>
        )}
      </div>

      {/* Identity */}
      <div className="bg-card border border-border rounded p-4">
        <div className="flex items-center gap-4 mb-5 pb-4 border-b border-border">
          <div className="w-12 h-12 rounded-full bg-blue-500/15 border border-blue-500/25 flex items-center justify-center shrink-0">
            <User size={20} className="text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {name || "Administrator"}
            </p>
            <p className="text-[11px] font-mono text-muted-foreground">
              {email}
            </p>
            <div className="mt-1.5">
              <Badge variant="info">Administrator</Badge>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <InputField
            label="Display Name"
            value={name}
            onChange={setName}
            placeholder="Your full name"
          />
          <InputField
            label="Email Address"
            value={email}
            disabled
            mono
            placeholder=""
          />
          <InputField
            label="Phone (SMS MFA)"
            value={phone}
            onChange={setPhone}
            placeholder="+1 555 000 0000"
            mono
          />
          <InputField
            label="Department"
            value={dept}
            onChange={setDept}
            placeholder="e.g. Engineering, Security"
          />
        </div>
      </div>

      {/* Password */}
      <div className="bg-card border border-border rounded p-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-4">
          Change Password
        </p>
        <div className="space-y-3">
          <InputField
            label="Current Password"
            type="password"
            value={curPw}
            onChange={setCurPw}
            placeholder="••••••••"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InputField
              label="New Password"
              type="password"
              value={newPw}
              onChange={setNewPw}
              placeholder="••••••••"
            />
            <InputField
              label="Confirm New Password"
              type="password"
              value={confPw}
              onChange={setConfPw}
              placeholder="••••••••"
            />
          </div>
          {newPw && confPw && newPw !== confPw && (
            <p className="text-[11px] text-red-400 font-mono">
              Passwords do not match.
            </p>
          )}
        </div>
      </div>

      {/* MFA */}
      <div className="bg-card border border-border rounded p-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-4">
          Multi-Factor Authentication
        </p>
        <div className="space-y-2.5">
          {[
            { label: "Authenticator App (TOTP)", icon: Smartphone, enrolled: false },
            { label: "SMS Verification", icon: Mail, enrolled: false },
          ].map(({ label, icon: Icon, enrolled }) => (
            <div
              key={label}
              className="flex items-center justify-between py-2 border-b border-border last:border-0"
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded bg-secondary border border-border">
                  <Icon size={13} className="text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground">
                    {label}
                  </p>
                  <p className="text-[10px] font-mono text-muted-foreground">
                    {enrolled ? "Enrolled" : "Not enrolled"}
                  </p>
                </div>
              </div>
              <button className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-medium transition-colors">
                {enrolled ? "Manage" : "Enroll"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-card border border-red-500/15 rounded p-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-red-400 mb-3">
          Danger Zone
        </p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-foreground">
              Terminate all my sessions
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Sign out from all devices immediately. You will need to sign in
              again.
            </p>
          </div>
          <button className="px-3 py-1.5 rounded border border-red-500/30 text-red-400 hover:bg-red-500/8 text-[11px] font-medium transition-colors shrink-0">
            Terminate Sessions
          </button>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-1">
        <button className="px-4 py-2 rounded bg-secondary border border-border text-xs text-muted-foreground hover:text-secondary-foreground transition-colors">
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors"
        >
          Save Profile
        </button>
      </div>
    </div>
  );
}

// ─── App Shell ────────────────────────────────────────────────────────────────

const PAGE_TITLES: Record<Page, string> = {
  dashboard: "Dashboard",
  users: "Users",
  "user-detail": "User Details",
  roles: "Roles & Permissions",
  applications: "Connected Applications",
  sessions: "Active Sessions",
  "audit-logs": "Audit Logs",
  "security-events": "Security Events",
  settings: "Security Settings",
  profile: "Administrator Profile",
};

function AppShell({
  current,
  onNavigate,
  onLogout,
  email,
  children,
}: {
  current: Page;
  onNavigate: (p: Page) => void;
  onLogout: () => void;
  email: string;
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar
        current={current}
        onNavigate={onNavigate}
        onLogout={onLogout}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          title={PAGE_TITLES[current]}
          email={email}
          onNavigate={onNavigate}
          onToggle={() => setSidebarOpen((v) => !v)}
        />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [authed, setAuthed] = useState(false);
  const [mfa, setMfa] = useState(false);
  const [email, setEmail] = useState("");
  const [page, setPage] = useState<Page>("dashboard");

  if (!authed) {
    if (mfa)
      return (
        <MFAPage
          email={email}
          onVerify={() => {
            setAuthed(true);
            setMfa(false);
          }}
          onBack={() => setMfa(false)}
        />
      );
    return (
      <LoginPage
        onLogin={(e) => {
          setEmail(e);
          setMfa(true);
        }}
      />
    );
  }

  const pageMap: Record<Page, React.ReactNode> = {
    dashboard: <DashboardPage />,
    users: <UsersPage onViewUser={() => setPage("user-detail")} />,
    "user-detail": <UserDetailPage onBack={() => setPage("users")} />,
    roles: <RolesPage />,
    applications: <ApplicationsPage />,
    sessions: <SessionsPage />,
    "audit-logs": <AuditLogsPage />,
    "security-events": <SecurityEventsPage />,
    settings: <SettingsPage />,
    profile: <ProfilePage email={email} />,
  };

  return (
    <AppShell
      current={page}
      onNavigate={setPage}
      onLogout={() => {
        setAuthed(false);
        setMfa(false);
        setPage("dashboard");
      }}
      email={email}
    >
      {pageMap[page]}
    </AppShell>
  );
}
