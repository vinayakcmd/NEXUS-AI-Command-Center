import { useMemo } from 'react';
import * as THREE from 'three';

interface GlobeAtmosphereProps {
  radius?: number;
}

export function GlobeAtmosphere({ radius = 5 }: GlobeAtmosphereProps) {
  // Custom Fresnel Shader for soft glowing cyber atmosphere
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.2);
          vec3 atmosphereColor = mix(vec3(0.0, 0.96, 1.0), vec3(0.66, 0.33, 0.97), 0.4);
          gl_FragColor = vec4(atmosphereColor, 1.0) * intensity;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    });
  }, []);

  return (
    <mesh material={shaderMaterial}>
      <sphereGeometry args={[radius * 1.18, 48, 48]} />
    </mesh>
  );
}
