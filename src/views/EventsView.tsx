import React, { useState, useMemo } from 'react';
import { useNexusStore } from '../store/useNexusStore';
import { SystemEvent, EventSeverity, EventCategory } from '../types/nexus';
import {
  Terminal,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Info,
  AlertCircle,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  PlusCircle,
  X,
} from 'lucide-react';
import { formatDateTime, getStatusColor } from '../utils/formatters';

export function EventsView() {
  const events = useNexusStore((s) => s.events);
  const generateSimulatedIncident = useNexusStore((s) => s.generateSimulatedIncident);
  const addToast = useNexusStore((s) => s.addToast);

  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories: (EventCategory | 'all')[] = [
    'all',
    'Security',
    'Inference',
    'Cluster',
    'Routing',
    'Model Ops',
  ];

  const severities: (EventSeverity | 'all')[] = [
    'all',
    'critical',
    'warning',
    'info',
    'success',
  ];

  // Filtered & sorted events
  const filteredEvents = useMemo(() => {
    return events
      .filter((e) => {
        const matchesSearch =
          e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (e.region && e.region.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (e.nodeId && e.nodeId.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesSeverity =
          severityFilter === 'all' || e.severity === severityFilter;

        const matchesCategory =
          categoryFilter === 'all' || e.category === categoryFilter;

        return matchesSearch && matchesSeverity && matchesCategory;
      })
      .sort((a, b) => {
        const timeA = new Date(a.timestamp).getTime();
        const timeB = new Date(b.timestamp).getTime();
        return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
      });
  }, [events, searchQuery, severityFilter, categoryFilter, sortOrder]);

  const handleCopyJson = (event: SystemEvent) => {
    navigator.clipboard.writeText(JSON.stringify(event, null, 2));
    setCopiedId(event.id);
    addToast({
      title: 'Event Metadata Copied',
      message: 'Raw JSON payload copied to clipboard.',
      type: 'info',
      duration: 2000,
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getSeverityIcon = (sev: EventSeverity) => {
    switch (sev) {
      case 'critical':
        return <AlertCircle className="w-4 h-4 text-rose-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      default:
        return <Info className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-950/70 border border-cyan-500/20 backdrop-blur-md">
        <div>
          <h2 className="text-base font-bold text-white tracking-wide font-mono uppercase flex items-center gap-2">
            <Terminal className="w-5 h-5 text-cyan-400" />
            <span>Distributed Event Stream & Audit Log</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time audit log of security events, node failovers, and autonomous model operations.
          </p>
        </div>

        <button
          onClick={generateSimulatedIncident}
          className="px-4 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-mono font-semibold flex items-center gap-2 transition-all shadow-md self-stretch sm:self-auto justify-center"
        >
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          <span>Inject Synthetic Incident</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-500/20 backdrop-blur-md space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search event logs by keyword, region, or metadata..."
              className="w-full bg-slate-900/80 border border-cyan-500/20 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Order Selector */}
          <button
            onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/20 text-slate-300 text-xs font-mono flex items-center justify-center gap-1.5 transition-all"
          >
            <span>{sortOrder === 'newest' ? '↓ Newest First' : '↑ Oldest First'}</span>
          </button>
        </div>

        {/* Severity & Category Chips */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-cyan-500/10 text-xs font-mono">
          {/* Severity Filters */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
            <span className="text-slate-500 mr-1 text-[11px]">Severity:</span>
            {severities.map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-2.5 py-1 rounded-lg uppercase text-[11px] transition-all ${
                  severityFilter === sev
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>

          {/* Category Filters */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
            <span className="text-slate-500 mr-1 text-[11px]">Category:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-lg text-[11px] transition-all ${
                  categoryFilter === cat
                    ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-3">
        {filteredEvents.length === 0 ? (
          <div className="p-12 text-center rounded-xl bg-slate-950/60 border border-cyan-500/10 text-slate-500 font-mono text-xs">
            No events matched the current filter criteria.
          </div>
        ) : (
          filteredEvents.map((event) => {
            const isExpanded = expandedId === event.id;

            return (
              <div
                key={event.id}
                className={`rounded-xl border transition-all ${
                  isExpanded
                    ? 'bg-slate-900/90 border-cyan-500/40 shadow-xl shadow-cyan-950/30'
                    : 'bg-slate-950/70 border-cyan-500/15 hover:border-cyan-500/30 hover:bg-slate-900/50'
                }`}
              >
                {/* Event Row Main Header */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : event.id)}
                  className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 cursor-pointer"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 shrink-0 mt-0.5">
                      {getSeverityIcon(event.severity)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold border ${getStatusColor(
                            event.severity
                          )}`}
                        >
                          {event.severity}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                          {event.category}
                        </span>
                        {event.region && (
                          <span className="text-[11px] font-mono text-cyan-400">
                            [{event.region}]
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-semibold text-white tracking-wide">
                        {event.title}
                      </h4>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        {event.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center shrink-0 font-mono text-xs text-slate-400">
                    <span>{formatDateTime(event.timestamp)}</span>
                    <button className="p-1 rounded-md text-slate-400 hover:text-white">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expandable JSON Metadata Payload */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 border-t border-cyan-500/15 bg-slate-950/60 rounded-b-xl animate-in fade-in duration-150">
                    <div className="flex items-center justify-between py-2 text-xs font-mono text-slate-400">
                      <span>RAW EVENT METADATA PAYLOAD</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyJson(event);
                        }}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 hover:text-white text-xs font-mono transition-all"
                      >
                        {copiedId === event.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy JSON</span>
                          </>
                        )}
                      </button>
                    </div>

                    <pre className="p-3 rounded-lg bg-slate-900/90 border border-cyan-500/20 text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed">
                      {JSON.stringify(event, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
