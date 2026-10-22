import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GlobeNode } from '../../types/nexus';
import { latLngToVector3 } from '../../utils/geo';

interface GlobeArcsProps {
  nodes: GlobeNode[];
  radius?: number;
}

interface ArcConnection {
  id: string;
  points: THREE.Vector3[];
  curve: THREE.QuadraticBezierCurve3;
  color: string;
  speed: number;
  offset: number;
}

export function GlobeArcs({ nodes, radius = 5 }: GlobeArcsProps) {
  const connections = useMemo(() => {
    const nodeMap = new Map<string, GlobeNode>();
    nodes.forEach((n) => nodeMap.set(n.id, n));

    const arcList: ArcConnection[] = [];
    const seen = new Set<string>();

    nodes.forEach((source) => {
      source.connections.forEach((targetId) => {
        const pairKey = [source.id, targetId].sort().join('--');
        if (seen.has(pairKey)) return;
        seen.add(pairKey);

        const target = nodeMap.get(targetId);
        if (!target) return;

        const startVec = latLngToVector3(source.lat, source.lng, radius * 1.01);
        const endVec = latLngToVector3(target.lat, target.lng, radius * 1.01);

        const mid = new THREE.Vector3().addVectors(startVec, endVec).multiplyScalar(0.5);
        const distance = startVec.distanceTo(endVec);
        const altitude = Math.min(2.5, Math.max(0.6, distance * 0.28));
        const normal = mid.clone().normalize();
        mid.add(normal.multiplyScalar(altitude));

        const curve = new THREE.QuadraticBezierCurve3(startVec, mid, endVec);
        const points = curve.getPoints(40);

        arcList.push({
          id: pairKey,
          points,
          curve,
          color: Math.random() > 0.4 ? '#00f5ff' : '#a855f7',
          speed: 0.25 + Math.random() * 0.35,
          offset: Math.random(),
        });
      });
    });

    return arcList;
  }, [nodes, radius]);

  return (
    <group>
      {connections.map((arc) => (
        <ArcLine key={arc.id} arc={arc} />
      ))}
    </group>
  );
}

function ArcLine({ arc }: { arc: ArcConnection }) {
  const packetRef = useRef<THREE.Mesh>(null);

  // Create standard Three.js Line object
  const lineObject = useMemo(() => {
    const geometry = new THREE.BufferGeometry().setFromPoints(arc.points);
    const material = new THREE.LineBasicMaterial({
      color: new THREE.Color(arc.color),
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
    });
    return new THREE.Line(geometry, material);
  }, [arc.points, arc.color]);

  useFrame(({ clock }) => {
    if (packetRef.current) {
      const t = (clock.getElapsedTime() * arc.speed + arc.offset) % 1;
      const point = arc.curve.getPointAt(t);
      packetRef.current.position.copy(point);
    }
  });

  return (
    <group>
      {/* Three.js Line primitive */}
      <primitive object={lineObject} />

      {/* Traveling Data Packet Photon */}
      <mesh ref={packetRef}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.95}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
