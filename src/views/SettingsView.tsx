import React from 'react';
import { useNexusStore } from '../store/useNexusStore';
import {
  Settings,
  Monitor,
  Eye,
  Volume2,
  VolumeX,
  Gauge,
  RotateCcw,
  Sparkles,
  Sliders,
  Shield,
  Layers,
  Database,
  Check,
} from 'lucide-react';
import { soundManager } from '../utils/audio';

export function SettingsView() {
  const settings = useNexusStore((s) => s.settings);
  const updateSettings = useNexusStore((s) => s.updateSettings);
  const resetSettings = useNexusStore((s) => s.resetSettings);
  const addToast = useNexusStore((s) => s.addToast);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Top Settings Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-950/70 border border-cyan-500/20 backdrop-blur-md">
        <div>
          <h2 className="text-base font-bold text-white tracking-wide font-mono uppercase flex items-center gap-2">
            <Settings className="w-5 h-5 text-cyan-400" />
            <span>NEXUS System Calibration & Preferences</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure WebGL rendering pipelines, accessibility thresholds, and telemetry streaming.
          </p>
        </div>

        <button
          onClick={resetSettings}
          className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-all shadow-md self-stretch sm:self-auto justify-center"
        >
          <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
          <span>Reset Defaults</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 1: 3D Globe Visual Settings */}
        <div className="p-5 rounded-xl bg-slate-950/80 border border-cyan-500/20 backdrop-blur-md space-y-4">
          <div className="flex items-center gap-2 border-b border-cyan-500/15 pb-3">
            <Monitor className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-white tracking-wide font-mono uppercase">
              3D Holographic Rendering
            </h3>
          </div>

          {/* Quality Preset */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300">Rendering Quality</label>
            <div className="grid grid-cols-4 gap-2">
              {(['ultra', 'high', 'balanced', 'low'] as const).map((q) => (
                <button
                  key={q}
                  onClick={() => updateSettings({ globeQuality: q })}
                  className={`py-2 rounded-lg text-xs font-mono capitalize transition-all ${
                    settings.globeQuality === q
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                      : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Particle Density Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300">Starfield Particle Density</span>
              <span className="text-cyan-400">{settings.particleDensity} points</span>
            </div>
            <input
              type="range"
              min="600"
              max="3600"
              step="200"
              value={settings.particleDensity}
              onChange={(e) => updateSettings({ particleDensity: Number(e.target.value) })}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Atmosphere Glow Toggle */}
          <div className="flex items-center justify-between py-2 border-t border-cyan-500/10">
            <div>
              <div className="text-xs font-mono text-white">Atmosphere Fresnel Halo</div>
              <div className="text-[11px] text-slate-400">Cyan & violet outer planetary glow</div>
            </div>
            <input
              type="checkbox"
              checked={settings.showAtmosphere}
              onChange={(e) => updateSettings({ showAtmosphere: e.target.checked })}
              className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
            />
          </div>

          {/* Flight Arcs Toggle */}
          <div className="flex items-center justify-between py-2 border-t border-cyan-500/10">
            <div>
              <div className="text-xs font-mono text-white">Curved Flight Arcs & Photons</div>
              <div className="text-[11px] text-slate-400">Inter-cluster packet animations</div>
            </div>
            <input
              type="checkbox"
              checked={settings.showFlightArcs}
              onChange={(e) => updateSettings({ showFlightArcs: e.target.checked })}
              className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
            />
          </div>

          {/* 2D Fallback Map Mode */}
          <div className="flex items-center justify-between py-2 border-t border-cyan-500/10">
            <div>
              <div className="text-xs font-mono text-white">2D Fallback Map Mode</div>
              <div className="text-[11px] text-slate-400">Use 2D SVG canvas instead of WebGL</div>
            </div>
            <input
              type="checkbox"
              checked={settings.fallbackMode}
              onChange={(e) => {
                updateSettings({ fallbackMode: e.target.checked });
                addToast({
                  title: e.target.checked ? '2D Fallback Activated' : '3D WebGL Mode Activated',
                  type: 'info',
                });
              }}
              className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Section 2: Motion, Audio & Accessibility */}
        <div className="p-5 rounded-xl bg-slate-950/80 border border-cyan-500/20 backdrop-blur-md space-y-4">
          <div className="flex items-center gap-2 border-b border-cyan-500/15 pb-3">
            <Sliders className="w-4 h-4 text-violet-400" />
            <h3 className="text-sm font-semibold text-white tracking-wide font-mono uppercase">
              Motion, Audio & Accessibility
            </h3>
          </div>

          {/* Reduced Motion */}
          <div className="flex items-center justify-between py-1">
            <div>
              <div className="text-xs font-mono text-white">Reduced Motion Mode</div>
              <div className="text-[11px] text-slate-400">Disables 3D continuous spin and animations</div>
            </div>
            <input
              type="checkbox"
              checked={settings.reducedMotion}
              onChange={(e) => updateSettings({ reducedMotion: e.target.checked })}
              className="w-4 h-4 accent-violet-400 rounded cursor-pointer"
            />
          </div>

          {/* Sound FX Toggle */}
          <div className="flex items-center justify-between py-2 border-t border-cyan-500/10">
            <div>
              <div className="text-xs font-mono text-white">Web Audio Interface FX</div>
              <div className="text-[11px] text-slate-400">Synthesizer audio clicks, pings & alarms</div>
            </div>
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={(e) => {
                updateSettings({ soundEnabled: e.target.checked });
                if (e.target.checked) soundManager.playClick();
              }}
              className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
            />
          </div>

          {/* Sound Volume Slider */}
          {settings.soundEnabled && (
            <div className="space-y-1.5 py-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">FX Volume</span>
                <span className="text-cyan-400">{Math.round(settings.soundVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="1.0"
                step="0.05"
                value={settings.soundVolume}
                onChange={(e) => updateSettings({ soundVolume: Number(e.target.value) })}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>
          )}

          {/* Auto Refresh Interval */}
          <div className="space-y-1.5 pt-2 border-t border-cyan-500/10">
            <label className="text-xs font-mono text-slate-300">Telemetry Refresh Tick Interval</label>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 5].map((sec) => (
                <button
                  key={sec}
                  onClick={() => updateSettings({ refreshInterval: sec })}
                  className={`py-2 rounded-lg text-xs font-mono transition-all ${
                    settings.refreshInterval === sec
                      ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40 font-semibold'
                      : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  {sec}s
                </button>
              ))}
            </div>
          </div>

          {/* LocalStorage State info */}
          <div className="p-3 rounded-xl bg-slate-900/40 border border-cyan-500/10 text-xs font-mono space-y-1 pt-3">
            <div className="text-slate-400 flex items-center justify-between">
              <span>Persistence Store:</span>
              <span className="text-emerald-400">LocalStorage Active</span>
            </div>
            <div className="text-slate-500 text-[10px]">
              All calibration preferences automatically save to your browser.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
