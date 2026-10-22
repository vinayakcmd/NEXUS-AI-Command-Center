import React from 'react';
import { useNexusStore } from '../store/useNexusStore';
import { NexusGlobe } from '../components/3d/NexusGlobe';
import {
  Activity,
  Zap,
  Cpu,
  HardDrive,
  Wifi,
  ShieldCheck,
  TrendingUp,
  ArrowUpRight,
  RefreshCw,
  AlertTriangle,
  Layers,
  Sparkles,
  Server,
  DollarSign,
  ChevronRight,
} from 'lucide-react';
import {
  formatNumber,
  formatLatency,
  formatCurrency,
  formatPercent,
  getStatusColor,
  formatTimestamp,
} from '../utils/formatters';

export function DashboardView() {
  const currentStats = useNexusStore((s) => s.currentStats);
  const nodes = useNexusStore((s) => s.nodes);
  const events = useNexusStore((s) => s.events);
  const setTab = useNexusStore((s) => s.setTab);
  const setSelectedNodeId = useNexusStore((s) => s.setSelectedNodeId);
  const purgeInferenceCache = useNexusStore((s) => s.purgeInferenceCache);
  const rebalanceTraffic = useNexusStore((s) => s.rebalanceTraffic);
  const generateSimulatedIncident = useNexusStore((s) => s.generateSimulatedIncident);
  const addToast = useNexusStore((s) => s.addToast);

  const onlineNodes = nodes.filter((n) => n.status === 'online').length;
  const degradedNodes = nodes.filter((n) => n.status === 'degraded').length;

  const foundationModels = [
    {
      name: 'Nexus-Prime-70B',
      version: 'v2.4-FP8',
      nodesCount: 12,
      rps: '18,420 r/s',
      latency: '18.2ms',
      cost: '$0.40/1M tok',
      status: 'active',
      vram: '91%',
    },
    {
      name: 'Claude-3.5-Sonnet',
      version: 'anthropic-mesh',
      nodesCount: 6,
      rps: '9,810 r/s',
      latency: '24.6ms',
      cost: '$3.00/1M tok',
      status: 'active',
      vram: '84%',
    },
    {
      name: 'GPT-4o-Turbo',
      version: 'openai-edge-proxy',
      nodesCount: 5,
      rps: '8,450 r/s',
      latency: '26.8ms',
      cost: '$2.50/1M tok',
      status: 'active',
      vram: '78%',
    },
    {
      name: 'DeepSeek-R1',
      version: 'deepseek-reasoner-fp8',
      nodesCount: 4,
      rps: '3,890 r/s',
      latency: '34.2ms',
      cost: '$0.55/1M tok',
      status: 'active',
      vram: '88%',
    },
    {
      name: 'Llama-3.3-70B',
      version: 'meta-distrib',
      nodesCount: 5,
      rps: '2,920 r/s',
      latency: '22.1ms',
      cost: '$0.35/1M tok',
      status: 'active',
      vram: '72%',
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner Notice */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/60 border border-cyan-500/20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white tracking-wide">
              Global Compute Mesh Operating at Peak Efficiency
            </h2>
            <p className="text-xs text-slate-400">
              Autonomous load rebalancing active across 12 edge points of presence.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <button
            onClick={purgeInferenceCache}
            className="flex-1 sm:flex-none px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-cyan-300 border border-cyan-500/30 transition-all flex items-center justify-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Purge Cache</span>
          </button>
          <button
            onClick={rebalanceTraffic}
            className="flex-1 sm:flex-none px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 border border-slate-700 transition-all flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
            <span>Rebalance Mesh</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Throughput */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-cyan-500/20 backdrop-blur-md relative overflow-hidden group hover:border-cyan-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-400 tracking-wider uppercase">
              Throughput
            </span>
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white tracking-tight">
            {formatNumber(currentStats.totalRequestsPerSec)}
            <span className="text-xs text-cyan-400 ml-1.5 font-sans font-normal">req/s</span>
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-emerald-400 font-mono">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+8.4% vs last hr</span>
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl group-hover:bg-cyan-500/10 transition-colors" />
        </div>

        {/* Card 2: Active Inferences */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-cyan-500/20 backdrop-blur-md relative overflow-hidden group hover:border-cyan-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-400 tracking-wider uppercase">
              Active Inferences
            </span>
            <div className="p-1.5 rounded-lg bg-violet-500/10 text-violet-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white tracking-tight">
            {formatNumber(currentStats.activeInferences)}
            <span className="text-xs text-violet-400 ml-1.5 font-sans font-normal">concurrent</span>
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-slate-400 font-mono">
            <span>Tokens: {formatNumber(currentStats.tokensPerSecond)}/s</span>
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-violet-500/5 rounded-full blur-xl group-hover:bg-violet-500/10 transition-colors" />
        </div>

        {/* Card 3: P95 Latency */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-cyan-500/20 backdrop-blur-md relative overflow-hidden group hover:border-cyan-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-400 tracking-wider uppercase">
              P95 Latency
            </span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Wifi className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 tracking-tight">
            {formatLatency(currentStats.avgLatencyMs)}
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-emerald-400 font-mono">
            <span>Sub-35ms SLA: 100% compliant</span>
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-colors" />
        </div>

        {/* Card 4: Global Availability */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-cyan-500/20 backdrop-blur-md relative overflow-hidden group hover:border-cyan-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-400 tracking-wider uppercase">
              Global Health
            </span>
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white tracking-tight">
            {currentStats.globalHealth}%
            <span className="text-xs text-emerald-400 ml-1.5 font-mono">NOMINAL</span>
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-slate-400 font-mono">
            <span>{onlineNodes}/{nodes.length} Clusters Online</span>
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-500/5 rounded-full blur-xl group-hover:bg-blue-500/10 transition-colors" />
        </div>
      </div>

      {/* Middle Row: Hardware Resource Gauges & Planetary Mesh Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Hardware Resource Load */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-slate-950/70 border border-cyan-500/20 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-cyan-500/15 pb-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-white tracking-wide font-mono uppercase">
                Cluster Matrix Saturation
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">12 DATACENTERS POOLED</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {/* GPU Compute Load */}
            <div className="p-3.5 rounded-xl bg-slate-900/50 border border-cyan-500/10 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300">GPU Matrix Compute</span>
                <span className="text-cyan-400 font-bold">{currentStats.gpuComputeLoad}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${currentStats.gpuComputeLoad}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>Total: 4,096 H100s</span>
                <span>Headroom: ~32%</span>
              </div>
            </div>

            {/* Neural Engine TPS */}
            <div className="p-3.5 rounded-xl bg-slate-900/50 border border-cyan-500/10 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300">Distributed Token Rate</span>
                <span className="text-violet-400 font-bold">
                  {formatNumber(currentStats.tokensPerSecond)} tps
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-violet-500 to-purple-400 h-full rounded-full transition-all duration-500"
                  style={{ width: '74%' }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>Target: 250k tps</span>
                <span>Saturation: 74%</span>
              </div>
            </div>

            {/* Network Ingress / Egress */}
            <div className="p-3.5 rounded-xl bg-slate-900/50 border border-cyan-500/10 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300">Fiber Mesh Bandwidth</span>
                <span className="text-emerald-400 font-bold">
                  {currentStats.networkBandwidthGbps} Gbps
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                  style={{ width: '58%' }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>Peak Limit: 100 Gbps</span>
                <span>Packet Loss: 0.00%</span>
              </div>
            </div>

            {/* Hourly Inference Cost */}
            <div className="p-3.5 rounded-xl bg-slate-900/50 border border-cyan-500/10 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300">Burn Rate / Cost</span>
                <span className="text-amber-400 font-bold">
                  {formatCurrency(currentStats.costPerHour)}/hr
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-500 to-orange-400 h-full rounded-full transition-all duration-500"
                  style={{ width: '48%' }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>Budget: $100.00/hr</span>
                <span>Efficiency: +14%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Planetary 3D Globe Card */}
        <div className="p-5 rounded-xl bg-slate-950/70 border border-cyan-500/20 backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-cyan-500/15 pb-3 mb-3">
              <h3 className="text-sm font-semibold text-white tracking-wide font-mono uppercase">
                Planetary Mesh Preview
              </h3>
              <button
                onClick={() => setTab('globe')}
                className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
              >
                Expand <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-2">
              12 distributed compute nodes mapped across 5 continents.
            </p>
          </div>

          {/* Embedded Miniature Interactive Globe */}
          <div className="h-56 w-full rounded-lg overflow-hidden border border-cyan-500/20 relative my-2 bg-slate-950">
            <NexusGlobe interactive={true} />
            <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded bg-slate-950/80 border border-cyan-500/30 text-[10px] font-mono text-cyan-300">
              INTERACTIVE 3D
            </div>
          </div>

          <button
            onClick={() => setTab('globe')}
            className="w-full mt-2 py-2.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-semibold flex items-center justify-center gap-2 transition-all"
          >
            <span>Open Full Command Globe</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Foundation Models Table & Recent Incidents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Model Registry (2 cols) */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-slate-950/70 border border-cyan-500/20 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-cyan-500/15 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-violet-400" />
              <h3 className="text-sm font-semibold text-white tracking-wide font-mono uppercase">
                Active Distributed Model Deployments
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">5 MODELS HOT IN VRAM</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-cyan-500/10 text-slate-400">
                  <th className="pb-2">Model Family</th>
                  <th className="pb-2">Throughput</th>
                  <th className="pb-2">Avg Latency</th>
                  <th className="pb-2">VRAM Saturation</th>
                  <th className="pb-2">Replicas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyan-500/10 text-slate-300">
                {foundationModels.map((m) => (
                  <tr key={m.name} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-2.5">
                      <div className="font-semibold text-white">{m.name}</div>
                      <div className="text-[10px] text-slate-500">{m.version}</div>
                    </td>
                    <td className="py-2.5 text-cyan-400">{m.rps}</td>
                    <td className="py-2.5 text-emerald-400">{m.latency}</td>
                    <td className="py-2.5">
                      <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                        {m.vram}
                      </span>
                    </td>
                    <td className="py-2.5 text-slate-400">{m.nodesCount} Clusters</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Events Ticker (1 col) */}
        <div className="p-5 rounded-xl bg-slate-950/70 border border-cyan-500/20 backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-cyan-500/15 pb-3 mb-3">
              <h3 className="text-sm font-semibold text-white tracking-wide font-mono uppercase">
                Telemetry Log Stream
              </h3>
              <button
                onClick={() => setTab('events')}
                className="text-xs font-mono text-cyan-400 hover:underline"
              >
                All Logs →
              </button>
            </div>

            <div className="space-y-3">
              {events.slice(0, 3).map((evt) => (
                <div
                  key={evt.id}
                  onClick={() => setTab('events')}
                  className="p-3 rounded-lg bg-slate-900/50 border border-cyan-500/10 hover:border-cyan-500/30 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                    <span
                      className={`px-1.5 py-0.5 rounded uppercase font-semibold ${getStatusColor(
                        evt.severity
                      )}`}
                    >
                      {evt.severity}
                    </span>
                    <span className="text-slate-500">{formatTimestamp(evt.timestamp)}</span>
                  </div>
                  <div className="text-xs font-medium text-slate-200 truncate">
                    {evt.title}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                    {evt.description}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={generateSimulatedIncident}
            className="w-full mt-4 py-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-mono font-medium flex items-center justify-center gap-1.5 transition-all"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Simulate Failover Drill</span>
          </button>
        </div>
      </div>
    </div>
  );
}
