import * as THREE from 'three';

// Procedural high-resolution digital globe landmass canvas texture
export function createEarthCanvasTexture(): THREE.CanvasTexture {
  const width = 2048;
  const height = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    const fallback = new THREE.CanvasTexture(canvas);
    return fallback;
  }

  // Deep space ocean background
  ctx.fillStyle = '#050914';
  ctx.fillRect(0, 0, width, height);

  // Subtle lat-long grid lines
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
  ctx.lineWidth = 1;

  for (let lat = -80; lat <= 80; lat += 20) {
    const y = ((90 - lat) / 180) * height;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  for (let lng = -180; lng <= 180; lng += 30) {
    const x = ((lng + 180) / 360) * width;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  // Draw procedural continental clusters using digital dot matrix
  ctx.fillStyle = 'rgba(0, 245, 255, 0.65)';

  // Approximate continent boundaries as rectangular / circular density zones
  const landmasses = [
    // North America
    { minLat: 15, maxLat: 68, minLng: -160, maxLng: -55 },
    // South America
    { minLat: -55, maxLat: 12, minLng: -82, maxLng: -34 },
    // Europe
    { minLat: 36, maxLat: 70, minLng: -10, maxLng: 40 },
    // Africa
    { minLat: -35, maxLat: 37, minLng: -18, maxLng: 52 },
    // Asia
    { minLat: 5, maxLat: 72, minLng: 40, maxLng: 170 },
    // Australia
    { minLat: -44, maxLat: -10, minLng: 112, maxLng: 154 },
    // UK & Ireland
    { minLat: 50, maxLat: 59, minLng: -10, maxLng: 2 },
    // Japan
    { minLat: 30, maxLat: 45, minLng: 129, maxLng: 146 },
    // India
    { minLat: 8, maxLat: 34, minLng: 68, maxLng: 89 },
    // Scandinavia
    { minLat: 55, maxLat: 71, minLng: 4, maxLng: 32 },
  ];

  // Populate continent dot matrix
  landmasses.forEach((land) => {
    const latSpan = land.maxLat - land.minLat;
    const lngSpan = land.maxLng - land.minLng;
    const density = 250;

    for (let i = 0; i < density; i++) {
      const lat = land.minLat + Math.random() * latSpan;
      const lng = land.minLng + Math.random() * lngSpan;

      const x = ((lng + 180) / 360) * width;
      const y = ((90 - lat) / 180) * height;

      // Glow effect for continent nodes
      const radius = 1.2 + Math.random() * 1.6;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = Math.random() > 0.4 ? 'rgba(0, 245, 255, 0.8)' : 'rgba(168, 85, 247, 0.7)';
      ctx.fill();
    }
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}
