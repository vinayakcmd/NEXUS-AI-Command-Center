import React, { useState } from 'react';
import { useNexusStore } from '../../store/useNexusStore';
import {
  Bell,
  X,
  CheckCheck,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Info,
  ExternalLink,
} from 'lucide-react';
import { formatDateTime } from '../../utils/formatters';

export function NotificationCenter() {
  const isOpen = useNexusStore((s) => s.isNotificationOpen);
  const setIsOpen = useNexusStore((s) => s.setIsNotificationOpen);
  const notifications = useNexusStore((s) => s.notifications);
  const markNotificationRead = useNexusStore((s) => s.markNotificationRead);
  const markAllNotificationsRead = useNexusStore((s) => s.markAllNotificationsRead);
  const clearNotifications = useNexusStore((s) => s.clearNotifications);
  const setTab = useNexusStore((s) => s.setTab);

  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  if (!isOpen) return null;

  const filteredNotifications = notifications.filter((n) =>
    filter === 'unread' ? !n.read : true
  );

  const getIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      default:
        return <Info className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="w-full max-w-md h-full bg-slate-950/95 border-l border-cyan-500/30 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-cyan-500/20 flex items-center justify-between bg-slate-900/40">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-cyan-400" />
            <h3 className="font-semibold text-white tracking-wide text-sm font-mono">
              SYSTEM NOTIFICATIONS
            </h3>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter and Quick Actions Bar */}
        <div className="px-4 py-2 border-b border-cyan-500/10 flex items-center justify-between text-xs bg-slate-900/20">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-md font-mono ${
                filter === 'all'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-2.5 py-1 rounded-md font-mono ${
                filter === 'unread'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Unread ({notifications.filter((n) => !n.read).length})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={markAllNotificationsRead}
              title="Mark all as read"
              className="p-1.5 text-slate-400 hover:text-cyan-300 rounded hover:bg-slate-800"
            >
              <CheckCheck className="w-4 h-4" />
            </button>
            <button
              onClick={clearNotifications}
              title="Clear all"
              className="p-1.5 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {filteredNotifications.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6">
              <CheckCircle2 className="w-8 h-8 text-slate-600 mb-2" />
              <p className="text-sm text-slate-400 font-medium">All caught up</p>
              <p className="text-xs text-slate-500 mt-1">No pending alerts</p>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => {
                  if (!notif.read) markNotificationRead(notif.id);
                  if (notif.linkTab) {
                    setTab(notif.linkTab);
                    setIsOpen(false);
                  }
                }}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  notif.read
                    ? 'bg-slate-900/30 border-cyan-500/10 text-slate-400'
                    : 'bg-slate-900/80 border-cyan-500/30 text-white shadow-lg shadow-cyan-950/20'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 shrink-0">
                    {getIcon(notif.severity)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold tracking-wide truncate">
                        {notif.title}
                      </span>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed mb-2">
                      {notif.message}
                    </p>
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                      <span>{formatDateTime(notif.timestamp)}</span>
                      {notif.linkTab && (
                        <span className="text-cyan-400 flex items-center gap-1 hover:underline">
                          Inspect <ExternalLink className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
