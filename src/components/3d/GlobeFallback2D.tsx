import React from 'react';
import { useNexusStore } from '../../store/useNexusStore';
import { GlobeNode } from '../../types/nexus';
import { getStatusColor } from '../../utils/formatters';

interface GlobeFallback2DProps {
  onSelectNode?: (nodeId: string) => void;
}

export function GlobeFallback2D({ onSelectNode }: GlobeFallback2DProps) {
  const nodes = useNexusStore((s) => s.nodes);
  const selectedNodeId = useNexusStore((s) => s.selectedNodeId);
  const setSelectedNodeId = useNexusStore((s) => s.setSelectedNodeId);

  const handleSelect = (id: string) => {
    setSelectedNodeId(id);
    if (onSelectNode) onSelectNode(id);
  };

  // Convert lat/lng to 2D SVG equirectangular coordinates (0-1000 width, 0-500 height)
  const toSvgCoords = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 1000;
    const y = ((90 - lat) / 180) * 500;
    return { x, y };
  };

  return (
    <div className="relative w-full h-full min-h-[460px] flex items-center justify-center p-4 overflow-hidden rounded-xl bg-slate-950/70 border border-cyan-500/20 backdrop-blur-md">
      {/* Fallback mode indicator */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-cyan-500/30 text-xs text-cyan-300">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        <span className="font-mono text-[11px] tracking-wider uppercase">
          Digital 2D Map Telemetry HUD (Active)
        </span>
      </div>

      <div className="w-full max-w-5xl aspect-[2/1] relative">
        <svg
          viewBox="0 0 1000 500"
          className="w-full h-full drop-shadow-[0_0_25px_rgba(0,245,255,0.15)]"
        >
          {/* Subtle World Map Grid Lines */}
          <defs>
            <pattern
              id="grid-pattern"
              width="50"
              height="50"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 50 0 L 0 0 0 50"
                fill="none"
                stroke="rgba(56, 189, 248, 0.08)"
                strokeWidth="1"
              />
            </pattern>
            {/* Glow Filter */}
            <filter id="cyan-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Grid Background */}
          <rect width="1000" height="500" fill="url(#grid-pattern)" />
          <rect
            width="1000"
            height="500"
            fill="none"
            stroke="rgba(0, 245, 255, 0.2)"
            strokeWidth="1.5"
            rx="12"
          />

          {/* Latitude & Equator Reference Lines */}
          <line
            x1="0"
            y1="250"
            x2="1000"
            y2="250"
            stroke="rgba(0, 245, 255, 0.25)"
            strokeDasharray="4 4"
            strokeWidth="1"
          />
          <line
            x1="500"
            y1="0"
            x2="500"
            y2="500"
            stroke="rgba(0, 245, 255, 0.25)"
            strokeDasharray="4 4"
            strokeWidth="1"
          />

          {/* Connections / Flight Arcs */}
          {nodes.map((source) => {
            const p1 = toSvgCoords(source.lat, source.lng);
            return source.connections.map((targetId) => {
              const target = nodes.find((n) => n.id === targetId);
              if (!target) return null;
              const p2 = toSvgCoords(target.lat, target.lng);
              // Calculate curved quadratic SVG path
              const midX = (p1.x + p2.x) / 2;
              const midY = (p1.y + p2.y) / 2 - Math.abs(p1.x - p2.x) * 0.15;
              const pathData = `M ${p1.x} ${p1.y} Q ${midX} ${midY} ${p2.x} ${p2.y}`;

              return (
                <path
                  key={`${source.id}-${targetId}`}
                  d={pathData}
                  fill="none"
                  stroke="rgba(0, 245, 255, 0.25)"
                  strokeWidth="1.2"
                  strokeDasharray="4 3"
                />
              );
            });
          })}

          {/* Nodes */}
          {nodes.map((node) => {
            const { x, y } = toSvgCoords(node.lat, node.lng);
            const isSelected = selectedNodeId === node.id;
            const nodeColor =
              node.status === 'online'
                ? '#00f5ff'
                : node.status === 'degraded'
                ? '#f59e0b'
                : '#f43f5e';

            return (
              <g
                key={node.id}
                className="cursor-pointer transition-transform hover:scale-125"
                onClick={() => handleSelect(node.id)}
              >
                {/* Ping wave */}
                <circle
                  cx={x}
                  cy={y}
                  r="12"
                  fill="none"
                  stroke={nodeColor}
                  strokeWidth="1.5"
                  className="animate-ping opacity-60"
                  style={{ animationDuration: '3s' }}
                />

                {/* Outer ring */}
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? '8' : '5'}
                  fill="rgba(5, 10, 24, 0.85)"
                  stroke={isSelected ? '#ffffff' : nodeColor}
                  strokeWidth="2"
                  filter="url(#cyan-glow)"
                />

                {/* Center dot */}
                <circle cx={x} cy={y} r="2.5" fill={isSelected ? '#ffffff' : nodeColor} />

                {/* Node Label */}
                <text
                  x={x}
                  y={y - 12}
                  textAnchor="middle"
                  fill="#f0f6fc"
                  fontSize="11"
                  fontFamily="monospace"
                  fontWeight={isSelected ? 'bold' : 'normal'}
                  className="pointer-events-none select-none drop-shadow-md"
                >
                  {node.city}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
