import React, { Suspense, useMemo, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useNexusStore } from '../../store/useNexusStore';
import { Starfield } from './Starfield';
import { GlobeNodes } from './GlobeNodes';
import { GlobeArcs } from './GlobeArcs';
import { OrbitalRings } from './OrbitalRings';
import { GlobeAtmosphere } from './GlobeAtmosphere';
import { GlobeFallback2D } from './GlobeFallback2D';
import { createEarthCanvasTexture } from './earthTexture';
import { RotateCcw, Play, Pause, ZoomIn, ZoomOut, Layers } from 'lucide-react';

interface NexusGlobeProps {
  onSelectNode?: (nodeId: string) => void;
  interactive?: boolean;
  className?: string;
}

// Inner Earth sphere mesh with holographic texture
function EarthSphere({ radius = 5 }: { radius?: number }) {
  const earthRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);

  // Generate procedural digital earth texture
  const texture = useMemo(() => createEarthCanvasTexture(), []);

  return (
    <group>
      {/* Base Solid Deep Space Sphere */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.7}
          metalness={0.2}
          emissive="#041226"
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Cyber Wireframe Grid overlay */}
      <mesh>
        <sphereGeometry args={[radius * 1.002, 36, 18]} />
        <meshBasicMaterial
          color="#00f5ff"
          wireframe
          transparent
          opacity={0.06}
        />
      </mesh>

      {/* Subtle Inner Glow */}
      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[radius * 1.01, 32, 32]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

// Globe Scene Container with Auto-rotation
function SceneContent() {
  const settings = useNexusStore((s) => s.settings);
  const nodes = useNexusStore((s) => s.nodes);
  const groupRef = useRef<THREE.Group>(null);

  const radius = 5;

  useFrame((_, delta) => {
    if (groupRef.current && settings.autoRotate && !settings.reducedMotion) {
      groupRef.current.rotation.y += delta * 0.06 * settings.telemetrySpeed;
    }
  });

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.9} />
      <directionalLight position={[12, 10, 8]} intensity={1.8} color="#ffffff" />
      <directionalLight position={[-12, -8, -10]} intensity={0.8} color="#00f5ff" />
      <pointLight position={[0, 15, 0]} intensity={0.5} color="#a855f7" />

      {/* Outer Starfield */}
      <Starfield
        count={settings.globeQuality === 'ultra' ? 3200 : settings.globeQuality === 'low' ? 800 : settings.particleDensity}
        speed={settings.reducedMotion ? 0 : 0.04}
      />

      {/* Primary Globe Group */}
      <group ref={groupRef}>
        <EarthSphere radius={radius} />
        {settings.showAtmosphere && <GlobeAtmosphere radius={radius} />}
        {settings.showFlightArcs && <GlobeArcs nodes={nodes} radius={radius} />}
        <OrbitalRings radius={radius} />
        <GlobeNodes nodes={nodes} radius={radius} />
      </group>
    </>
  );
}

// Check WebGL availability
function checkWebGLSupport(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

export function NexusGlobe({ onSelectNode, interactive = true, className = '' }: NexusGlobeProps) {
  const settings = useNexusStore((s) => s.settings);
  const updateSettings = useNexusStore((s) => s.updateSettings);
  const [hasWebGL, setHasWebGL] = useState(true);
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    setHasWebGL(checkWebGLSupport());
  }, []);

  // Handle camera control HUD actions
  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  const handleZoomIn = () => {
    if (controlsRef.current) {
      controlsRef.current.dollyIn(1.2);
      controlsRef.current.update();
    }
  };

  const handleZoomOut = () => {
    if (controlsRef.current) {
      controlsRef.current.dollyOut(1.2);
      controlsRef.current.update();
    }
  };

  const toggleAutoRotate = () => {
    updateSettings({ autoRotate: !settings.autoRotate });
  };

  // If WebGL is unavailable or user enabled fallback mode in settings
  if (!hasWebGL || settings.fallbackMode) {
    return (
      <div className={`w-full h-full relative ${className}`}>
        <GlobeFallback2D onSelectNode={onSelectNode} />
      </div>
    );
  }

  return (
    <div className={`w-full h-full relative select-none ${className}`}>
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 2, 13], fov: 45 }}
        dpr={settings.globeQuality === 'ultra' ? [1, 2] : [1, 1.5]}
        gl={{
          antialias: settings.globeQuality !== 'low',
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        <Suspense fallback={null}>
          <SceneContent />
          {interactive && (
            <OrbitControls
              ref={controlsRef}
              enableZoom={true}
              enablePan={false}
              minDistance={7.5}
              maxDistance={22}
              rotateSpeed={0.6}
              zoomSpeed={0.8}
              dampingFactor={0.05}
              enableDamping={true}
            />
          )}
        </Suspense>
      </Canvas>

      {/* Floating HUD Controls */}
      {interactive && (
        <div className="absolute bottom-6 right-6 z-10 flex items-center gap-2 p-1.5 rounded-xl bg-slate-950/80 border border-cyan-500/30 backdrop-blur-md shadow-xl shadow-cyan-950/40">
          <button
            onClick={toggleAutoRotate}
            title={settings.autoRotate ? 'Pause Rotation' : 'Resume Rotation'}
            className={`p-2 rounded-lg transition-all ${
              settings.autoRotate
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {settings.autoRotate ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <button
            onClick={handleZoomIn}
            title="Zoom In"
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <button
            onClick={handleResetCamera}
            title="Reset View"
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <div className="h-4 w-[1px] bg-slate-700/60 mx-1" />

          <button
            onClick={() => updateSettings({ fallbackMode: !settings.fallbackMode })}
            title="Toggle 2D / 3D Mode"
            className="p-2 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800/60 transition-all flex items-center gap-1.5 text-xs font-mono"
          >
            <Layers className="w-4 h-4" />
            <span className="hidden sm:inline">2D/3D</span>
          </button>
        </div>
      )}
    </div>
  );
}
