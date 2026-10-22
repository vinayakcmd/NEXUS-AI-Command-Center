# NEXUS — Planetary 3D AI Command Center & Telemetry Hub

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue.svg)]()
[![React](https://img.shields.io/badge/React-19-cyan.svg)]()
[![Three.js](https://img.shields.io/badge/Three.js-R3F-purple.svg)]()
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4.svg)]()
[![License](https://img.shields.io/badge/License-MIT-green.svg)]()

> **NEXUS** is a futuristic, cinematic AI command center and planetary telemetry platform built with React, Vite, TypeScript, Three.js (React Three Fiber & Drei), Recharts, Zustand, and Tailwind CSS. It empowers platform engineers, AI operators, and infrastructure leads to monitor distributed foundation models, track inter-continental optical latency, and execute automated mesh failover drills.

---

## 🌌 Key Highlights & Architectural Features

### 1. Cinematic 3D Holographic Earth Mesh
- **Interactive 3D Planetary Sphere**: Rendered using Three.js with procedural high-resolution landmass dot matrix generation (no external textures or network assets required).
- **Curved Quadratic Bezier Arcs**: Dynamic inter-continental flight lines connecting 12 worldwide edge nodes, complete with animated photon packets racing along telemetry trajectories.
- **Orbital Satellite Rings**: Multi-axis inclined orbital rings with real-time rotating telemetry transponders.
- **Atmospheric Glow & Starfield**: Custom Fresnel rim shader with additive cyan-violet backlighting and a multi-layered procedural starfield with 2,400+ depth-attenuated particles.
- **Target Node Fly-To**: Smooth camera interpolation, zoom controls, and interactive raycasted hit detection.
- **Adaptive Fallback Engine**: Seamless 2D SVG interactive radar map with real-time ping waves and link arcs for devices without WebGL or when low-spec/reduced-motion is toggled.

### 2. Operations Dashboard & Telemetry Stream
- **Real-time KPI Metrics**: Live stream of Total Inbound Requests (`~42k req/s`), Concurrent Active Inferences (`~37k`), P95 Latency (`~24ms`), and Global Availability (`99.98%`).
- **Distributed Resource Load**: Real-time compute saturation meters for GPU Matrix VRAM (4,096 H100s pooled), Neural Engine token generation, fiber bandwidth, and hourly cost telemetry.
- **Foundation Model Registry**: Real-time telemetry monitoring for `Nexus-Prime-70B`, `Claude-3.5-Sonnet`, `GPT-4o-Turbo`, `DeepSeek-R1`, and `Llama-3.3-70B`.
- **Global Mesh Miniature Preview**: Direct interaction mini-globe with jump-to-full-screen mode.

### 3. Planetary 3D Edge Command Center (`GlobeView`)
- 12 Tier-1 global datacenters mapped with precise latitude/longitude:
  - `US-WEST-1` (San Francisco / Silicon Valley)
  - `US-EAST-1` (Ashburn / Virginia)
  - `EU-WEST-1` (London)
  - `EU-CENTRAL-1` (Frankfurt)
  - `AP-EAST-1` (Tokyo)
  - `AP-SOUTHEAST-1` (Singapore)
  - `AP-SOUTH-1` (Mumbai)
  - `AP-SOUTHEAST-2` (Sydney)
  - `SA-EAST-1` (São Paulo)
  - `ME-CENTRAL-1` (Dubai)
  - `EU-NORTH-1` (Stockholm)
  - `AF-SOUTH-1` (Cape Town)
- **Contextual Inspection Drawer**: Real-time roundtrip ping echo tests, CPU & memory gauges, optical transit peers, and one-click failover simulation.

### 4. High-Resolution Inferences & Cost Analytics (`AnalyticsView`)
- **Throughput & Inference Area Chart**: Dual-gradient visualizer for concurrent inbound requests vs processed model inferences.
- **P50 / P95 / P99 Tail Latency Chart**: Interactive Recharts multi-line percentiles monitor with precision tooltips.
- **Token Input vs Output Bar Chart**: Compares prompt tokens vs completion tokens generated across the mesh.
- **Continental TPS Bar Chart**: Regional load breakdown comparing Americas, EMEA, and APAC.
- **Foundation Model Share Donut Chart**: Proportional GPU compute allocation by model family.
- **CSV Data Exporter**: One-click download of raw time series data for offline auditing.

### 5. Distributed Event Stream & Audit Log (`EventsView`)
- Real-time audit logs with multi-level severity badges (`Critical`, `Warning`, `Info`, `Success`).
- Filter by Category (`Security`, `Inference`, `Cluster`, `Routing`, `Model Ops`).
- Expandable raw JSON metadata payload with one-click **Copy to Clipboard**.
- Synthetic Incident Generator button to trigger manual cluster failover drills.

### 6. NEXUS Core AI Copilot (`AssistantView`)
- Autonomous infrastructure triage copilot with natural streaming reasoning indicators.
- Quick prompt buttons for cluster health diagnostics, BGP rebalancing, KV-cache purging, and latency spike diagnostics.
- Directly executable action pills embedded within assistant responses.
- *Clearly disclosed as simulated telemetry copilot in compliance with enterprise requirements.*

### 7. Global Command Palette & Notification Center
- **Searchable Command Palette**: Activated via `Ctrl + K` or `Cmd + K`, offering instant fuzzy jumping to pages, executing operations, and selecting nodes.
- **Slide-Over Notification Center**: Unread badge count, categorical filter (Alerts, Deployments, System), and mark-all-as-read actions.
- **Synthesizer Web Audio System**: Client-side Web Audio API oscillator feedback for clicks, node selection chimes, command execution, and warning alarms.
- **Persistent Settings**: Saves theme, 3D quality, particle count, sound FX, refresh rates, and 2D fallback mode into browser `LocalStorage`.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19, TypeScript 6, Vite 8 |
| **3D Engine** | Three.js, React Three Fiber (R3F), React Three Drei |
| **Styling** | Tailwind CSS v4, Glassmorphism, CSS Variables |
| **State Management** | Zustand with LocalStorage persistence |
| **Data Visualizations** | Recharts (ResponsiveContainer, AreaChart, LineChart, BarChart, PieChart) |
| **Icons & Audio** | Lucide React, Web Audio API Synthesizer |
| **Testing** | Vitest, React Testing Library, JSDOM |
| **Deployment** | Vercel Ready (`vercel.json` included) |

---

## 📁 Project Structure

```
nexus/
├── public/
│   └── favicon.svg               # Sci-fi SVG branded favicon
├── src/
│   ├── components/
│   │   ├── 3d/
│   │   │   ├── NexusGlobe.tsx        # Main 3D canvas, OrbitControls, lighting & HUD
│   │   │   ├── GlobeNodes.tsx        # 3D spherical node beacons, pulses & tooltips
│   │   │   ├── GlobeArcs.tsx         # Quadratic Bezier flight curves & photon packets
│   │   │   ├── OrbitalRings.tsx      # Multi-axis inclined orbital satellite rings
│   │   │   ├── GlobeAtmosphere.tsx   # Custom Fresnel rim atmosphere shader
│   │   │   ├── Starfield.tsx         # Particle system background stars
│   │   │   ├── earthTexture.ts       # Procedural continent canvas dot matrix generator
│   │   │   └── GlobeFallback2D.tsx   # 2D SVG radar map fallback engine
│   │   └── layout/
│   │       ├── Header.tsx            # Navigation header with sound, theme & search triggers
│   │       ├── Sidebar.tsx           # Collapsible sci-fi navigation sidebar
│   │       ├── TelemetryTicker.tsx   # Top real-time marquee telemetry status bar
│   │       ├── CommandPalette.tsx    # Ctrl+K / Cmd+K searchable command HUD
│   │       ├── NotificationCenter.tsx# Slide-over alert drawer
│   │       └── ToastProvider.tsx     # Animated sci-fi toast notifications
│   ├── store/
│   │   └── useNexusStore.ts      # Zustand state store with actions & LocalStorage sync
│   ├── types/
│   │   └── nexus.ts              # Strict TypeScript interfaces for nodes, telemetry & events
│   ├── utils/
│   │   ├── audio.ts              # Web Audio API synthesizer for sound effects
│   │   ├── formatters.ts         # Number, currency, timestamp & latency formatters
│   │   └── geo.ts                # Spherical coordinate conversion & Haversine math
│   ├── views/
│   │   ├── LandingView.tsx       # Cinematic hero landing view with 3D backdrop
│   │   ├── DashboardView.tsx     # System KPI meters, GPU compute load & active models
│   │   ├── GlobeView.tsx         # Dedicated full-screen 3D edge node command center
│   │   ├── AnalyticsView.tsx     # Multi-metric Recharts telemetry & CSV exporter
│   │   ├── EventsView.tsx        # Audit event logs with expandable JSON viewer
│   │   ├── AssistantView.tsx     # NEXUS Core AI copilot dialogue interface
│   │   └── SettingsView.tsx      # System calibration, 3D quality & accessibility options
│   ├── test/
│   │   ├── setup.ts              # Vitest JSDOM & Web Audio test mocks
│   │   ├── nexus.test.ts         # Unit tests for store, failovers & incidents
│   │   └── components.test.tsx   # Component rendering & navigation interaction tests
│   ├── App.tsx                   # Main layout shell, router & telemetry tick loop
│   ├── index.css                 # Sci-fi glassmorphism design tokens & animations
│   └── main.tsx                  # Vite application entry point
├── .env.example                  # Environment configuration template
├── package.json                  # Dependencies, test & build scripts
├── tsconfig.json                 # TypeScript compiler configuration
├── vercel.json                   # Vercel deployment & caching rules
├── vite.config.ts                # Vite config with Tailwind & Vitest integration
└── README.md                     # Architecture documentation & setup guide
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js `v18.0.0` or higher (tested on Node v20 & v24)
- npm `v9.0.0` or higher

### Installation

1. Navigate to the `nexus` directory:
   ```bash
   cd nexus
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

### Running Automated Tests

Run the test suite using Vitest:
```bash
npm test
```
*Executes all 11 unit and component interaction tests.*

### Building for Production

Compile optimized production assets:
```bash
npm run build
```
The production bundle will be generated in `dist/`.

To test the production build locally:
```bash
npm run preview
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl + K` or `Cmd + K` | Open searchable Command Palette |
| `Escape` | Close Command Palette / Modals / Notifications |
| `Arrow Up` / `Arrow Down` | Navigate list items in Command Palette |
| `Enter` | Execute selected command or navigate to node |

---

## 🌐 Deployment to Vercel

The repository is configured for one-click deployment to [Vercel](https://vercel.com):

1. Push your repository to GitHub.
2. In Vercel, click **"Add New Project"** and import the repository.
3. Set the **Root Directory** to `nexus` (or `./` if deployed directly from root).
4. Framework Preset: **Vite**.
5. Build Command: `npm run build`.
6. Output Directory: `dist`.
7. Click **Deploy**.

The included `vercel.json` ensures all client-side routes rewrite to `/index.html` and static assets receive optimal cache headers.

---

## 🔒 Enterprise & Accessibility Standards

- **Reduced Motion Support**: Honoring the user's OS `prefers-reduced-motion` settings and offering a dedicated toggle in Settings to halt continuous orbital animations.
- **Audio Feedback Controls**: Synthesizer audio effects use the browser's native Web Audio API, require zero external audio file downloads, and remain easily toggleable or volume-adjustable.
- **Keyboard Navigation & ARIA**: Visible focus states on interactive buttons, inputs, and drawers with full keyboard support.
- **Honest AI Disclosure**: All simulated AI interactions and generated synthetic incidents are explicitly demarcated as simulated telemetry.

---

## 📄 License

Distributed under the MIT License. Built for futuristic infrastructure operations.
