import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { GlobeNode } from '../../types/nexus';
import { latLngToVector3 } from '../../utils/geo';
import { useNexusStore } from '../../store/useNexusStore';

interface GlobeNodesProps {
  nodes: GlobeNode[];
  radius?: number;
}

export function GlobeNodes({ nodes, radius = 5 }: GlobeNodesProps) {
  const selectedNodeId = useNexusStore((s) => s.selectedNodeId);
  const hoveredNodeId = useNexusStore((s) => s.hoveredNodeId);
  const setSelectedNodeId = useNexusStore((s) => s.setSelectedNodeId);
  const setHoveredNodeId = useNexusStore((s) => s.setHoveredNodeId);

  return (
    <group>
      {nodes.map((node) => {
        const position = latLngToVector3(node.lat, node.lng, radius * 1.01);
        const isSelected = selectedNodeId === node.id;
        const isHovered = hoveredNodeId === node.id;

        return (
          <NodeMarker
            key={node.id}
            node={node}
            position={position}
            isSelected={isSelected}
            isHovered={isHovered}
            onSelect={() => setSelectedNodeId(node.id)}
            onHover={(hover) => setHoveredNodeId(hover ? node.id : null)}
          />
        );
      })}
    </group>
  );
}

interface NodeMarkerProps {
  node: GlobeNode;
  position: THREE.Vector3;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: () => void;
  onHover: (hover: boolean) => void;
}

function NodeMarker({
  node,
  position,
  isSelected,
  isHovered,
  onSelect,
  onHover,
}: NodeMarkerProps) {
  const pulseRef = useRef<THREE.Mesh>(null);

  // Status color
  const color =
    node.status === 'online'
      ? '#00f5ff'
      : node.status === 'degraded'
      ? '#f59e0b'
      : node.status === 'critical'
      ? '#f43f5e'
      : '#38bdf8';

  useFrame(({ clock }) => {
    if (pulseRef.current) {
      const scale = 1 + (Math.sin(clock.getElapsedTime() * 4 + node.lat) + 1) * 0.4;
      pulseRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group position={position}>
      {/* Clickable hit sphere */}
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
          onHover(true);
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
          onHover(false);
        }}
      >
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Core Dot */}
      <mesh>
        <sphereGeometry args={[isSelected ? 0.12 : 0.08, 16, 16]} />
        <meshBasicMaterial color={isSelected ? '#ffffff' : color} />
      </mesh>

      {/* Pulsing Beacon Ring */}
      <mesh ref={pulseRef}>
        <ringGeometry args={[0.09, 0.14, 24]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Selection Outer Glow */}
      {isSelected && (
        <mesh>
          <ringGeometry args={[0.16, 0.24, 32]} />
          <meshBasicMaterial
            color="#a855f7"
            transparent
            opacity={0.9}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Hover or Selection Tooltip */}
      {(isHovered || isSelected) && (
        <Html
          position={[0, 0.35, 0]}
          center
          distanceFactor={14}
          style={{ pointerEvents: 'none' }}
        >
          <div className="px-2.5 py-1.5 rounded-md bg-slate-950/90 border border-cyan-500/40 text-xs backdrop-blur-md shadow-lg shadow-cyan-500/20 whitespace-nowrap flex flex-col items-center animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full inline-block"
                style={{ backgroundColor: color }}
              />
              <span className="font-semibold text-white tracking-wide">{node.city}</span>
              <span className="text-[10px] text-cyan-400 font-mono">[{node.datacenter}]</span>
            </div>
            <div className="text-[10px] text-slate-300 font-mono mt-0.5 flex gap-2">
              <span>{node.latencyMs}ms</span>
              <span>•</span>
              <span>{node.tps} tps</span>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
