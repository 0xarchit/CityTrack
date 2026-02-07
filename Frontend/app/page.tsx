"use client";
import Link from "next/link";
import {
  Smartphone,
  Zap,
  Shield,
  ChevronRight,
  Radio,
  Activity,
  MapPin,
  CheckCircle2,
  Building2,
  Users,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

export default function LandingPage() {
  const { user, role, signOut } = useAuth();

  const getDashboardLink = () => {
    if (role === "admin") return "/admin";
    if (role === "worker") return "/worker";
    return "/user";
  };

  return (
    <div className="min-h-screen text-slate-900 font-sans selection:bg-emerald-100 selection:text-slate-900 overflow-x-hidden">
      <div className="fixed inset-0 z-0 opacity-70 pointer-events-none bg-mesh" />
      <div className="fixed inset-0 z-0 opacity-50 pointer-events-none bg-grid" />

      <nav className="fixed top-0 w-full z-50 border-b border-slate-200/70 bg-white/70 backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-3 group cursor-default">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                City<span className="text-emerald-600">Track</span>
              </span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <NavLink href="#features">Features</NavLink>
              <NavLink href="#stats">Live Data</NavLink>
              <NavLink href="#roadmap">Roadmap</NavLink>
            </div>

            <div className="flex gap-4 items-center">
              {user ? (
                <>
                  <button
                    onClick={() => signOut()}
                    className="hidden sm:flex px-4 py-2 text-slate-500 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                  <Link
                    href={getDashboardLink()}
                    className="group relative px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Go to Dashboard</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/signin"
                    className="px-5 py-2 text-slate-600 hover:text-slate-900 font-medium transition-colors hover:bg-slate-100 rounded-lg"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="group relative px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition-all shadow-lg shadow-emerald-500/30 overflow-hidden hover:-translate-y-0.5"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    <span className="relative flex items-center gap-2">
                      Get Started <ChevronRight className="w-4 h-4" />
                    </span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-24">
        <div className="relative border-b border-slate-200/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
            <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm mb-8 fade-up">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-sm font-bold text-slate-600 font-mono tracking-wide">
                    SYSTEM ONLINE
                  </span>
                </div>

                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight mb-6 leading-[1.05]">
                  City infrastructure,
                  <span className="block bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
                    remapped by intelligence.
                  </span>
                </h1>

                <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl lg:max-w-none leading-relaxed">
                  A civic response system that blends vision AI,
                  geo-deduplication, and automated routing to turn every report
                  into a verified, trackable action.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
                  <Link
                    href="/signup"
                    className="px-7 py-3.5 bg-slate-900 text-white font-bold rounded-xl shadow-xl shadow-slate-900/20 hover:shadow-slate-900/30 transition-all hover:-translate-y-1 flex items-center gap-2"
                  >
                    Report an Issue
                    <Smartphone className="w-5 h-5" />
                  </Link>
                  <Link
                    href="/signin"
                    className="px-7 py-3.5 bg-white text-slate-700 font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 transition-all shadow-lg shadow-slate-200/50 hover:border-slate-300 flex items-center gap-2"
                  >
                    Track Status
                    <Activity className="w-5 h-5 text-emerald-600" />
                  </Link>
                </div>
              </div>

              <div className="glass-panel rounded-3xl p-6 md:p-8 shadow-urban-xl float-slow">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500 font-semibold">
                      Ops Pulse
                    </p>
                    <p className="text-2xl font-bold text-slate-900">
                      Live Command Board
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Activity className="w-5 h-5" />
                  </div>
                </div>

                <div id="stats" className="grid grid-cols-2 gap-4">
                  <StatCard
                    label="ISSUES RESOLVED"
                    value="12,405"
                    icon={CheckCircle2}
                    color="text-emerald-600 bg-emerald-50"
                  />
                  <StatCard
                    label="ACTIVE AGENTS"
                    value="84"
                    icon={Users}
                    color="text-cyan-600 bg-cyan-50"
                  />
                  <StatCard
                    label="AVG. REACTION"
                    value="1.2hrs"
                    icon={Zap}
                    color="text-amber-600 bg-amber-50"
                  />
                  <StatCard
                    label="CITIES LIVE"
                    value="3"
                    icon={Building2}
                    color="text-slate-700 bg-slate-100"
                  />
                </div>

                <div className="mt-6 rounded-2xl bg-slate-900 text-white p-4">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-slate-300">
                    <span>Routing</span>
                    <span className="text-emerald-400">Auto-assign</span>
                  </div>
                  <p className="mt-3 text-sm text-slate-200">
                    18 active tasks prioritized and dispatched to nearest teams.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          id="features"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Core Capabilities
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">
              Built on a microservices architecture designed for scale,
              security, and speed.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Radio className="w-8 h-8 text-blue-600" />}
              title="Geo-Spatial AI"
              desc="Automatically detects duplicate reports within a 50m radius using smart cluster analysis and GPS verification."
              colorClass="bg-blue-50 group-hover:bg-blue-100/50"
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8 text-amber-500" />}
              title="Vision Agent"
              desc="Computer vision algorithms analyze uploaded photos to identify pothole severity, debris types, and hazards instantly."
              colorClass="bg-amber-50 group-hover:bg-amber-100/50"
            />
            <FeatureCard
              icon={<Shield className="w-8 h-8 text-emerald-600" />}
              title="End-to-End Encryption"
              desc="Citizen data is AES-256 encrypted at rest. Zero-knowledge protocols ensure maximum privacy."
              colorClass="bg-emerald-50 group-hover:bg-emerald-100/50"
            />
          </div>
        </div>

        <div
          id="roadmap"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-28"
        >
          <div className="glass-panel rounded-3xl p-8 md:p-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500 font-semibold">
                  Roadmap
                </p>
                <h3 className="text-3xl font-bold text-slate-900 mt-2">
                  Next deployments
                </h3>
                <p className="text-slate-500 mt-3 max-w-xl">
                  Expanding to new municipal zones with predictive maintenance,
                  citizen feedback loops, and real-time response SLAs.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full md:w-auto">
                <div className="rounded-2xl bg-white border border-slate-200 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400 font-semibold">
                    Phase 1
                  </p>
                  <p className="text-lg font-bold text-slate-900 mt-2">
                    North Zone
                  </p>
                  <p className="text-sm text-slate-500 mt-1">Q2 rollout</p>
                </div>
                <div className="rounded-2xl bg-white border border-slate-200 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400 font-semibold">
                    Phase 2
                  </p>
                  <p className="text-lg font-bold text-slate-900 mt-2">
                    Predictive SLA
                  </p>
                  <p className="text-sm text-slate-500 mt-1">Q3 launch</p>
                </div>
                <div className="rounded-2xl bg-white border border-slate-200 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400 font-semibold">
                    Phase 3
                  </p>
                  <p className="text-lg font-bold text-slate-900 mt-2">
                    Citizen Portal
                  </p>
                  <p className="text-sm text-slate-500 mt-1">Q4 release</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white/80 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-2 mb-8 opacity-75 hover:opacity-100 transition-opacity">
            <div className="w-6 h-6 bg-slate-900 rounded-md flex items-center justify-center text-white">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <span className="text-sm font-bold tracking-wide text-slate-900">
              CityTracker SYSTEMS
            </span>
          </div>
          <p className="text-slate-500 text-sm">
            © 2026 Dept. of Public Works. Secure. Efficient. Transparent.
          </p>
        </div>
      </footer>
    </div>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors"
    >
      {children}
    </Link>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: string;
  icon: any;
  color: string;
}) {
  return (
    <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all group">
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-1.5 rounded-lg ${color}`}>
          <Icon className="w-4 h-4" />
        </div>
        <span className="text-xs font-mono text-slate-500 font-bold tracking-wider">
          {label}
        </span>
      </div>
      <div className="text-2xl font-bold text-slate-900 group-hover:scale-105 transition-transform origin-left font-mono">
        {value}
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
  colorClass,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  colorClass: string;
}) {
  return (
    <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-200/80 hover:-translate-y-1 transition-all group">
      <div
        className={`w-16 h-16 ${colorClass} rounded-2xl flex items-center justify-center mb-6 border border-slate-100 group-hover:scale-110 transition-transform duration-300`}
      >
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">
        {title}
      </h3>
      <p className="text-slate-500 leading-relaxed text-sm font-medium">
        {desc}
      </p>
    </div>
  );
}
