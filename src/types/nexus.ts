export type NavigationTab = 
  | 'landing' 
  | 'overview' 
  | 'globe' 
  | 'analytics' 
  | 'events' 
  | 'assistant' 
  | 'settings';

export type NodeStatus = 'online' | 'degraded' | 'critical' | 'maintenance';

export type EventSeverity = 'critical' | 'warning' | 'info' | 'success';

export type EventCategory = 'Security' | 'Inference' | 'Cluster' | 'Routing' | 'Model Ops';

export interface GlobeNode {
  id: string;
  name: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  status: NodeStatus;
  region: string;
  datacenter: string;
  latencyMs: number;
  tps: number;
  cpuLoad: number;
  memoryLoad: number;
  activeModels: string[];
  connections: string[]; // Connected Node IDs
  incidentsCount: number;
  ipAddress: string;
  lastPing: string;
}

export interface TelemetryPoint {
  timestamp: string;
  requests: number;
  inferences: number;
  p50Latency: number;
  p95Latency: number;
  p99Latency: number;
  tokenInput: number;
  tokenOutput: number;
  errorRate: number;
  costPerHour: number;
}

export interface ModelMetrics {
  name: string;
  requests: number;
  avgLatency: number;
  tokens: number;
  cost: number;
  sharePercent: number;
  color: string;
}

export interface SystemEvent {
  id: string;
  timestamp: string;
  severity: EventSeverity;
  category: EventCategory;
  title: string;
  description: string;
  nodeId?: string;
  region?: string;
  metadata?: Record<string, any>;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  severity: EventSeverity;
  category: string;
  read: boolean;
  linkTab?: NavigationTab;
}

export type ThemeMode = 'dark' | 'light' | 'cyberpunk';
export type GlobeQuality = 'ultra' | 'high' | 'balanced' | 'low';

export interface UserSettings {
  theme: ThemeMode;
  globeQuality: GlobeQuality;
  autoRotate: boolean;
  particleDensity: number;
  reducedMotion: boolean;
  soundEnabled: boolean;
  soundVolume: number;
  refreshInterval: number; // in seconds
  fallbackMode: boolean; // 2D fallback map
  showAtmosphere: boolean;
  showFlightArcs: boolean;
  telemetrySpeed: number; // 1 = normal, 2 = fast
  demoDataBanner: boolean;
}

export interface AssistantMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  suggestedAction?: {
    label: string;
    actionType: string;
    payload?: any;
  };
}

export interface Toast {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'warning' | 'error' | 'info';
  duration?: number;
}
