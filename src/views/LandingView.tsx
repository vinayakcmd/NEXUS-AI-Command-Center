import React from 'react';
import { useNexusStore } from '../store/useNexusStore';
import { NexusGlobe } from '../components/3d/NexusGlobe';
import {
  Shield,
  Zap,
  Globe,
  Activity,
  ArrowRight,
  Cpu,
  Layers,
  ChevronRight,
  Terminal,
  Database,
  Lock,
} from 'lucide-react';
import { formatNumber, formatLatency } from '../utils/formatters';

export function LandingView() {
  const setTab = useNexusStore((s) => s.setTab);
  const currentStats = useNexusStore((s) => s.currentStats);
  const nodes = useNexusStore((s) => s.nodes);

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between overflow-hidden">
      {/* Background 3D Globe Scene */}
      <div className="absolute inset-0 pointer-events-auto opacity-75 md:opacity-90">
        <NexusGlobe interactive={true} />
      </div>

      {/* Subtle Gradient Overlays for readable text */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/50 to-transparent pointer-events-none max-w-3xl" />

      {/* Hero Content Layer */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 pb-16 flex-1 flex flex-col justify-between pointer-events-none">
        <div className="max-w-2xl space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono tracking-wider backdrop-blur-md pointer-events-auto">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>NEXUS AUTONOMOUS MESH v3.8</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Planetary Scale{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-violet-400">
              AI Command
            </span>{' '}
            Infrastructure
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            Real-time planetary orchestration for distributed large language models,
            autonomous BGP edge failover, and sub-30ms global inference telemetry across
            12 continental data hubs.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2 pointer-events-auto">
            <button
              onClick={() => setTab('overview')}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-semibold tracking-wide flex items-center gap-2.5 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Launch Command Center</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setTab('globe')}
              className="px-6 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-cyan-300 border border-cyan-500/30 hover:border-cyan-500/60 font-semibold tracking-wide flex items-center gap-2 backdrop-blur-md transition-all hover:scale-[1.02]"
            >
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>Explore 3D Mesh</span>
            </button>
          </div>

          {/* Live Telemetry KPI pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-cyan-500/20 max-w-xl pointer-events-auto backdrop-blur-md p-3 rounded-2xl bg-slate-950/40">
            <div>
              <div className="text-[11px] font-mono text-slate-400">THROUGHPUT</div>
              <div className="text-lg font-bold text-white font-mono">
                {formatNumber(currentStats.totalRequestsPerSec)}
                <span className="text-xs text-cyan-400 ml-1">r/s</span>
              </div>
            </div>

            <div>
              <div className="text-[11px] font-mono text-slate-400">P95 LATENCY</div>
              <div className="text-lg font-bold text-emerald-400 font-mono">
                {formatLatency(currentStats.avgLatencyMs)}
              </div>
            </div>

            <div>
              <div className="text-[11px] font-mono text-slate-400">EDGE CLUSTERS</div>
              <div className="text-lg font-bold text-cyan-400 font-mono">
                {nodes.length}
                <span className="text-xs text-slate-400 ml-1">Nodes</span>
              </div>
            </div>

            <div>
              <div className="text-[11px] font-mono text-slate-400">GLOBAL UPTIME</div>
              <div className="text-lg font-bold text-violet-400 font-mono">
                {currentStats.globalHealth}%
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-10 pointer-events-auto">
          <div
            onClick={() => setTab('globe')}
            className="p-4 rounded-xl bg-slate-950/70 hover:bg-slate-900/80 border border-cyan-500/20 hover:border-cyan-500/50 backdrop-blur-md transition-all cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3 group-hover:scale-110 transition-transform">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-white tracking-wide flex items-center justify-between">
              <span>Interactive 3D Edge Map</span>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Planetary coordinates, realtime flight arcs, node latency telemetry and
              failover routing drills.
            </p>
          </div>

          <div
            onClick={() => setTab('analytics')}
            className="p-4 rounded-xl bg-slate-950/70 hover:bg-slate-900/80 border border-cyan-500/20 hover:border-cyan-500/50 backdrop-blur-md transition-all cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400 mb-3 group-hover:scale-110 transition-transform">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-white tracking-wide flex items-center justify-between">
              <span>Telemetry Visualizations</span>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-violet-400 transition-colors" />
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Token throughput, P50/P95/P99 latency distributions, and regional compute
              utilization charts.
            </p>
          </div>

          <div
            onClick={() => setTab('assistant')}
            className="p-4 rounded-xl bg-slate-950/70 hover:bg-slate-900/80 border border-cyan-500/20 hover:border-cyan-500/50 backdrop-blur-md transition-all cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3 group-hover:scale-110 transition-transform">
              <Terminal className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-white tracking-wide flex items-center justify-between">
              <span>Autonomous AI Copilot</span>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Natural language diagnostics, automated BGP rebalancing, and cluster
              incident triage assistance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
