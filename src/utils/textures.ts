import * as THREE from 'three';

// Cache generated textures so each planet canvas is rendered only once
const textureCache = new Map<string, THREE.CanvasTexture>();

/**
 * Procedural Planetary Texture Generator
 * Implements design.md §11, §12, §13:
 * - Jupiter: authentic horizontal atmospheric bands, shear turbulence, Great Red Spot
 * - Mars: rusty iron-oxide red, dark basaltic albedo markings, polar ice caps
 * - Earth: deep oceans, continental landmasses, cloud swirl patterns
 * - Saturn: delicate banded gold/cream atmosphere
 * - Venus: dense sulfuric cream-yellow atmospheric circulation
 * - Mercury: rocky cratered gray surface
 * - Uranus & Neptune: subtle atmospheric gradients and storm spots
 */
export function getPlanetTexture(planetId: string): THREE.CanvasTexture | null {
  if (typeof document === 'undefined') return null;

  if (textureCache.has(planetId)) {
    return textureCache.get(planetId)!;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const w = canvas.width;
  const h = canvas.height;

  switch (planetId) {
    case 'jupiter': {
      // Base warm cream
      ctx.fillStyle = '#d6b38a';
      ctx.fillRect(0, 0, w, h);

      // Atmospheric bands (zones and belts)
      const bands = [
        { y: 0.05, h: 0.08, color: '#9e623a' }, // Polar zone
        { y: 0.15, h: 0.07, color: '#ba7a4e' },
        { y: 0.24, h: 0.10, color: '#eedec5' }, // North Tropical Zone
        { y: 0.35, h: 0.09, color: '#8f4b26' }, // North Equatorial Belt
        { y: 0.45, h: 0.08, color: '#f5eadc' }, // Equatorial Zone
        { y: 0.54, h: 0.11, color: '#7a391c' }, // South Equatorial Belt
        { y: 0.66, h: 0.09, color: '#eedcc2' }, // South Tropical Zone
        { y: 0.76, h: 0.08, color: '#a66a42' },
        { y: 0.85, h: 0.08, color: '#824e2c' }, // South Polar
      ];

      bands.forEach((b) => {
        ctx.fillStyle = b.color;
        ctx.fillRect(0, b.y * h, w, b.h * h);

        // Shear turbulence along band margins
        ctx.fillStyle = 'rgba(0, 0, 0, 0.07)';
        for (let i = 0; i < 30; i++) {
          const x = (i / 30) * w;
          ctx.beginPath();
          ctx.ellipse(x, b.y * h, 25, 4, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Subtle fine zonal striations across the gas giant
      for (let y = 0; y < h; y += 4) {
        const noise = (Math.sin(y * 0.15) + Math.cos(y * 0.3)) * 0.5;
        ctx.fillStyle = noise > 0 ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
        ctx.fillRect(0, y, w, 2);
      }

      // Great Red Spot (southern hemisphere, ~60% height)
      const grsX = w * 0.55;
      const grsY = h * 0.62;
      const grsRadiusX = 45;
      const grsRadiusY = 28;

      const spotGrad = ctx.createRadialGradient(grsX, grsY, 5, grsX, grsY, grsRadiusX);
      spotGrad.addColorStop(0, '#c43b21');
      spotGrad.addColorStop(0.6, '#b0341b');
      spotGrad.addColorStop(1, 'rgba(150, 50, 30, 0)');
      ctx.fillStyle = spotGrad;
      ctx.beginPath();
      ctx.ellipse(grsX, grsY, grsRadiusX, grsRadiusY, 0, 0, Math.PI * 2);
      ctx.fill();

      // Core swirl of the Great Red Spot
      ctx.strokeStyle = 'rgba(240, 160, 120, 0.4)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(grsX, grsY, 22, 12, -0.1, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }

    case 'mars': {
      // Rusty iron-oxide orange base
      const marsGrad = ctx.createLinearGradient(0, 0, 0, h);
      marsGrad.addColorStop(0, '#a64426');
      marsGrad.addColorStop(0.5, '#c75936');
      marsGrad.addColorStop(1, '#a64426');
      ctx.fillStyle = marsGrad;
      ctx.fillRect(0, 0, w, h);

      // Dark volcanic basaltic albedo regions (Syrtis Major, Mare Tyrrhenum)
      ctx.fillStyle = '#6e2f1f';
      const darkRegions = [
        { x: 0.35, y: 0.45, rx: 90, ry: 45 },
        { x: 0.50, y: 0.52, rx: 110, ry: 50 },
        { x: 0.75, y: 0.48, rx: 80, ry: 40 },
        { x: 0.20, y: 0.55, rx: 60, ry: 35 },
      ];
      darkRegions.forEach((r) => {
        ctx.beginPath();
        ctx.ellipse(r.x * w, r.y * h, r.rx, r.ry, 0.15, 0, Math.PI * 2);
        ctx.fill();
      });

      // Surface texture variation & crater dust
      ctx.fillStyle = 'rgba(70, 20, 10, 0.15)';
      for (let i = 0; i < 80; i++) {
        const cx = Math.random() * w;
        const cy = 0.2 * h + Math.random() * (0.6 * h);
        const cr = 2 + Math.random() * 8;
        ctx.beginPath();
        ctx.arc(cx, cy, cr, 0, Math.PI * 2);
        ctx.fill();
      }

      // North & South Polar Ice Caps (pure white with soft transition)
      ctx.fillStyle = '#f0f5fc';
      // North cap
      ctx.beginPath();
      ctx.ellipse(w * 0.5, 0, w * 0.3, 35, 0, 0, Math.PI * 2);
      ctx.fill();
      // South cap
      ctx.beginPath();
      ctx.ellipse(w * 0.5, h, w * 0.25, 30, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'earth': {
      // Deep blue oceanic base
      ctx.fillStyle = '#102d5e';
      ctx.fillRect(0, 0, w, h);

      // Continent landmasses (green/brown tones)
      ctx.fillStyle = '#3a6635';
      const continents = [
        // Americas
        { x: 0.24, y: 0.32, rx: 65, ry: 75 }, // North America
        { x: 0.30, y: 0.65, rx: 50, ry: 80 }, // South America
        // Eurasia & Africa
        { x: 0.58, y: 0.32, rx: 120, ry: 70 }, // Eurasia
        { x: 0.54, y: 0.56, rx: 65, ry: 75 }, // Africa
        // Australia
        { x: 0.82, y: 0.68, rx: 42, ry: 35 },
      ];
      continents.forEach((c) => {
        ctx.beginPath();
        ctx.ellipse(c.x * w, c.y * h, c.rx, c.ry, 0, 0, Math.PI * 2);
        ctx.fill();
      });

      // Desert arid zones (Sahara, Australia, Gobi)
      ctx.fillStyle = '#8f7b49';
      ctx.beginPath();
      ctx.ellipse(0.55 * w, 0.44 * h, 48, 22, 0, 0, Math.PI * 2); // Sahara
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(0.82 * w, 0.68 * h, 28, 18, 0, 0, Math.PI * 2); // Outback
      ctx.fill();

      // Antarctica and Arctic ice
      ctx.fillStyle = '#edf4fa';
      ctx.beginPath();
      ctx.ellipse(w * 0.5, h, w * 0.45, 45, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(w * 0.5, 0, w * 0.35, 25, 0, 0, Math.PI * 2);
      ctx.fill();

      // Swirling cloud wisps
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      for (let i = 0; i < 18; i++) {
        const cx = (i / 18) * w + Math.sin(i) * 30;
        const cy = 0.2 * h + (i % 3) * 0.25 * h;
        ctx.beginPath();
        ctx.ellipse(cx % w, cy, 55, 14, 0.2, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case 'saturn': {
      // Golden/amber banded gas giant
      ctx.fillStyle = '#dfc492';
      ctx.fillRect(0, 0, w, h);

      // Subtle warm pastel bands
      const saturnBands = [
        { y: 0.1, h: 0.12, color: '#c7a76e' },
        { y: 0.26, h: 0.14, color: '#ebd6a7' },
        { y: 0.42, h: 0.16, color: '#bfa068' },
        { y: 0.60, h: 0.12, color: '#e5d0a0' },
        { y: 0.74, h: 0.14, color: '#ba9a60' },
      ];
      saturnBands.forEach((b) => {
        ctx.fillStyle = b.color;
        ctx.fillRect(0, b.y * h, w, b.h * h);
      });

      // Very soft micro-banding
      for (let y = 0; y < h; y += 3) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
        ctx.fillRect(0, y, w, 1);
      }
      break;
    }

    case 'venus': {
      // Dense sulfuric acid cream/yellow clouds
      const venusGrad = ctx.createLinearGradient(0, 0, 0, h);
      venusGrad.addColorStop(0, '#d1ab64');
      venusGrad.addColorStop(0.5, '#edd298');
      venusGrad.addColorStop(1, '#cda45e');
      ctx.fillStyle = venusGrad;
      ctx.fillRect(0, 0, w, h);

      // Broad sweeping atmospheric circulation arcs
      ctx.fillStyle = 'rgba(255, 245, 215, 0.12)';
      for (let i = 0; i < 10; i++) {
        ctx.beginPath();
        ctx.ellipse(w * 0.5, (0.15 + i * 0.08) * h, w * 0.45, 16, 0.05, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case 'mercury': {
      // Cratered barren gray rocky terrain
      ctx.fillStyle = '#8f8f94';
      ctx.fillRect(0, 0, w, h);

      // Craters: dark depressions with bright ejecta rims
      for (let i = 0; i < 90; i++) {
        const cx = Math.random() * w;
        const cy = Math.random() * h;
        const r = 3 + Math.random() * 12;

        // Rim
        ctx.fillStyle = 'rgba(210, 210, 215, 0.35)';
        ctx.beginPath();
        ctx.arc(cx, cy, r + 2, 0, Math.PI * 2);
        ctx.fill();

        // Floor
        ctx.fillStyle = 'rgba(75, 75, 80, 0.7)';
        ctx.beginPath();
        ctx.arc(cx + 1, cy + 1, r, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case 'uranus': {
      // Pale aquamarine ice giant with delicate gradient
      const uranusGrad = ctx.createLinearGradient(0, 0, 0, h);
      uranusGrad.addColorStop(0, '#58b6c7');
      uranusGrad.addColorStop(0.5, '#78d4e3');
      uranusGrad.addColorStop(1, '#56b3c4');
      ctx.fillStyle = uranusGrad;
      ctx.fillRect(0, 0, w, h);
      break;
    }

    case 'neptune': {
      // Deep azure blue ice giant with Great Dark Spot
      const neptuneGrad = ctx.createLinearGradient(0, 0, 0, h);
      neptuneGrad.addColorStop(0, '#22428f');
      neptuneGrad.addColorStop(0.5, '#355ec2');
      neptuneGrad.addColorStop(1, '#1e3c82');
      ctx.fillStyle = neptuneGrad;
      ctx.fillRect(0, 0, w, h);

      // High-altitude white methane cirrus cloud streaks
      ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
      ctx.beginPath();
      ctx.ellipse(w * 0.45, h * 0.4, 70, 7, -0.05, 0, Math.PI * 2);
      ctx.fill();

      // Great Dark Spot storm
      const stormGrad = ctx.createRadialGradient(w * 0.65, h * 0.55, 3, w * 0.65, h * 0.55, 35);
      stormGrad.addColorStop(0, '#102052');
      stormGrad.addColorStop(1, 'rgba(25, 45, 110, 0)');
      ctx.fillStyle = stormGrad;
      ctx.beginPath();
      ctx.ellipse(w * 0.65, h * 0.55, 35, 20, 0.1, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'ceres': {
      // Dark carbonaceous asteroid with bright sodium carbonate spots (Occator Crater)
      ctx.fillStyle = '#6b6862';
      ctx.fillRect(0, 0, w, h);
      // Craters
      for (let i = 0; i < 70; i++) {
        const cx = Math.random() * w;
        const cy = Math.random() * h;
        const r = 2 + Math.random() * 10;
        ctx.fillStyle = 'rgba(50, 48, 45, 0.6)';
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
      }
      // Bright Occator Crater faculae (Cerealia Facula)
      ctx.fillStyle = '#f5f5f5';
      ctx.beginPath();
      ctx.arc(w * 0.48, h * 0.42, 6, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'vesta': {
      // Rugged basaltic protoplanet surface with giant Rheasilvia south polar basin
      ctx.fillStyle = '#8a7d6d';
      ctx.fillRect(0, 0, w, h);
      // Large impact trough grooves
      ctx.strokeStyle = 'rgba(60, 50, 40, 0.5)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(0, h * 0.65);
      ctx.lineTo(w, h * 0.65);
      ctx.stroke();
      break;
    }

    case 'psyche': {
      // Metallic M-type nickel-iron asteroid with specular sheen
      ctx.fillStyle = '#7a7775';
      ctx.fillRect(0, 0, w, h);
      // Metallic streak patterns
      for (let i = 0; i < 40; i++) {
        ctx.fillStyle = 'rgba(180, 175, 170, 0.2)';
        ctx.fillRect(Math.random() * w, Math.random() * h, 30, 4);
      }
      break;
    }

    case 'bennu': {
      // Very dark carbonaceous boulder-strewn rubble pile
      ctx.fillStyle = '#303032';
      ctx.fillRect(0, 0, w, h);
      // Boulder bumps
      for (let i = 0; i < 60; i++) {
        ctx.fillStyle = 'rgba(70, 70, 75, 0.4)';
        ctx.beginPath();
        ctx.arc(Math.random() * w, Math.random() * h, 3 + Math.random() * 5, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    default:
      return null;
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;

  textureCache.set(planetId, texture);
  return texture;
}

/**
 * Ring Texture Generator with Cassini division and multi-ring bands (§13)
 */
export function getSaturnRingTexture(): THREE.CanvasTexture | null {
  if (typeof document === 'undefined') return null;

  const key = 'saturn-ring';
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 16;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Radial gradient mapped linearly along horizontal U axis (inner to outer radius)
  const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);

  // Ring C (innermost, transparent)
  grad.addColorStop(0.0, 'rgba(120, 100, 70, 0.1)');
  grad.addColorStop(0.2, 'rgba(160, 135, 95, 0.45)');

  // Ring B (brightest and densest)
  grad.addColorStop(0.25, 'rgba(215, 185, 130, 0.85)');
  grad.addColorStop(0.55, 'rgba(200, 170, 120, 0.80)');

  // Cassini Division gap (transparent division between Ring B and A)
  grad.addColorStop(0.57, 'rgba(0, 0, 0, 0.05)');
  grad.addColorStop(0.63, 'rgba(0, 0, 0, 0.05)');

  // Ring A (outer main ring)
  grad.addColorStop(0.65, 'rgba(185, 155, 110, 0.65)');
  grad.addColorStop(0.92, 'rgba(165, 135, 95, 0.55)');

  // Outer edge falloff
  grad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  textureCache.set(key, texture);
  return texture;
}

/**
 * Earth Translucent Cloud Texture Generator (NASA Eyes & design.md §12, §13)
 * Provides realistic swirling storm cells and atmospheric weather bands
 */
export function getEarthCloudsTexture(): THREE.CanvasTexture | null {
  if (typeof document === 'undefined') return null;

  const key = 'earth-clouds';
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const w = canvas.width;
  const h = canvas.height;

  // Clear to full transparency
  ctx.clearRect(0, 0, w, h);

  // Tropical Trade Wind Cloud Bands
  ctx.fillStyle = 'rgba(255, 255, 255, 0.42)';
  for (let i = 0; i < 28; i++) {
    const cx = (i / 28) * w;
    const cy = 0.46 * h + Math.sin(i * 0.8) * 14;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 50, 10, 0.05, 0, Math.PI * 2);
    ctx.fill();
  }

  // Mid-Latitude Cyclonic Storm Swirls (Northern & Southern Hemispheres)
  const storms = [
    { x: 0.22, y: 0.28, r: 42 },
    { x: 0.62, y: 0.26, r: 48 },
    { x: 0.85, y: 0.32, r: 38 },
    { x: 0.35, y: 0.68, r: 44 },
    { x: 0.72, y: 0.72, r: 40 },
  ];

  storms.forEach((s) => {
    const stormGrad = ctx.createRadialGradient(s.x * w, s.y * h, 4, s.x * w, s.y * h, s.r);
    stormGrad.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
    stormGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.35)');
    stormGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = stormGrad;
    ctx.beginPath();
    ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
    ctx.fill();

    // Spiral storm arms
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(s.x * w, s.y * h, s.r * 0.6, 0.4, Math.PI * 1.4);
    ctx.stroke();
  });

  // Soft polar cloud caps
  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.beginPath();
  ctx.ellipse(w * 0.5, 12, w * 0.4, 20, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(w * 0.5, h - 12, w * 0.4, 20, 0, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  textureCache.set(key, texture);
  return texture;
}

/**
 * Milky Way Galactic Sky Dome Texture Generator (NASA Eyes Spatial Background)
 * Creates a realistic deep space environment with galactic dust lanes,
 * the Milky Way disc, star clouds, and subtle cosmic emission nebulae.
 */
export function getMilkyWayTexture(): THREE.CanvasTexture | null {
  if (typeof document === 'undefined') return null;

  const key = 'milky-way-skydome';
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const w = canvas.width;
  const h = canvas.height;

  // 1. Deep Space Cosmic Canvas (rich dark indigo/midnight navy, not flat pitch black)
  const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
  bgGrad.addColorStop(0, '#040816');
  bgGrad.addColorStop(0.3, '#081128');
  bgGrad.addColorStop(0.5, '#0b1638');
  bgGrad.addColorStop(0.7, '#081128');
  bgGrad.addColorStop(1, '#040816');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // 2. Diffuse Cosmic Dust / Interstellar Background Glow
  const cosmicGlows = [
    { x: 0.25, y: 0.35, r: 450, col: 'rgba(38, 70, 140, 0.36)' },
    { x: 0.70, y: 0.60, r: 480, col: 'rgba(58, 42, 115, 0.32)' },
    { x: 0.50, y: 0.50, r: 600, col: 'rgba(52, 78, 145, 0.38)' },
    { x: 0.85, y: 0.40, r: 380, col: 'rgba(32, 85, 125, 0.30)' },
  ];

  cosmicGlows.forEach((g) => {
    const rad = ctx.createRadialGradient(g.x * w, g.y * h, 10, g.x * w, g.y * h, g.r);
    rad.addColorStop(0, g.col);
    rad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = rad;
    ctx.beginPath();
    ctx.arc(g.x * w, g.y * h, g.r, 0, Math.PI * 2);
    ctx.fill();
  });

  // 3. The Milky Way Galactic Band (Diagonal across equirectangular projection)
  ctx.save();
  // Draw broad diffuse galactic disc
  const discGrad = ctx.createLinearGradient(0, 0.2 * h, w, 0.8 * h);
  discGrad.addColorStop(0, 'rgba(150, 175, 230, 0.15)');
  discGrad.addColorStop(0.3, 'rgba(205, 190, 165, 0.32)');
  discGrad.addColorStop(0.5, 'rgba(245, 230, 200, 0.48)'); // Galactic bulge / core
  discGrad.addColorStop(0.7, 'rgba(205, 190, 165, 0.30)');
  discGrad.addColorStop(1, 'rgba(150, 175, 230, 0.15)');

  // Main galactic band path
  for (let step = 0; step < 40; step++) {
    const t = step / 40;
    const x = t * w;
    // Sinusoidal tilt representing ~60° galactic inclination relative to ecliptic
    const y = 0.5 * h + Math.sin(t * Math.PI * 2 - 0.5) * (0.28 * h);
    const bandHeight = 125 + Math.sin(t * Math.PI) * 95;

    const bandGrad = ctx.createRadialGradient(x, y, 10, x, y, bandHeight);
    bandGrad.addColorStop(0, 'rgba(235, 220, 195, 0.40)');
    bandGrad.addColorStop(0.4, 'rgba(165, 150, 195, 0.26)');
    bandGrad.addColorStop(0.8, 'rgba(75, 105, 165, 0.14)');
    bandGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = bandGrad;
    ctx.beginPath();
    ctx.ellipse(x, y, 180, bandHeight, 0.25, 0, Math.PI * 2);
    ctx.fill();
  }

  // 4. Galactic Core (Sagittarius Bulge — Brightest region of the Milky Way)
  const coreX = 0.52 * w;
  const coreY = 0.5 * h + Math.sin(0.52 * Math.PI * 2 - 0.5) * (0.28 * h);
  const coreGrad = ctx.createRadialGradient(coreX, coreY, 8, coreX, coreY, 200);
  coreGrad.addColorStop(0, 'rgba(255, 245, 225, 0.75)');
  coreGrad.addColorStop(0.2, 'rgba(245, 215, 180, 0.52)');
  coreGrad.addColorStop(0.5, 'rgba(185, 150, 140, 0.28)');
  coreGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = coreGrad;
  ctx.beginPath();
  ctx.ellipse(coreX, coreY, 240, 120, 0.3, 0, Math.PI * 2);
  ctx.fill();

  // 5. Dark Interstellar Dust Lanes (The Great Rift / Absorption Nebulae)
  ctx.fillStyle = 'rgba(4, 7, 16, 0.45)';
  for (let r = 0; r < 26; r++) {
    const rt = 0.36 + (r / 26) * 0.28;
    const rx = rt * w;
    const ry = 0.5 * h + Math.sin(rt * Math.PI * 2 - 0.5) * (0.28 * h) + (Math.sin(r * 2) * 24);
    ctx.beginPath();
    ctx.ellipse(rx, ry, 60, 20 + Math.random() * 14, 0.32, 0, Math.PI * 2);
    ctx.fill();
  }

  // 6. Emission & Reflection Nebulae (Orion / Carina / Lagoon hints)
  const nebulae = [
    { x: 0.38, y: 0.32, rx: 85, ry: 45, col: 'rgba(240, 95, 155, 0.30)' }, // Magenta/rose
    { x: 0.65, y: 0.68, rx: 95, ry: 50, col: 'rgba(80, 195, 240, 0.28)' }, // Cyan/blue
    { x: 0.82, y: 0.45, rx: 70, ry: 40, col: 'rgba(200, 120, 230, 0.25)' }, // Violet
    { x: 0.18, y: 0.58, rx: 80, ry: 45, col: 'rgba(95, 215, 205, 0.26)' }, // Teal
  ];

  nebulae.forEach((n) => {
    const nGrad = ctx.createRadialGradient(n.x * w, n.y * h, 2, n.x * w, n.y * h, n.rx);
    nGrad.addColorStop(0, n.col);
    nGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = nGrad;
    ctx.beginPath();
    ctx.ellipse(n.x * w, n.y * h, n.rx, n.ry, 0.2, 0, Math.PI * 2);
    ctx.fill();
  });

  // 7. Micro-star clusters along the Milky Way band (6,000 stippled points)
  for (let s = 0; s < 6000; s++) {
    const st = Math.random();
    const sx = st * w;
    const midY = 0.5 * h + Math.sin(st * Math.PI * 2 - 0.5) * (0.28 * h);
    // Gaussian-like concentration along galactic equator
    const offset = (Math.random() + Math.random() + Math.random() - 1.5) * 115;
    const sy = Math.max(0, Math.min(h, midY + offset));

    const starBrightness = 0.35 + Math.random() * 0.65;
    const starSize = Math.random() < 0.88 ? 1.0 : 1.8;

    // Astronomically diverse star hues (white, blue, gold)
    const starColors = [
      `rgba(255, 255, 255, ${starBrightness})`,
      `rgba(205, 225, 255, ${starBrightness * 0.9})`,
      `rgba(255, 235, 195, ${starBrightness * 0.9})`,
    ];
    ctx.fillStyle = starColors[Math.floor(Math.random() * starColors.length)];
    ctx.fillRect(sx, sy, starSize, starSize);
  }

  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  textureCache.set(key, texture);
  return texture;
}
