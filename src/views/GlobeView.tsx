import React, { useState, useMemo } from 'react';
import { useNexusStore } from '../store/useNexusStore';
import { NexusGlobe } from '../components/3d/NexusGlobe';
import {
  Search,
  Filter,
  MapPin,
  Wifi,
  Cpu,
  Layers,
  X,
  Radio,
  Zap,
  Activity,
  AlertTriangle,
  Server,
  Share2,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import {
  formatNumber,
  formatLatency,
  getStatusColor,
  formatDateTime,
} from '../utils/formatters';

export function GlobeView() {
  const nodes = useNexusStore((s) => s.nodes);
  const selectedNodeId = useNexusStore((s) => s.selectedNodeId);
  const setSelectedNodeId = useNexusStore((s) => s.setSelectedNodeId);
  const pingNode = useNexusStore((s) => s.pingNode);
  const toggleNodeFailover = useNexusStore((s) => s.toggleNodeFailover);
  const setTab = useNexusStore((s) => s.setTab);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'degraded'>('all');

  // Regions list
  const regions = ['All', 'North America', 'Europe', 'Asia Pacific', 'South America', 'Middle East', 'Africa'];

  // Filtered nodes
  const filteredNodes = useMemo(() => {
    return nodes.filter((n) => {
      const matchesSearch =
        n.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.datacenter.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRegion =
        selectedRegion === 'All' || n.region.includes(selectedRegion);

      const matchesStatus =
        statusFilter === 'all' || n.status === statusFilter;

      return matchesSearch && matchesRegion && matchesStatus;
    });
  }, [nodes, searchQuery, selectedRegion, statusFilter]);

  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId) || null,
    [nodes, selectedNodeId]
  );

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] overflow-hidden bg-slate-950">
      {/* 3D Globe Layer */}
      <div className="absolute inset-0 z-0">
        <NexusGlobe onSelectNode={(id) => setSelectedNodeId(id)} interactive={true} />
      </div>

      {/* Floating Top Control Bar */}
      <div className="absolute top-4 left-4 right-4 sm:right-auto z-20 max-w-2xl">
        <div className="p-2.5 rounded-2xl bg-slate-950/85 border border-cyan-500/30 backdrop-blur-xl shadow-2xl space-y-2">
          {/* Search & Status Toggles */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search nodes, cities, datacenters..."
                className="w-full bg-slate-900/80 border border-cyan-500/20 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Status pills */}
            <div className="flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-cyan-500/20">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2 py-1 rounded-lg text-[11px] font-mono transition-all ${
                  statusFilter === 'all'
                    ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All ({nodes.length})
              </button>
              <button
                onClick={() => setStatusFilter('online')}
                className={`px-2 py-1 rounded-lg text-[11px] font-mono transition-all ${
                  statusFilter === 'online'
                    ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Online ({nodes.filter((n) => n.status === 'online').length})
              </button>
            </div>
          </div>

          {/* Region Quick Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 text-[11px] font-mono">
            {regions.map((region) => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`px-2.5 py-0.5 rounded-md whitespace-nowrap transition-all ${
                  selectedRegion === region
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                }`}
              >
                {region}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Node Picker List (Bottom Left) */}
      <div className="hidden lg:block absolute bottom-6 left-6 z-10 w-72 max-h-56 overflow-y-auto p-2 rounded-xl bg-slate-950/80 border border-cyan-500/20 backdrop-blur-md shadow-xl space-y-1">
        <div className="text-[10px] font-mono text-cyan-400 px-2 py-1 uppercase tracking-wider">
          Planetary Clusters ({filteredNodes.length})
        </div>
        {filteredNodes.map((n) => (
          <button
            key={n.id}
            onClick={() => setSelectedNodeId(n.id)}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
              selectedNodeId === n.id
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-300 hover:bg-slate-900/60'
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  n.status === 'online' ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
              />
              <span className="font-semibold">{n.city}</span>
            </div>
            <span className="text-[10px] text-slate-500">{n.latencyMs}ms</span>
          </button>
        ))}
      </div>

      {/* Selected Node Inspection Drawer */}
      {selectedNode && (
        <div className="absolute top-4 right-4 bottom-6 z-30 w-full max-w-md p-4 flex flex-col pointer-events-none">
          <div className="pointer-events-auto h-full flex flex-col justify-between p-5 rounded-2xl bg-slate-950/95 border border-cyan-500/40 backdrop-blur-xl shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-200">
            {/* Top Details Header */}
            <div>
              <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <Server className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white font-mono tracking-wide">
                      {selectedNode.name}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {selectedNode.city}, {selectedNode.country}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedNodeId(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Status Badge & Region */}
              <div className="flex items-center justify-between mb-4 text-xs font-mono">
                <span
                  className={`px-2.5 py-1 rounded-full uppercase font-semibold text-[11px] border ${getStatusColor(
                    selectedNode.status
                  )}`}
                >
                  ● {selectedNode.status.toUpperCase()}
                </span>
                <span className="text-slate-400">{selectedNode.region}</span>
              </div>

              {/* Telemetry Stats Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4 text-xs font-mono">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-cyan-500/15">
                  <div className="text-slate-400 text-[10px]">ROUNDTRIP LATENCY</div>
                  <div className="text-lg font-bold text-emerald-400 mt-1">
                    {formatLatency(selectedNode.latencyMs)}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-cyan-500/15">
                  <div className="text-slate-400 text-[10px]">EDGE THROUGHPUT</div>
                  <div className="text-lg font-bold text-cyan-400 mt-1">
                    {formatNumber(selectedNode.tps)} tps
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-cyan-500/15">
                  <div className="text-slate-400 text-[10px]">CPU / CORE LOAD</div>
                  <div className="text-lg font-bold text-white mt-1">
                    {selectedNode.cpuLoad}%
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-cyan-500/15">
                  <div className="text-slate-400 text-[10px]">MEMORY / VRAM</div>
                  <div className="text-lg font-bold text-violet-400 mt-1">
                    {selectedNode.memoryLoad}%
                  </div>
                </div>
              </div>

              {/* Hardware & Mesh Info */}
              <div className="p-3 rounded-xl bg-slate-900/40 border border-cyan-500/15 space-y-2 mb-4 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Datacenter Facility:</span>
                  <span className="text-white font-semibold">{selectedNode.datacenter}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Gateway IP:</span>
                  <span className="text-cyan-400">{selectedNode.ipAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Coordinates:</span>
                  <span className="text-slate-300">
                    {selectedNode.lat.toFixed(2)}°, {selectedNode.lng.toFixed(2)}°
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Last Telemetry Echo:</span>
                  <span className="text-slate-400">{formatDateTime(selectedNode.lastPing)}</span>
                </div>
              </div>

              {/* Active AI Models Hosted */}
              <div className="mb-4">
                <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
                  Hot Foundation Models ({selectedNode.activeModels.length})
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedNode.activeModels.map((m) => (
                    <span
                      key={m}
                      className="px-2.5 py-1 rounded-lg bg-violet-500/15 border border-violet-500/30 text-violet-300 text-xs font-mono"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              {/* Connected Mesh Neighbors */}
              <div className="mb-4">
                <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
                  Connected Optical Links ({selectedNode.connections.length})
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedNode.connections.map((cId) => {
                    const neighbor = nodes.find((n) => n.id === cId);
                    if (!neighbor) return null;
                    return (
                      <button
                        key={cId}
                        onClick={() => setSelectedNodeId(cId)}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-cyan-500/20 border border-slate-700 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 text-xs font-mono flex items-center gap-1 transition-all"
                      >
                        <span>{neighbor.city}</span>
                        <ArrowRight className="w-3 h-3 text-cyan-400" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="space-y-2 pt-3 border-t border-cyan-500/20">
              <button
                onClick={() => pingNode(selectedNode.id)}
                className="w-full py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-300 text-xs font-mono font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-950/40"
              >
                <Radio className="w-3.5 h-3.5 text-cyan-400" />
                <span>Execute RTT Ping Test</span>
              </button>

              <button
                onClick={() => toggleNodeFailover(selectedNode.id)}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-mono flex items-center justify-center gap-2 transition-all"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {selectedNode.status === 'online'
                    ? 'Simulate Failover Divert'
                    : 'Restore Primary Status'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
