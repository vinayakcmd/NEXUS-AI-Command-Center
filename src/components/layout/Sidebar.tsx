import React from 'react';
import { useNexusStore } from '../../store/useNexusStore';
import { NavigationTab } from '../../types/nexus';
import {
  Globe,
  LayoutDashboard,
  BarChart3,
  Terminal,
  Bot,
  Settings,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Shield,
  Command,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  tab: NavigationTab;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

export function Sidebar({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const activeTab = useNexusStore((s) => s.activeTab);
  const setTab = useNexusStore((s) => s.setTab);
  const setIsCommandPaletteOpen = useNexusStore((s) => s.setIsCommandPaletteOpen);
  const unreadCount = useNexusStore((s) => s.unreadCount);

  const navItems: NavItem[] = [
    { tab: 'landing', label: 'Landing Hero', icon: Sparkles },
    { tab: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { tab: 'globe', label: '3D Edge Globe', icon: Globe, badge: 'Live' },
    { tab: 'analytics', label: 'Telemetry Analytics', icon: BarChart3 },
    { tab: 'events', label: 'Event Logs', icon: Terminal },
    { tab: 'assistant', label: 'NEXUS Copilot', icon: Bot, badge: 'AI' },
    { tab: 'settings', label: 'System Settings', icon: Settings },
  ];

  const handleNavClick = (tab: NavigationTab) => {
    setTab(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen z-40 flex flex-col justify-between bg-slate-950/90 border-r border-cyan-500/20 backdrop-blur-xl transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        } ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Header Logo */}
        <div>
          <div className="h-16 flex items-center justify-between px-4 border-b border-cyan-500/20">
            <button
              onClick={() => handleNavClick('landing')}
              className="flex items-center gap-3 text-left group overflow-hidden"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 p-[1px] shrink-0 shadow-lg shadow-cyan-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                  <Shield className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                </div>
              </div>
              {!collapsed && (
                <div className="overflow-hidden">
                  <span className="font-extrabold text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-200 to-violet-400 font-mono">
                    NEXUS
                  </span>
                  <div className="text-[10px] text-cyan-400/80 tracking-widest uppercase font-mono">
                    Command Core
                  </div>
                </div>
              )}
            </button>

            {/* Collapse toggle (desktop only) */}
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-900 transition-colors"
              title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {collapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.tab;

              return (
                <button
                  key={item.tab}
                  onClick={() => handleNavClick(item.tab)}
                  title={collapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 to-violet-500/10 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(0,245,255,0.6)]' : 'text-slate-400'
                    }`}
                  />
                  {!collapsed && (
                    <span className="truncate tracking-wide">{item.label}</span>
                  )}

                  {/* Active Indicator Bar */}
                  {isActive && (
                    <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-cyan-400 shadow-[0_0_8px_#00f5ff]" />
                  )}

                  {/* Optional Badges */}
                  {!collapsed && item.badge && (
                    <span
                      className={`ml-auto text-[10px] px-1.5 py-0.5 rounded-full font-mono tracking-wider ${
                        item.badge === 'AI'
                          ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                          : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="p-3 border-t border-cyan-500/20 space-y-2">
          {/* Command Palette Trigger */}
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-cyan-300 bg-slate-900/50 hover:bg-slate-900 border border-cyan-500/20 transition-all ${
              collapsed ? 'justify-center' : 'justify-between'
            }`}
          >
            <div className="flex items-center gap-2">
              <Command className="w-4 h-4 text-cyan-400" />
              {!collapsed && <span>Command HUD</span>}
            </div>
            {!collapsed && (
              <kbd className="px-1.5 py-0.5 text-[10px] bg-slate-800 text-slate-300 rounded border border-slate-700">
                Ctrl K
              </kbd>
            )}
          </button>

          {/* Quick Node Status widget */}
          {!collapsed && (
            <div className="px-3 py-2 rounded-xl bg-slate-950/60 border border-cyan-500/15 text-xs text-slate-400">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="font-mono text-cyan-400">MESH TELEMETRY</span>
                <span className="text-emerald-400 font-mono">100% SECURE</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-full w-[99%]" />
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
