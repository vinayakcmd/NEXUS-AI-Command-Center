import React, { useState, useEffect } from 'react';
import { useNexusStore } from './store/useNexusStore';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { TelemetryTicker } from './components/layout/TelemetryTicker';
import { CommandPalette } from './components/layout/CommandPalette';
import { NotificationCenter } from './components/layout/NotificationCenter';
import { ToastProvider } from './components/layout/ToastProvider';

import { LandingView } from './views/LandingView';
import { DashboardView } from './views/DashboardView';
import { GlobeView } from './views/GlobeView';
import { AnalyticsView } from './views/AnalyticsView';
import { EventsView } from './views/EventsView';
import { AssistantView } from './views/AssistantView';
import { SettingsView } from './views/SettingsView';

export function App() {
  const activeTab = useNexusStore((s) => s.activeTab);
  const settings = useNexusStore((s) => s.settings);
  const tickTelemetry = useNexusStore((s) => s.tickTelemetry);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Set up live telemetry interval
  useEffect(() => {
    const intervalMs = (settings.refreshInterval || 3) * 1000;
    const timer = setInterval(() => {
      tickTelemetry();
    }, intervalMs);

    return () => clearInterval(timer);
  }, [settings.refreshInterval, tickTelemetry]);

  // Apply theme to document
  useEffect(() => {
    if (settings.theme === 'light') {
      document.documentElement.classList.add('theme-light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.remove('theme-light');
      document.documentElement.classList.add('dark');
    }
  }, [settings.theme]);

  // Render current view
  const renderCurrentView = () => {
    switch (activeTab) {
      case 'landing':
        return <LandingView />;
      case 'overview':
        return <DashboardView />;
      case 'globe':
        return <GlobeView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'events':
        return <EventsView />;
      case 'assistant':
        return <AssistantView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className={`min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200 ${settings.theme === 'light' ? 'theme-light' : ''}`}>
      {/* Top Real-time Telemetry Marquee Ticker */}
      <TelemetryTicker />

      {/* Main Shell */}
      <div className="flex-1 flex min-h-0">
        {/* Navigation Sidebar */}
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0 relative">
          <Header onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} />

          <main className="flex-1 overflow-y-auto min-h-0 relative">
            {renderCurrentView()}
          </main>
        </div>
      </div>

      {/* Overlays & Modals */}
      <CommandPalette />
      <NotificationCenter />
      <ToastProvider />
    </div>
  );
}

export default App;
