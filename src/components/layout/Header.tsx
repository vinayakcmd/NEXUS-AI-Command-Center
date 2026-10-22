import React from 'react';
import { useNexusStore } from '../../store/useNexusStore';
import {
  Menu,
  Search,
  Bell,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Sparkles,
  Zap,
} from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface HeaderProps {
  onToggleMobileMenu: () => void;
}

export function Header({ onToggleMobileMenu }: HeaderProps) {
  const activeTab = useNexusStore((s) => s.activeTab);
  const settings = useNexusStore((s) => s.settings);
  const updateSettings = useNexusStore((s) => s.updateSettings);
  const setIsCommandPaletteOpen = useNexusStore((s) => s.setIsCommandPaletteOpen);
  const isNotificationOpen = useNexusStore((s) => s.isNotificationOpen);
  const setIsNotificationOpen = useNexusStore((s) => s.setIsNotificationOpen);
  const unreadCount = useNexusStore((s) => s.unreadCount);
  const addToast = useNexusStore((s) => s.addToast);

  const toggleSound = () => {
    const nextState = !settings.soundEnabled;
    updateSettings({ soundEnabled: nextState });
    if (nextState) {
      soundManager.playClick();
      addToast({ title: 'Audio Synthesizer Enabled', type: 'info', duration: 2000 });
    } else {
      addToast({ title: 'Audio Muted', type: 'info', duration: 2000 });
    }
  };

  const toggleTheme = () => {
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
    updateSettings({ theme: nextTheme });
    soundManager.playClick();
    addToast({
      title: `Theme Changed: ${nextTheme.toUpperCase()}`,
      message: 'Interface visual tokens refreshed.',
      type: 'info',
      duration: 2000,
    });
  };

  const pageTitles: Record<string, { title: string; subtitle: string }> = {
    landing: { title: 'NEXUS Autonomous Core', subtitle: 'Global Distributed Intelligence Platform' },
    overview: { title: 'Operations Dashboard', subtitle: 'Live Cluster Telemetry & System Health' },
    globe: { title: 'Global 3D Holographic Mesh', subtitle: 'Interactive Planetary Edge Node Network' },
    analytics: { title: 'Telemetry & Inferences Analytics', subtitle: 'Token Throughput, P99 Latency & Resource Utilization' },
    events: { title: 'System Event Logs & Audit', subtitle: 'Real-time Distributed Event Stream' },
    assistant: { title: 'NEXUS Copilot', subtitle: 'Autonomous AI Infrastructure Telemetry Agent' },
    settings: { title: 'System Settings & Calibration', subtitle: 'Rendering Parameters, Simulation & Storage' },
  };

  const currentMeta = pageTitles[activeTab] || { title: 'Command Center', subtitle: 'NEXUS' };

  return (
    <header className="h-16 px-4 lg:px-6 bg-slate-950/80 border-b border-cyan-500/20 backdrop-blur-md flex items-center justify-between sticky top-0 z-30">
      {/* Left: Mobile Menu & Current Route Details */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-900"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:block">
          <h1 className="text-base font-semibold text-white tracking-wide flex items-center gap-2">
            <span>{currentMeta.title}</span>
            <span className="hidden md:inline-flex text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono uppercase">
              NODE v3.8.4
            </span>
          </h1>
          <p className="text-xs text-slate-400 truncate max-w-md hidden md:block">
            {currentMeta.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Quick Command trigger & Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search / Command palette trigger */}
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/70 hover:bg-slate-900 border border-cyan-500/20 text-slate-400 hover:text-slate-200 text-xs transition-all shadow-sm group"
        >
          <Search className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
          <span className="hidden md:inline font-mono">Search nodes & commands...</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] bg-slate-800 text-cyan-300 rounded border border-cyan-500/30 font-mono">
            Ctrl+K
          </kbd>
        </button>

        {/* Audio Toggle */}
        <button
          onClick={toggleSound}
          title={settings.soundEnabled ? 'Mute Interface Sound' : 'Enable Interface Sound'}
          className={`p-2 rounded-xl transition-all ${
            settings.soundEnabled
              ? 'text-cyan-400 hover:bg-cyan-500/10'
              : 'text-slate-500 hover:bg-slate-900'
          }`}
        >
          {settings.soundEnabled ? (
            <Volume2 className="w-4 h-4" />
          ) : (
            <VolumeX className="w-4 h-4" />
          )}
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title={`Switch to ${settings.theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          className="p-2 rounded-xl text-slate-400 hover:text-cyan-300 hover:bg-slate-900 transition-all"
        >
          {settings.theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-cyan-400" />
          )}
        </button>

        {/* Notification Bell */}
        <button
          onClick={() => setIsNotificationOpen(!isNotificationOpen)}
          title="Notifications"
          className="relative p-2 rounded-xl text-slate-400 hover:text-cyan-300 hover:bg-slate-900 transition-all"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full shadow-[0_0_8px_#00f5ff] animate-pulse" />
          )}
        </button>

        {/* Live Status indicator */}
        <div className="hidden sm:flex items-center gap-1.5 pl-2 border-l border-cyan-500/20 text-xs font-mono text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
          <span className="hidden xl:inline">SYNCED</span>
        </div>
      </div>
    </header>
  );
}
