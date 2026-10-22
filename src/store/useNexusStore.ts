import { create } from 'zustand';
import {
  NavigationTab,
  GlobeNode,
  TelemetryPoint,
  SystemEvent,
  NotificationItem,
  UserSettings,
  AssistantMessage,
  Toast,
} from '../types/nexus';
import { soundManager } from '../utils/audio';

// Default initial edge nodes across the world
export const INITIAL_NODES: GlobeNode[] = [
  {
    id: 'us-west',
    name: 'Nexus Alpha',
    city: 'San Francisco',
    country: 'United States',
    lat: 37.7749,
    lng: -122.4194,
    status: 'online',
    region: 'North America West',
    datacenter: 'SFO-DC1',
    latencyMs: 14.2,
    tps: 4210,
    cpuLoad: 58,
    memoryLoad: 64,
    activeModels: ['Nexus-Prime-70B', 'Claude-3.5-Sonnet', 'Llama-3.3'],
    connections: ['us-east', 'ap-east', 'ap-southeast-2'],
    incidentsCount: 0,
    ipAddress: '198.51.100.12',
    lastPing: new Date().toISOString(),
  },
  {
    id: 'us-east',
    name: 'Nexus Beta',
    city: 'Ashburn',
    country: 'United States',
    lat: 39.0438,
    lng: -77.4874,
    status: 'online',
    region: 'North America East',
    datacenter: 'IAD-DC4',
    latencyMs: 18.5,
    tps: 5840,
    cpuLoad: 72,
    memoryLoad: 79,
    activeModels: ['Nexus-Prime-70B', 'GPT-4o-Turbo', 'DeepSeek-R1'],
    connections: ['us-west', 'eu-west', 'sa-east'],
    incidentsCount: 0,
    ipAddress: '198.51.100.44',
    lastPing: new Date().toISOString(),
  },
  {
    id: 'eu-west',
    name: 'Nexus Gamma',
    city: 'London',
    country: 'United Kingdom',
    lat: 51.5074,
    lng: -0.1278,
    status: 'online',
    region: 'Europe West',
    datacenter: 'LHR-DC2',
    latencyMs: 22.1,
    tps: 3690,
    cpuLoad: 46,
    memoryLoad: 55,
    activeModels: ['Nexus-Prime-70B', 'Claude-3.5-Sonnet'],
    connections: ['us-east', 'eu-central', 'eu-north', 'af-south'],
    incidentsCount: 0,
    ipAddress: '198.51.100.82',
    lastPing: new Date().toISOString(),
  },
  {
    id: 'eu-central',
    name: 'Nexus Delta',
    city: 'Frankfurt',
    country: 'Germany',
    lat: 50.1109,
    lng: 8.6821,
    status: 'online',
    region: 'Europe Central',
    datacenter: 'FRA-DC3',
    latencyMs: 19.8,
    tps: 4520,
    cpuLoad: 68,
    memoryLoad: 71,
    activeModels: ['Nexus-Prime-70B', 'GPT-4o-Turbo', 'Llama-3.3'],
    connections: ['eu-west', 'me-central', 'ap-south'],
    incidentsCount: 0,
    ipAddress: '198.51.100.99',
    lastPing: new Date().toISOString(),
  },
  {
    id: 'ap-east',
    name: 'Nexus Epsilon',
    city: 'Tokyo',
    country: 'Japan',
    lat: 35.6762,
    lng: 139.6503,
    status: 'online',
    region: 'Asia Pacific East',
    datacenter: 'NRT-DC1',
    latencyMs: 31.4,
    tps: 4980,
    cpuLoad: 64,
    memoryLoad: 69,
    activeModels: ['Nexus-Prime-70B', 'DeepSeek-R1', 'Claude-3.5-Sonnet'],
    connections: ['us-west', 'ap-southeast', 'ap-southeast-2'],
    incidentsCount: 0,
    ipAddress: '203.0.113.15',
    lastPing: new Date().toISOString(),
  },
  {
    id: 'ap-southeast',
    name: 'Nexus Zeta',
    city: 'Singapore',
    country: 'Singapore',
    lat: 1.3521,
    lng: 103.8198,
    status: 'online',
    region: 'Asia Pacific Southeast',
    datacenter: 'SIN-DC1',
    latencyMs: 28.7,
    tps: 3410,
    cpuLoad: 52,
    memoryLoad: 58,
    activeModels: ['Nexus-Prime-70B', 'GPT-4o-Turbo'],
    connections: ['ap-east', 'ap-south', 'ap-southeast-2'],
    incidentsCount: 0,
    ipAddress: '203.0.113.88',
    lastPing: new Date().toISOString(),
  },
  {
    id: 'ap-south',
    name: 'Nexus Eta',
    city: 'Mumbai',
    country: 'India',
    lat: 19.076,
    lng: 72.8777,
    status: 'online',
    region: 'Asia Pacific South',
    datacenter: 'BOM-DC2',
    latencyMs: 34.6,
    tps: 3890,
    cpuLoad: 61,
    memoryLoad: 63,
    activeModels: ['Nexus-Prime-70B', 'Llama-3.3'],
    connections: ['eu-central', 'me-central', 'ap-southeast'],
    incidentsCount: 0,
    ipAddress: '203.0.113.201',
    lastPing: new Date().toISOString(),
  },
  {
    id: 'ap-southeast-2',
    name: 'Nexus Theta',
    city: 'Sydney',
    country: 'Australia',
    lat: -33.8688,
    lng: 151.2093,
    status: 'online',
    region: 'Oceania',
    datacenter: 'SYD-DC1',
    latencyMs: 44.1,
    tps: 2150,
    cpuLoad: 41,
    memoryLoad: 49,
    activeModels: ['Nexus-Prime-70B', 'Claude-3.5-Sonnet'],
    connections: ['ap-east', 'ap-southeast', 'us-west'],
    incidentsCount: 0,
    ipAddress: '203.0.113.111',
    lastPing: new Date().toISOString(),
  },
  {
    id: 'sa-east',
    name: 'Nexus Iota',
    city: 'São Paulo',
    country: 'Brazil',
    lat: -23.5505,
    lng: -46.6333,
    status: 'online',
    region: 'South America East',
    datacenter: 'GRU-DC1',
    latencyMs: 52.3,
    tps: 1840,
    cpuLoad: 49,
    memoryLoad: 52,
    activeModels: ['Nexus-Prime-70B', 'Llama-3.3'],
    connections: ['us-east', 'af-south'],
    incidentsCount: 0,
    ipAddress: '198.51.100.222',
    lastPing: new Date().toISOString(),
  },
  {
    id: 'me-central',
    name: 'Nexus Kappa',
    city: 'Dubai',
    country: 'United Arab Emirates',
    lat: 25.2048,
    lng: 55.2708,
    status: 'online',
    region: 'Middle East',
    datacenter: 'DXB-DC2',
    latencyMs: 27.2,
    tps: 2780,
    cpuLoad: 55,
    memoryLoad: 60,
    activeModels: ['Nexus-Prime-70B', 'DeepSeek-R1'],
    connections: ['eu-central', 'ap-south'],
    incidentsCount: 0,
    ipAddress: '198.51.100.177',
    lastPing: new Date().toISOString(),
  },
  {
    id: 'eu-north',
    name: 'Nexus Lambda',
    city: 'Stockholm',
    country: 'Sweden',
    lat: 59.3293,
    lng: 18.0686,
    status: 'online',
    region: 'Europe North',
    datacenter: 'ARN-DC1',
    latencyMs: 24.5,
    tps: 2310,
    cpuLoad: 39,
    memoryLoad: 45,
    activeModels: ['Nexus-Prime-70B', 'Claude-3.5-Sonnet'],
    connections: ['eu-west'],
    incidentsCount: 0,
    ipAddress: '198.51.100.198',
    lastPing: new Date().toISOString(),
  },
  {
    id: 'af-south',
    name: 'Nexus Mu',
    city: 'Cape Town',
    country: 'South Africa',
    lat: -33.9249,
    lng: 18.4241,
    status: 'online',
    region: 'Africa South',
    datacenter: 'CPT-DC1',
    latencyMs: 68.4,
    tps: 1120,
    cpuLoad: 34,
    memoryLoad: 41,
    activeModels: ['Nexus-Prime-70B'],
    connections: ['eu-west', 'sa-east'],
    incidentsCount: 0,
    ipAddress: '198.51.100.250',
    lastPing: new Date().toISOString(),
  },
];

// Generate initial 20 telemetry history points
function generateInitialTelemetry(): TelemetryPoint[] {
  const points: TelemetryPoint[] = [];
  const now = Date.now();
  for (let i = 20; i >= 0; i--) {
    const time = new Date(now - i * 60000).toISOString();
    const baseReq = 36000 + Math.sin(i * 0.4) * 8000;
    points.push({
      timestamp: time,
      requests: Math.round(baseReq + (Math.random() - 0.5) * 2000),
      inferences: Math.round(baseReq * 0.88 + (Math.random() - 0.5) * 1500),
      p50Latency: +(18 + Math.random() * 4).toFixed(1),
      p95Latency: +(36 + Math.random() * 8).toFixed(1),
      p99Latency: +(62 + Math.random() * 15).toFixed(1),
      tokenInput: Math.round(baseReq * 450),
      tokenOutput: Math.round(baseReq * 180),
      errorRate: +(0.01 + Math.random() * 0.03).toFixed(3),
      costPerHour: +(42.5 + Math.random() * 5).toFixed(2),
    });
  }
  return points;
}

// Initial Events
export const INITIAL_EVENTS: SystemEvent[] = [
  {
    id: 'evt-001',
    timestamp: new Date(Date.now() - 2 * 60000).toISOString(),
    severity: 'info',
    category: 'Model Ops',
    title: 'Model Weights Synchronized',
    description: 'Autonomous weights replication completed across 12 edge nodes for Nexus-Prime-70B v2.4.',
    region: 'Global',
    metadata: { version: '2.4.1', nodesUpdated: 12, sizeGb: 142.8, checksum: 'sha256-a94f83b' },
  },
  {
    id: 'evt-002',
    timestamp: new Date(Date.now() - 7 * 60000).toISOString(),
    severity: 'success',
    category: 'Routing',
    title: 'Dynamic Traffic Rebalanced',
    description: 'Automated geo-dns rerouted 15% of APAC inbound requests to Singapore datacenter.',
    nodeId: 'ap-southeast',
    region: 'Asia Pacific Southeast',
    metadata: { reroutedPercent: 15, latencyReductionMs: 8.4 },
  },
  {
    id: 'evt-003',
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    severity: 'warning',
    category: 'Cluster',
    title: 'High VRAM Saturation Warning',
    description: 'Frankfurt FRA-DC3 memory headroom dropped below 15% during burst inference peak.',
    nodeId: 'eu-central',
    region: 'Europe Central',
    metadata: { currentLoad: 89.2, threshold: 85, autoScaledReplicas: 4 },
  },
  {
    id: 'evt-004',
    timestamp: new Date(Date.now() - 25 * 60000).toISOString(),
    severity: 'info',
    category: 'Security',
    title: 'Automated TLS Certificate Rotated',
    description: 'mTLS handshake identity tokens renewed for inter-datacenter mesh network.',
    region: 'Global Mesh',
    metadata: { algorithm: 'ECDSA-P384', validityHours: 72 },
  },
  {
    id: 'evt-005',
    timestamp: new Date(Date.now() - 40 * 60000).toISOString(),
    severity: 'critical',
    category: 'Security',
    title: 'Anomalous Token Flood Mitigated',
    description: 'DDoS mitigation heuristic dropped 45,000 malformed JSON inference calls from 3 autonomous bot clusters.',
    nodeId: 'us-east',
    region: 'North America East',
    metadata: { blockedIps: 184, droppedPackets: 45290, mitigationTimeSec: 1.2 },
  },
];

// Initial Notifications
export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Nexus-Prime-70B Deployed',
    message: 'Global rollout completed successfully across 12 distributed clusters.',
    timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
    severity: 'success',
    category: 'Deployments',
    read: false,
    linkTab: 'overview',
  },
  {
    id: 'notif-2',
    title: 'Cluster Latency Alert',
    message: 'Stockholm ARN-DC1 transit peering experiencing 14ms jitter.',
    timestamp: new Date(Date.now() - 18 * 60000).toISOString(),
    severity: 'warning',
    category: 'Alerts',
    read: false,
    linkTab: 'globe',
  },
  {
    id: 'notif-3',
    title: 'Scheduled Mesh Rebalance',
    message: 'Cross-continental optical route optimization scheduled in 4 hours.',
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    severity: 'info',
    category: 'System',
    read: true,
    linkTab: 'analytics',
  },
];

// Settings storage key
const SETTINGS_KEY = 'nexus_user_settings_v1';

function loadStoredSettings(): UserSettings {
  const defaults: UserSettings = {
    theme: 'dark',
    globeQuality: 'high',
    autoRotate: true,
    particleDensity: 2400,
    reducedMotion: false,
    soundEnabled: true,
    soundVolume: 0.25,
    refreshInterval: 3,
    fallbackMode: false,
    showAtmosphere: true,
    showFlightArcs: true,
    telemetrySpeed: 1,
    demoDataBanner: true,
  };

  if (typeof window === 'undefined') return defaults;

  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      return { ...defaults, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.warn('Failed to parse local stored settings:', e);
  }
  return defaults;
}

interface NexusState {
  // Navigation
  activeTab: NavigationTab;
  setTab: (tab: NavigationTab) => void;

  // Globe & Nodes
  nodes: GlobeNode[];
  selectedNodeId: string | null;
  hoveredNodeId: string | null;
  setSelectedNodeId: (id: string | null) => void;
  setHoveredNodeId: (id: string | null) => void;
  pingNode: (id: string) => void;
  toggleNodeFailover: (id: string) => void;

  // Telemetry
  telemetryHistory: TelemetryPoint[];
  currentStats: {
    totalRequestsPerSec: number;
    activeInferences: number;
    avgLatencyMs: number;
    globalHealth: number;
    gpuComputeLoad: number;
    networkBandwidthGbps: number;
    tokensPerSecond: number;
    costPerHour: number;
  };
  tickTelemetry: () => void;

  // Events & Filter
  events: SystemEvent[];
  eventSearch: string;
  eventSeverityFilter: string;
  eventCategoryFilter: string;
  setEventSearch: (query: string) => void;
  setEventSeverityFilter: (severity: string) => void;
  setEventCategoryFilter: (category: string) => void;
  addEvent: (event: Omit<SystemEvent, 'id' | 'timestamp'>) => void;
  generateSimulatedIncident: () => void;

  // Notifications
  notifications: NotificationItem[];
  unreadCount: number;
  isNotificationOpen: boolean;
  setIsNotificationOpen: (open: boolean) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;

  // Command Palette
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;

  // AI Assistant (Simulated)
  assistantMessages: AssistantMessage[];
  isAssistantThinking: boolean;
  sendMessageToAssistant: (content: string) => void;
  clearAssistantChat: () => void;

  // User Settings
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  resetSettings: () => void;

  // Toasts
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;

  // Quick Global Actions
  purgeInferenceCache: () => void;
  rebalanceTraffic: () => void;
  restartMeshCluster: () => void;
}

export const useNexusStore = create<NexusState>((set, get) => {
  const initialSettings = loadStoredSettings();
  soundManager.init(initialSettings.soundEnabled, initialSettings.soundVolume);

  return {
    // Navigation
    activeTab: 'landing',
    setTab: (tab) => {
      soundManager.playClick();
      set({ activeTab: tab });
    },

    // Nodes
    nodes: INITIAL_NODES,
    selectedNodeId: null,
    hoveredNodeId: null,
    setSelectedNodeId: (id) => {
      if (id) {
        soundManager.playNodeSelect();
      }
      set({ selectedNodeId: id });
    },
    setHoveredNodeId: (id) => set({ hoveredNodeId: id }),

    pingNode: (id) => {
      const node = get().nodes.find((n) => n.id === id);
      if (!node) return;

      const randomDelta = (Math.random() - 0.5) * 3;
      const newLatency = +(Math.max(4, node.latencyMs + randomDelta)).toFixed(1);

      set((state) => ({
        nodes: state.nodes.map((n) =>
          n.id === id ? { ...n, latencyMs: newLatency, lastPing: new Date().toISOString() } : n
        ),
      }));

      soundManager.playExecute();
      get().addToast({
        title: `Pinged ${node.name} (${node.city})`,
        message: `Echo response received in ${newLatency}ms. RTT roundtrip normal.`,
        type: 'success',
      });
    },

    toggleNodeFailover: (id) => {
      const node = get().nodes.find((n) => n.id === id);
      if (!node) return;

      const newStatus = node.status === 'online' ? 'degraded' : 'online';
      set((state) => ({
        nodes: state.nodes.map((n) =>
          n.id === id ? { ...n, status: newStatus } : n
        ),
      }));

      soundManager.playAlert();
      get().addToast({
        title: `Node Failover Toggled: ${node.name}`,
        message: `State changed to ${newStatus.toUpperCase()}. Traffic rerouted.`,
        type: newStatus === 'online' ? 'success' : 'warning',
      });

      get().addEvent({
        severity: newStatus === 'online' ? 'info' : 'warning',
        category: 'Cluster',
        title: `Node ${node.name} Status: ${newStatus}`,
        description: `Manual operator failover toggle executed on datacenter ${node.datacenter}.`,
        nodeId: node.id,
        region: node.region,
        metadata: { previousStatus: node.status, newStatus },
      });
    },

    // Telemetry
    telemetryHistory: generateInitialTelemetry(),
    currentStats: {
      totalRequestsPerSec: 42180,
      activeInferences: 37490,
      avgLatencyMs: 24.3,
      globalHealth: 99.98,
      gpuComputeLoad: 68.4,
      networkBandwidthGbps: 42.6,
      tokensPerSecond: 184500,
      costPerHour: 48.72,
    },

    tickTelemetry: () => {
      set((state) => {
        const jitter = (Math.random() - 0.5) * 1200;
        const newRps = Math.round(Math.max(25000, state.currentStats.totalRequestsPerSec + jitter));
        const newInferences = Math.round(newRps * 0.89);
        const newLatency = +(23 + Math.random() * 3.5).toFixed(1);
        const newGpuLoad = +(65 + Math.random() * 7).toFixed(1);
        const newBandwidth = +(40 + Math.random() * 5).toFixed(1);
        const newTokens = Math.round(newInferences * 4.9);
        const newCost = +(45 + (newRps / 1000) * 0.08).toFixed(2);

        // Update telemetry history array
        const newPoint: TelemetryPoint = {
          timestamp: new Date().toISOString(),
          requests: newRps,
          inferences: newInferences,
          p50Latency: +(newLatency * 0.75).toFixed(1),
          p95Latency: +(newLatency * 1.5).toFixed(1),
          p99Latency: +(newLatency * 2.4).toFixed(1),
          tokenInput: Math.round(newRps * 420),
          tokenOutput: Math.round(newRps * 175),
          errorRate: +(0.012 + (Math.random() * 0.005)).toFixed(3),
          costPerHour: newCost,
        };

        const updatedHistory = [...state.telemetryHistory.slice(1), newPoint];

        // Slightly nudge active nodes metrics
        const updatedNodes = state.nodes.map((node) => {
          if (Math.random() > 0.4) {
            const cpuJitter = (Math.random() - 0.5) * 4;
            const tpsJitter = (Math.random() - 0.5) * 150;
            return {
              ...node,
              cpuLoad: Math.min(95, Math.max(20, Math.round(node.cpuLoad + cpuJitter))),
              tps: Math.max(800, Math.round(node.tps + tpsJitter)),
            };
          }
          return node;
        });

        return {
          telemetryHistory: updatedHistory,
          nodes: updatedNodes,
          currentStats: {
            ...state.currentStats,
            totalRequestsPerSec: newRps,
            activeInferences: newInferences,
            avgLatencyMs: newLatency,
            gpuComputeLoad: newGpuLoad,
            networkBandwidthGbps: newBandwidth,
            tokensPerSecond: newTokens,
            costPerHour: newCost,
          },
        };
      });
    },

    // Events
    events: INITIAL_EVENTS,
    eventSearch: '',
    eventSeverityFilter: 'all',
    eventCategoryFilter: 'all',
    setEventSearch: (query) => set({ eventSearch: query }),
    setEventSeverityFilter: (severity) => set({ eventSeverityFilter: severity }),
    setEventCategoryFilter: (category) => set({ eventCategoryFilter: category }),

    addEvent: (eventData) => {
      const newEvent: SystemEvent = {
        ...eventData,
        id: `evt-${Date.now().toString(36)}`,
        timestamp: new Date().toISOString(),
      };
      set((state) => ({
        events: [newEvent, ...state.events].slice(0, 50),
      }));
    },

    generateSimulatedIncident: () => {
      const nodes = get().nodes;
      const targetNode = nodes[Math.floor(Math.random() * nodes.length)];
      soundManager.playAlert();

      get().addEvent({
        severity: 'critical',
        category: 'Cluster',
        title: `Simulated Latency Spike Detected`,
        description: `Synthetic incident injected on ${targetNode.name} (${targetNode.city}). Automatic traffic diversion triggered.`,
        nodeId: targetNode.id,
        region: targetNode.region,
        metadata: {
          testScenario: 'E2E Failover Drill',
          simulatedPeakLatency: 480,
          action: 'Auto-balancing enabled',
        },
      });

      get().addToast({
        title: 'Simulation: Incident Triggered',
        message: `Injected latency anomaly on ${targetNode.city} datacenter. Failover routine initiated.`,
        type: 'error',
      });
    },

    // Notifications
    notifications: INITIAL_NOTIFICATIONS,
    unreadCount: INITIAL_NOTIFICATIONS.filter((n) => !n.read).length,
    isNotificationOpen: false,
    setIsNotificationOpen: (open) => {
      soundManager.playClick();
      set({ isNotificationOpen: open });
    },
    markNotificationRead: (id) => {
      set((state) => {
        const updated = state.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        );
        return {
          notifications: updated,
          unreadCount: updated.filter((n) => !n.read).length,
        };
      });
    },
    markAllNotificationsRead: () => {
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
        unreadCount: 0,
      }));
    },
    clearNotifications: () => {
      set({ notifications: [], unreadCount: 0 });
    },

    // Command Palette
    isCommandPaletteOpen: false,
    setIsCommandPaletteOpen: (open) => {
      soundManager.playClick();
      set({ isCommandPaletteOpen: open });
    },

    // AI Assistant (Simulated)
    assistantMessages: [
      {
        id: 'msg-0',
        sender: 'assistant',
        content: `Greetings Operator. I am **NEXUS Core AI** (Autonomous Telemetry Copilot). All 12 edge compute clusters are operating within optimal latency bounds. How can I assist you with cluster orchestration, traffic diagnostics, or model operations today?`,
        timestamp: new Date().toISOString(),
        suggestedAction: {
          label: 'Run Full Health Diagnostic',
          actionType: 'DIAGNOSTIC_RUN',
        },
      },
    ],
    isAssistantThinking: false,

    sendMessageToAssistant: (userPrompt: string) => {
      if (!userPrompt.trim()) return;

      const userMsg: AssistantMessage = {
        id: `user-${Date.now()}`,
        sender: 'user',
        content: userPrompt,
        timestamp: new Date().toISOString(),
      };

      set((state) => ({
        assistantMessages: [...state.assistantMessages, userMsg],
        isAssistantThinking: true,
      }));

      soundManager.playClick();

      // Simulate AI Copilot reasoning & response
      setTimeout(() => {
        const query = userPrompt.toLowerCase();
        let reply = '';
        let suggestion: AssistantMessage['suggestedAction'] | undefined = undefined;

        if (query.includes('diagnostic') || query.includes('health') || query.includes('status')) {
          reply = `### System Diagnostics Report\n\n- **Global Health**: 99.98% Available\n- **Active Edge Nodes**: 12/12 Online\n- **P95 Latency**: 32.4ms across inter-regional routes\n- **Compute Saturation**: Low (GPU matrix load steady at ~68%)\n\nRecommendation: Everything is nominal. No immediate routing rebalances required.`;
          suggestion = { label: 'Rebalance Global Traffic', actionType: 'REBALANCE' };
        } else if (query.includes('rebalance') || query.includes('traffic') || query.includes('route')) {
          reply = `Analyzing optical transit paths across North America, Europe, and APAC.\n\nOptimal routing paths calculated: Redirecting 12% of peak North American ingress through Chicago and Ashburn edge nodes.\n\nExecution ready. Would you like me to commit the routing tables?`;
          suggestion = { label: 'Apply Traffic Rebalance', actionType: 'REBALANCE' };
        } else if (query.includes('cache') || query.includes('purge') || query.includes('memory')) {
          reply = `Inference cache holds approximately **14.2 GB** of cached KV-states and pre-computed embedding layers. Purging will free up VRAM but temporarily increase model warm-up time by ~120ms.`;
          suggestion = { label: 'Purge Inference Cache', actionType: 'PURGE_CACHE' };
        } else if (query.includes('node') || query.includes('frankfurt') || query.includes('tokyo') || query.includes('sf')) {
          reply = `Selected node telemetry indicates zero packet loss over the last 60 minutes. Model weights for **Nexus-Prime-70B** and **Claude-3.5-Sonnet** are hot in memory.`;
          suggestion = { label: 'Inspect Globe Nodes', actionType: 'NAVIGATE_GLOBE' };
        } else {
          reply = `Query processed across cluster telemetry logs.\n\nCurrent cluster throughput is **${get().currentStats.totalRequestsPerSec.toLocaleString()} req/s** with an error rate of **0.01%**. All 12 edge datacenters are connected via redundant mTLS mesh channels.`;
          suggestion = { label: 'View Detailed Analytics', actionType: 'NAVIGATE_ANALYTICS' };
        }

        const assistantMsg: AssistantMessage = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          content: reply,
          timestamp: new Date().toISOString(),
          suggestedAction: suggestion,
        };

        set((state) => ({
          assistantMessages: [...state.assistantMessages, assistantMsg],
          isAssistantThinking: false,
        }));
        soundManager.playExecute();
      }, 700);
    },

    clearAssistantChat: () => {
      set({
        assistantMessages: [
          {
            id: `msg-${Date.now()}`,
            sender: 'assistant',
            content: 'Chat session reset. NEXUS Core AI ready for commands.',
            timestamp: new Date().toISOString(),
          },
        ],
      });
    },

    // Settings
    settings: initialSettings,
    updateSettings: (newSettings) => {
      set((state) => {
        const updated = { ...state.settings, ...newSettings };
        try {
          localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
        } catch (e) {
          console.warn('Failed to save settings:', e);
        }
        if (newSettings.soundEnabled !== undefined || newSettings.soundVolume !== undefined) {
          soundManager.updateConfig(updated.soundEnabled, updated.soundVolume);
        }
        return { settings: updated };
      });
    },

    resetSettings: () => {
      const defaults: UserSettings = {
        theme: 'dark',
        globeQuality: 'high',
        autoRotate: true,
        particleDensity: 2400,
        reducedMotion: false,
        soundEnabled: true,
        soundVolume: 0.25,
        refreshInterval: 3,
        fallbackMode: false,
        showAtmosphere: true,
        showFlightArcs: true,
        telemetrySpeed: 1,
        demoDataBanner: true,
      };
      try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(defaults));
      } catch (e) {}
      soundManager.updateConfig(defaults.soundEnabled, defaults.soundVolume);
      set({ settings: defaults });
      get().addToast({
        title: 'Settings Reset',
        message: 'All application preferences restored to factory defaults.',
        type: 'info',
      });
    },

    // Toasts
    toasts: [],
    addToast: (toastData) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const newToast: Toast = { ...toastData, id };

      set((state) => ({
        toasts: [...state.toasts, newToast].slice(-5), // max 5 visible toasts
      }));

      const duration = toastData.duration || 4500;
      setTimeout(() => {
        get().removeToast(id);
      }, duration);
    },
    removeToast: (id) => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    },

    // Quick Actions
    purgeInferenceCache: () => {
      soundManager.playExecute();
      get().addToast({
        title: 'Inference Cache Flushed',
        message: 'Purged 14.2 GB of GPU KV-cache across 12 clusters. VRAM reclaimed.',
        type: 'success',
      });
      get().addEvent({
        severity: 'info',
        category: 'Cluster',
        title: 'Global Inference Cache Purged',
        description: 'Operator initiated KV-cache flush across all distributed edge clusters.',
      });
    },

    rebalanceTraffic: () => {
      soundManager.playExecute();
      get().addToast({
        title: 'Traffic Rebalancing Complete',
        message: 'Dynamic BGP paths updated. Latency variance reduced by 14%.',
        type: 'success',
      });
      get().addEvent({
        severity: 'success',
        category: 'Routing',
        title: 'Mesh Network Path Rebalance',
        description: 'Autonomous optimization converged. 12 data centers balanced.',
      });
    },

    restartMeshCluster: () => {
      soundManager.playAlert();
      get().addToast({
        title: 'Rolling Restart Initiated',
        message: 'Graceful canary restart sequence initiated without zero-downtime breach.',
        type: 'warning',
      });
      get().addEvent({
        severity: 'warning',
        category: 'Cluster',
        title: 'Canary Rolling Restart Initiated',
        description: 'Zero-downtime rolling restart initiated for edge cluster pods.',
      });
    },
  };
});
