import React from 'react';
import { useNexusStore } from '../../store/useNexusStore';
import { Activity, Zap, Cpu, HardDrive, Wifi, ShieldCheck, AlertCircle } from 'lucide-react';
import { formatNumber, formatLatency } from '../../utils/formatters';

export function TelemetryTicker() {
  const currentStats = useNexusStore((s) => s.currentStats);
  const nodes = useNexusStore((s) => s.nodes);
  const settings = useNexusStore((s) => s.settings);

  const onlineNodes = nodes.filter((n) => n.status === 'online').length;

  return (
    <div className="w-full bg-slate-950/90 border-b border-cyan-500/20 px-4 py-1.5 flex items-center justify-between text-xs font-mono overflow-x-auto no-scrollbar backdrop-blur-md z-20">
      {/* Simulation Badge */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-[10px] tracking-wider uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          <span>Simulated Telemetry • Live</span>
        </div>
      </div>

      {/* Metric Stream Items */}
      <div className="flex items-center gap-6 px-4 shrink-0 text-slate-300">
        <div className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-slate-400">RPS:</span>
          <span className="text-white font-semibold">{formatNumber(currentStats.totalRequestsPerSec)}/s</span>
        </div>

        <div className="flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-400">Inferences:</span>
          <span className="text-white font-semibold">{formatNumber(currentStats.activeInferences)}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <Wifi className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-slate-400">Avg Latency:</span>
          <span className="text-white font-semibold">{formatLatency(currentStats.avgLatencyMs)}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-violet-400" />
          <span className="text-slate-400">GPU Matrix:</span>
          <span className="text-white font-semibold">{currentStats.gpuComputeLoad}%</span>
        </div>

        <div className="flex items-center gap-1.5">
          <HardDrive className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-slate-400">Bandwidth:</span>
          <span className="text-white font-semibold">{currentStats.networkBandwidthGbps} Gbps</span>
        </div>

        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-slate-400">Clusters:</span>
          <span className="text-emerald-400 font-semibold">{onlineNodes}/{nodes.length} Online</span>
        </div>
      </div>

      {/* Health Indicator */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
          <span>{currentStats.globalHealth}% UPTIME</span>
        </div>
      </div>
    </div>
  );
}
