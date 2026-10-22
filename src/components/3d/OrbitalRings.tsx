import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface OrbitalRingsProps {
  radius?: number;
}

export function OrbitalRings({ radius = 5 }: OrbitalRingsProps) {
  const ring1Ref = useRef<THREE.Group>(null);
  const ring2Ref = useRef<THREE.Group>(null);
  const ring3Ref = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += delta * 0.15;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z -= delta * 0.12;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.y += delta * 0.08;
    }
  });

  return (
    <group>
      {/* Equatorial Ring 1 */}
      <group ref={ring1Ref} rotation={[Math.PI / 3, 0.2, 0]}>
        <mesh>
          <ringGeometry args={[radius * 1.35, radius * 1.37, 64]} />
          <meshBasicMaterial
            color="#00f5ff"
            transparent
            opacity={0.35}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        {/* Satellite Data Relay */}
        <mesh position={[radius * 1.36, 0, 0]}>
          <boxGeometry args={[0.15, 0.15, 0.15]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>

      {/* Polar/Tilted Ring 2 */}
      <group ref={ring2Ref} rotation={[-Math.PI / 4, 0.4, 0.5]}>
        <mesh>
          <ringGeometry args={[radius * 1.55, radius * 1.57, 64]} />
          <meshBasicMaterial
            color="#a855f7"
            transparent
            opacity={0.25}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        {/* Secondary Satellite Relay */}
        <mesh position={[-radius * 1.56, 0, 0]}>
          <sphereGeometry args={[0.1, 12, 12]} />
          <meshBasicMaterial color="#a855f7" />
        </mesh>
      </group>

      {/* Outer Wide Subtle Ring 3 */}
      <group ref={ring3Ref} rotation={[0.2, -Math.PI / 6, 0.8]}>
        <mesh>
          <ringGeometry args={[radius * 1.8, radius * 1.815, 64]} />
          <meshBasicMaterial
            color="#38bdf8"
            transparent
            opacity={0.18}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>
    </group>
  );
}
