import '@testing-library/jest-dom';

// Mock Web Audio API for headless test environment
if (typeof window !== 'undefined') {
  (window as any).AudioContext = class {
    currentTime = 0;
    state = 'running';
    createOscillator() {
      return {
        type: 'sine',
        frequency: {
          setValueAtTime: () => {},
          exponentialRampToValueAtTime: () => {},
        },
        connect: () => {},
        start: () => {},
        stop: () => {},
      };
    }
    createGain() {
      return {
        gain: {
          setValueAtTime: () => {},
          exponentialRampToValueAtTime: () => {},
        },
        connect: () => {},
      };
    }
    resume() {
      return Promise.resolve();
    }
  };

  // Mock ResizeObserver
  (window as any).ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}
