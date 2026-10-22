import React, { useState } from 'react';
import { useNexusStore } from '../store/useNexusStore';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  BarChart3,
  Download,
  Calendar,
  Layers,
  Activity,
  Zap,
  DollarSign,
  Cpu,
} from 'lucide-react';
import {
  formatNumber,
  formatLatency,
  formatCurrency,
  formatTimestamp,
} from '../utils/formatters';

export function AnalyticsView() {
  const telemetryHistory = useNexusStore((s) => s.telemetryHistory);
  const currentStats = useNexusStore((s) => s.currentStats);
  const nodes = useNexusStore((s) => s.nodes);
  const addToast = useNexusStore((s) => s.addToast);

  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('1h');
  const [activeMetricTab, setActiveMetricTab] = useState<'throughput' | 'latency' | 'tokens'>('throughput');

  // Chart formatted data
  const chartData = telemetryHistory.map((item, idx) => ({
    time: formatTimestamp(item.timestamp),
    requests: item.requests,
    inferences: item.inferences,
    p50: item.p50Latency,
    p95: item.p95Latency,
    p99: item.p99Latency,
    tokenInput: Math.round(item.tokenInput / 1000), // in k tokens
    tokenOutput: Math.round(item.tokenOutput / 1000),
    cost: item.costPerHour,
  }));

  // Regional load aggregation
  const regionalData = [
    { region: 'North America', nodesCount: 2, tps: 10050, fill: '#00f5ff' },
    { region: 'Europe', nodesCount: 3, tps: 10520, fill: '#38bdf8' },
    { region: 'Asia Pacific', nodesCount: 4, tps: 14430, fill: '#818cf8' },
    { region: 'Middle East', nodesCount: 1, tps: 2780, fill: '#a855f7' },
    { region: 'South America', nodesCount: 1, tps: 1840, fill: '#f43f5e' },
    { region: 'Africa', nodesCount: 1, tps: 1120, fill: '#f59e0b' },
  ];

  // Foundation Model Distribution
  const modelShareData = [
    { name: 'Nexus-Prime-70B', value: 44, color: '#00f5ff' },
    { name: 'Claude-3.5-Sonnet', value: 24, color: '#a855f7' },
    { name: 'GPT-4o-Turbo', value: 18, color: '#38bdf8' },
    { name: 'DeepSeek-R1', value: 9, color: '#10b981' },
    { name: 'Llama-3.3-70B', value: 5, color: '#f59e0b' },
  ];

  // Export CSV
  const handleExportCsv = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Timestamp,Requests_Per_Sec,Inferences,P50_ms,P95_ms,P99_ms,Cost_PerHour\n';
    telemetryHistory.forEach((row) => {
      csvContent += `${row.timestamp},${row.requests},${row.inferences},${row.p50Latency},${row.p95Latency},${row.p99Latency},${row.costPerHour}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `nexus-telemetry-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast({
      title: 'Analytics Exported',
      message: 'Telemetry CSV downloaded successfully.',
      type: 'success',
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header with Time Selector & Export */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-950/70 border border-cyan-500/20 backdrop-blur-md">
        <div>
          <h2 className="text-base font-bold text-white tracking-wide font-mono uppercase flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <span>Telemetry & Inferences Intelligence</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time multi-dimensional time series metrics and model allocation.
          </p>
        </div>

        <div className="flex items-center gap-3 self-stretch sm:self-auto">
          {/* Time Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-cyan-500/20 text-xs font-mono">
            {(['1h', '24h', '7d', '30d'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1 rounded-lg transition-all ${
                  timeRange === r
                    ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Export CSV Button */}
          <button
            onClick={handleExportCsv}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/30 text-cyan-300 text-xs font-mono flex items-center gap-1.5 transition-all shadow-md"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Main Chart Card */}
      <div className="p-5 rounded-xl bg-slate-950/80 border border-cyan-500/20 backdrop-blur-md space-y-4">
        {/* Metric Sub-Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-500/15 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveMetricTab('throughput')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                activeMetricTab === 'throughput'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Throughput & Inferences
            </button>
            <button
              onClick={() => setActiveMetricTab('latency')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                activeMetricTab === 'latency'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Latency Percentiles (p50 / p95 / p99)
            </button>
            <button
              onClick={() => setActiveMetricTab('tokens')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                activeMetricTab === 'tokens'
                  ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Token Input vs Output (k Tokens)
            </button>
          </div>

          <div className="text-xs font-mono text-cyan-400">
            Current Avg: {formatNumber(currentStats.totalRequestsPerSec)} req/s
          </div>
        </div>

        {/* Dynamic Chart Area */}
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {activeMetricTab === 'throughput' ? (
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="reqGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f5ff" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#00f5ff" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="infGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(56, 189, 248, 0.08)" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(5, 10, 24, 0.95)',
                    borderColor: 'rgba(0, 245, 255, 0.3)',
                    borderRadius: '0.75rem',
                    color: '#f0f6fc',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12, fontFamily: 'monospace' }} />
                <Area
                  type="monotone"
                  dataKey="requests"
                  name="Inbound Requests"
                  stroke="#00f5ff"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#reqGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="inferences"
                  name="Model Inferences"
                  stroke="#a855f7"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#infGrad)"
                />
              </AreaChart>
            ) : activeMetricTab === 'latency' ? (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(56, 189, 248, 0.08)" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11, fill: '#64748b' }} unit="ms" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(5, 10, 24, 0.95)',
                    borderColor: 'rgba(0, 245, 255, 0.3)',
                    borderRadius: '0.75rem',
                    color: '#f0f6fc',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12, fontFamily: 'monospace' }} />
                <Line
                  type="monotone"
                  dataKey="p50"
                  name="p50 Latency"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="p95"
                  name="p95 Latency"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="p99"
                  name="p99 Latency (Tail)"
                  stroke="#f43f5e"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            ) : (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(56, 189, 248, 0.08)" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11, fill: '#64748b' }} unit="k" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(5, 10, 24, 0.95)',
                    borderColor: 'rgba(0, 245, 255, 0.3)',
                    borderRadius: '0.75rem',
                    color: '#f0f6fc',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12, fontFamily: 'monospace' }} />
                <Bar dataKey="tokenInput" name="Input Tokens (k)" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="tokenOutput" name="Output Tokens (k)" fill="#a855f7" radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Grid: Regional Throughput & Model Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Regional Bar Chart */}
        <div className="p-5 rounded-xl bg-slate-950/80 border border-cyan-500/20 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-cyan-500/15 pb-3">
            <h3 className="text-sm font-semibold text-white tracking-wide font-mono uppercase">
              Continental Throughput Distribution (TPS)
            </h3>
            <span className="text-xs font-mono text-cyan-400">12 CLUSTERS</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={regionalData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(56, 189, 248, 0.08)" />
                <XAxis type="number" stroke="#64748b" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis
                  dataKey="region"
                  type="category"
                  stroke="#64748b"
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  width={90}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(5, 10, 24, 0.95)',
                    borderColor: 'rgba(0, 245, 255, 0.3)',
                    borderRadius: '0.75rem',
                    color: '#f0f6fc',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                  }}
                  formatter={(value: any) => [`${value} TPS`, 'Throughput']}
                />
                <Bar dataKey="tps" radius={[0, 4, 4, 0]}>
                  {regionalData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Model Family Share (Donut Chart) */}
        <div className="p-5 rounded-xl bg-slate-950/80 border border-cyan-500/20 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-cyan-500/15 pb-3">
            <h3 className="text-sm font-semibold text-white tracking-wide font-mono uppercase">
              Foundation Model Compute Share
            </h3>
            <span className="text-xs font-mono text-violet-400">100% POOLED</span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={modelShareData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {modelShareData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#050914" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(5, 10, 24, 0.95)',
                    borderColor: 'rgba(0, 245, 255, 0.3)',
                    borderRadius: '0.75rem',
                    color: '#f0f6fc',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                  }}
                  formatter={(value: any) => [`${value}%`, 'Share']}
                />
                <Legend
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                  wrapperStyle={{ fontSize: 11, fontFamily: 'monospace' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
