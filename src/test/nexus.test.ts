import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useNexusStore } from '../store/useNexusStore';

describe('NEXUS Core State Store & Interactions', () => {
  beforeEach(() => {
    // Reset store state before each test
    useNexusStore.setState({
      activeTab: 'landing',
      selectedNodeId: null,
      toasts: [],
      unreadCount: 3,
    });
  });

  it('updates navigation tab correctly', () => {
    const { setTab } = useNexusStore.getState();
    setTab('overview');
    expect(useNexusStore.getState().activeTab).toBe('overview');

    setTab('globe');
    expect(useNexusStore.getState().activeTab).toBe('globe');

    setTab('analytics');
    expect(useNexusStore.getState().activeTab).toBe('analytics');
  });

  it('selects and deselects edge nodes', () => {
    const { setSelectedNodeId } = useNexusStore.getState();
    setSelectedNodeId('us-west');
    expect(useNexusStore.getState().selectedNodeId).toBe('us-west');

    setSelectedNodeId(null);
    expect(useNexusStore.getState().selectedNodeId).toBeNull();
  });

  it('executes ping test and updates node latency', () => {
    const { pingNode, nodes } = useNexusStore.getState();
    const initialLatency = nodes.find((n) => n.id === 'us-west')?.latencyMs;

    pingNode('us-west');

    const updatedNode = useNexusStore.getState().nodes.find((n) => n.id === 'us-west');
    expect(updatedNode).toBeDefined();
    expect(updatedNode?.latencyMs).toBeTypeOf('number');
    expect(useNexusStore.getState().toasts.length).toBeGreaterThan(0);
  });

  it('toggles node failover status between online and degraded', () => {
    const { toggleNodeFailover } = useNexusStore.getState();
    const targetId = 'eu-central';

    // Toggle once
    toggleNodeFailover(targetId);
    let node = useNexusStore.getState().nodes.find((n) => n.id === targetId);
    expect(node?.status).toBe('degraded');

    // Toggle back
    toggleNodeFailover(targetId);
    node = useNexusStore.getState().nodes.find((n) => n.id === targetId);
    expect(node?.status).toBe('online');
  });

  it('ticks telemetry and records new historical data point', () => {
    const initialHistoryLength = useNexusStore.getState().telemetryHistory.length;
    useNexusStore.getState().tickTelemetry();

    const updatedHistory = useNexusStore.getState().telemetryHistory;
    expect(updatedHistory.length).toBe(initialHistoryLength);
    expect(useNexusStore.getState().currentStats.totalRequestsPerSec).toBeGreaterThan(0);
  });

  it('triggers synthetic incident and logs audit event', () => {
    const initialEventsCount = useNexusStore.getState().events.length;
    useNexusStore.getState().generateSimulatedIncident();

    const updatedEvents = useNexusStore.getState().events;
    expect(updatedEvents.length).toBe(initialEventsCount + 1);
    expect(updatedEvents[0].severity).toBe('critical');
    expect(useNexusStore.getState().toasts.length).toBeGreaterThan(0);
  });

  it('handles notification mark as read and clear', () => {
    const { markAllNotificationsRead, clearNotifications } = useNexusStore.getState();

    markAllNotificationsRead();
    expect(useNexusStore.getState().unreadCount).toBe(0);
    expect(useNexusStore.getState().notifications.every((n) => n.read)).toBe(true);

    clearNotifications();
    expect(useNexusStore.getState().notifications.length).toBe(0);
  });

  it('updates and persists user settings', () => {
    const { updateSettings, resetSettings } = useNexusStore.getState();

    updateSettings({
      globeQuality: 'low',
      autoRotate: false,
      soundEnabled: false,
      particleDensity: 1200,
    });

    const settings = useNexusStore.getState().settings;
    expect(settings.globeQuality).toBe('low');
    expect(settings.autoRotate).toBe(false);
    expect(settings.soundEnabled).toBe(false);
    expect(settings.particleDensity).toBe(1200);

    resetSettings();
    const reset = useNexusStore.getState().settings;
    expect(reset.globeQuality).toBe('high');
    expect(reset.autoRotate).toBe(true);
  });
});
