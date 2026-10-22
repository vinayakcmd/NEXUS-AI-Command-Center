import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNexusStore } from '../../store/useNexusStore';
import {
  Search,
  Command,
  Globe,
  LayoutDashboard,
  BarChart3,
  Terminal,
  Bot,
  Settings,
  Zap,
  RefreshCw,
  AlertTriangle,
  Download,
  Volume2,
  Sparkles,
  MapPin,
  X,
} from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface ActionItem {
  id: string;
  title: string;
  subtitle?: string;
  category: 'Navigation' | 'Nodes' | 'System Ops' | 'Settings';
  icon: React.ElementType;
  action: () => void;
}

export function CommandPalette() {
  const isOpen = useNexusStore((s) => s.isCommandPaletteOpen);
  const setIsOpen = useNexusStore((s) => s.setIsCommandPaletteOpen);
  const setTab = useNexusStore((s) => s.setTab);
  const nodes = useNexusStore((s) => s.nodes);
  const setSelectedNodeId = useNexusStore((s) => s.setSelectedNodeId);
  const purgeInferenceCache = useNexusStore((s) => s.purgeInferenceCache);
  const rebalanceTraffic = useNexusStore((s) => s.rebalanceTraffic);
  const generateSimulatedIncident = useNexusStore((s) => s.generateSimulatedIncident);
  const settings = useNexusStore((s) => s.settings);
  const updateSettings = useNexusStore((s) => s.updateSettings);
  const addToast = useNexusStore((s) => s.addToast);
  const telemetryHistory = useNexusStore((s) => s.telemetryHistory);

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global keyboard listener for Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen(!isOpen);
      } else if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, setIsOpen]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Export telemetry data as JSON
  const handleExportTelemetry = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      nodes,
      telemetryHistory,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexus-telemetry-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    soundManager.playExecute();
    addToast({
      title: 'Telemetry Exported',
      message: 'JSON file saved to your device.',
      type: 'success',
    });
  };

  // Build searchable items
  const items: ActionItem[] = useMemo(() => {
    const list: ActionItem[] = [
      // Navigation
      {
        id: 'nav-landing',
        title: 'Launch Page / Hero Showcase',
        subtitle: 'Go to 3D cinematic hero landing view',
        category: 'Navigation',
        icon: Sparkles,
        action: () => setTab('landing'),
      },
      {
        id: 'nav-overview',
        title: 'Dashboard Overview',
        subtitle: 'Telemetry KPI meters, system health, active models',
        category: 'Navigation',
        icon: LayoutDashboard,
        action: () => setTab('overview'),
      },
      {
        id: 'nav-globe',
        title: 'Interactive 3D Edge Globe',
        subtitle: 'Inspect worldwide planetary datacenter mesh',
        category: 'Navigation',
        icon: Globe,
        action: () => setTab('globe'),
      },
      {
        id: 'nav-analytics',
        title: 'Telemetry & Inferences Analytics',
        subtitle: 'Token usage, latency distribution, regional throughput',
        category: 'Navigation',
        icon: BarChart3,
        action: () => setTab('analytics'),
      },
      {
        id: 'nav-events',
        title: 'System Event Logs & Audit Feed',
        subtitle: 'Live filterable security, cluster, and model ops stream',
        category: 'Navigation',
        icon: Terminal,
        action: () => setTab('events'),
      },
      {
        id: 'nav-assistant',
        title: 'NEXUS Copilot (AI Ops Assistant)',
        subtitle: 'Autonomous diagnostic conversation & query agent',
        category: 'Navigation',
        icon: Bot,
        action: () => setTab('assistant'),
      },
      {
        id: 'nav-settings',
        title: 'System Calibration & Settings',
        subtitle: 'Manage 3D visual parameters, fallback mode, sound',
        category: 'Navigation',
        icon: Settings,
        action: () => setTab('settings'),
      },

      // System Operations
      {
        id: 'op-cache',
        title: 'Flush Distributed KV-Cache',
        subtitle: 'Purge GPU matrix memory across 12 edge nodes',
        category: 'System Ops',
        icon: Zap,
        action: purgeInferenceCache,
      },
      {
        id: 'op-rebalance',
        title: 'Rebalance Planetary BGP Traffic',
        subtitle: 'Optimize optical routing paths to minimize latency',
        category: 'System Ops',
        icon: RefreshCw,
        action: rebalanceTraffic,
      },
      {
        id: 'op-incident',
        title: 'Inject Synthetic Latency Drill',
        subtitle: 'Trigger simulated cluster incident to verify auto-failover',
        category: 'System Ops',
        icon: AlertTriangle,
        action: generateSimulatedIncident,
      },
      {
        id: 'op-export',
        title: 'Export Cluster Telemetry Payload',
        subtitle: 'Download complete state JSON file',
        category: 'System Ops',
        icon: Download,
        action: handleExportTelemetry,
      },
      {
        id: 'set-rotate',
        title: settings.autoRotate ? 'Pause 3D Globe Auto-Rotation' : 'Resume 3D Globe Auto-Rotation',
        subtitle: 'Toggle continuous planetary rotation',
        category: 'Settings',
        icon: Globe,
        action: () => updateSettings({ autoRotate: !settings.autoRotate }),
      },
      {
        id: 'set-sound',
        title: settings.soundEnabled ? 'Mute Interface Sound Effects' : 'Enable Interface Sound Effects',
        subtitle: 'Toggle synthesizer Web Audio feedback',
        category: 'Settings',
        icon: Volume2,
        action: () => updateSettings({ soundEnabled: !settings.soundEnabled }),
      },
    ];

    // Add nodes
    nodes.forEach((node) => {
      list.push({
        id: `node-${node.id}`,
        title: `${node.city} Edge Hub (${node.name})`,
        subtitle: `${node.datacenter} • ${node.region} • ${node.latencyMs}ms • ${node.status.toUpperCase()}`,
        category: 'Nodes',
        icon: MapPin,
        action: () => {
          setSelectedNodeId(node.id);
          setTab('globe');
        },
      });
    });

    return list;
  }, [nodes, settings, setTab, setSelectedNodeId, purgeInferenceCache, rebalanceTraffic, generateSimulatedIncident, updateSettings]);

  // Filter based on query
  const filteredItems = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
        item.category.toLowerCase().includes(q)
    );
  }, [items, query]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev === 0 ? Math.max(0, filteredItems.length - 1) : prev - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
        setIsOpen(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/75 backdrop-blur-md animate-in fade-in"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="w-full max-w-2xl bg-slate-950/95 border border-cyan-500/40 rounded-2xl shadow-2xl shadow-cyan-950/60 overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-cyan-500/20 bg-slate-900/50">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search commands, edge hubs, telemetry views..."
            className="w-full bg-transparent border-none text-white placeholder-slate-500 text-sm focus:outline-none font-mono"
          />
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-slate-500 font-mono text-xs">
              No matching commands or edge hubs found.
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const Icon = item.icon;
              const isSelected = index === selectedIndex;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    item.action();
                    setIsOpen(false);
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-all ${
                    isSelected
                      ? 'bg-cyan-500/15 border border-cyan-500/40 text-cyan-200'
                      : 'border border-transparent text-slate-300 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-2 rounded-lg shrink-0 ${
                        isSelected
                          ? 'bg-cyan-500/20 text-cyan-300'
                          : 'bg-slate-900 text-slate-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium tracking-wide truncate">
                        {item.title}
                      </div>
                      {item.subtitle && (
                        <div className="text-xs text-slate-400 truncate font-mono">
                          {item.subtitle}
                        </div>
                      )}
                    </div>
                  </div>

                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 font-mono uppercase shrink-0 ml-2">
                    {item.category}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-slate-900/60 border-t border-cyan-500/20 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-4">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span className="text-cyan-400">NEXUS HUD v3.8</span>
        </div>
      </div>
    </div>
  );
}
