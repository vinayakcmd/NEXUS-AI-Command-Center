import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import { TelemetryTicker } from '../components/layout/TelemetryTicker';
import { useNexusStore } from '../store/useNexusStore';

describe('NEXUS Component Interactions', () => {
  it('renders TelemetryTicker with live simulation badge and metrics', () => {
    render(<TelemetryTicker />);
    expect(screen.getByText(/Simulated Telemetry • Live/i)).toBeInTheDocument();
    expect(screen.getByText(/RPS:/i)).toBeInTheDocument();
    expect(screen.getByText(/Inferences:/i)).toBeInTheDocument();
    expect(screen.getByText(/Avg Latency:/i)).toBeInTheDocument();
  });

  it('renders Sidebar with all navigation options', () => {
    const handleToggle = () => {};
    const handleCloseMobile = () => {};

    render(
      <Sidebar
        collapsed={false}
        onToggleCollapse={handleToggle}
        mobileOpen={false}
        onCloseMobile={handleCloseMobile}
      />
    );

    expect(screen.getByText('Command Core')).toBeInTheDocument();
    expect(screen.getByText(/Landing Hero/i)).toBeInTheDocument();
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/3D Edge Globe/i)).toBeInTheDocument();
    expect(screen.getByText(/Telemetry Analytics/i)).toBeInTheDocument();
    expect(screen.getByText(/Event Logs/i)).toBeInTheDocument();
    expect(screen.getByText(/NEXUS Copilot/i)).toBeInTheDocument();
    expect(screen.getByText(/System Settings/i)).toBeInTheDocument();
  });

  it('navigates to different views when clicking sidebar buttons', () => {
    render(
      <Sidebar
        collapsed={false}
        onToggleCollapse={() => {}}
        mobileOpen={false}
        onCloseMobile={() => {}}
      />
    );

    const analyticsButton = screen.getByText(/Telemetry Analytics/i);
    fireEvent.click(analyticsButton);
    expect(useNexusStore.getState().activeTab).toBe('analytics');

    const globeButton = screen.getByText(/3D Edge Globe/i);
    fireEvent.click(globeButton);
    expect(useNexusStore.getState().activeTab).toBe('globe');
  });
});
