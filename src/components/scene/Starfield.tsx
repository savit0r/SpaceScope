import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

/**
 * Creates a soft circular star point texture so stars render as clean,
 * round astronomical points with natural optical falloff instead of square pixels.
 */
function createStarTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.9)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.35)');
    gradient.addColorStop(0.8, 'rgba(255, 255, 255, 0.08)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
  }
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

/**
 * Generates uniformly distributed spherical points
 */
function generateSphericalPoints(
  count: number,
  minRadius: number,
  maxRadius: number,
  palette?: THREE.Color[]
): { positions: Float32Array; colors?: Float32Array } {
  const positions = new Float32Array(count * 3);
  let colors: Float32Array | undefined;

  if (palette && palette.length > 0) {
    colors = new Float32Array(count * 3);
  }

  for (let i = 0; i < count; i++) {
    // Archimedes spherical distribution for uniform surface density
    const u = Math.random();
    const v = Math.random();
    const theta = u * 2.0 * Math.PI;
    const phi = Math.acos(2.0 * v - 1.0);
    const r = minRadius + Math.random() * (maxRadius - minRadius);

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);

    if (colors && palette) {
      const color = palette[Math.floor(Math.random() * palette.length)];
      // Slight brightness jitter
      const jitter = 0.75 + Math.random() * 0.35;
      colors[i * 3] = Math.min(1, color.r * jitter);
      colors[i * 3 + 1] = Math.min(1, color.g * jitter);
      colors[i * 3 + 2] = Math.min(1, color.b * jitter);
    }
  }

  return { positions, colors };
}

/**
 * Starfield Component (NASA Eyes on Asteroids Aesthetic)
 * 
 * Pure deep black space background filled with tens of thousands of crisp,
 * multi-tier astronomical stars:
 * - 22,000 Micro-stars (distant celestial field)
 * - 8,000 Mid-magnitude stars with authentic spectral temperatures
 * - 1,200 Prominent bright guide stars with soft optical point halos
 * - Zero foggy blue/black spots — pure pitch-black space
 * - Anchored dynamically to camera position to maintain true infinite distance
 */
export const Starfield: React.FC = () => {
  const skyboxRef = useRef<THREE.Group>(null);
  const starTexture = useMemo(() => createStarTexture(), []);

  // 1. Deep micro-stars (22,000 fine pinpoint stars)
  const microStarsGeometry = useMemo(() => {
    const { positions } = generateSphericalPoints(22000, 450, 750);
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geom;
  }, []);

  // 2. Mid-range stars (8,000 stars with astronomical color temperatures)
  const midStarsGeometry = useMemo(() => {
    const palette = [
      new THREE.Color('#ffffff'), // Pure white (Class A / F)
      new THREE.Color('#d4e2ff'), // Pale blue-white (Class B)
      new THREE.Color('#fff4e0'), // Warm cream-gold (Class G, like the Sun)
      new THREE.Color('#ffe2be'), // Soft amber (Class K)
    ];
    const { positions, colors } = generateSphericalPoints(8000, 350, 600, palette);
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    if (colors) {
      geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    }
    return geom;
  }, []);

  // 3. Prominent bright celestial beacons (1,200 prominent stars)
  const brightStarsGeometry = useMemo(() => {
    const palette = [
      new THREE.Color('#ffffff'), // Sirius / Vega
      new THREE.Color('#b5ceff'), // Rigel
      new THREE.Color('#ffe1aa'), // Capella / Arcturus
      new THREE.Color('#ffaa88'), // Betelgeuse / Aldebaran
    ];
    const { positions, colors } = generateSphericalPoints(1200, 300, 520, palette);
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    if (colors) {
      geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    }
    return geom;
  }, []);

  // Follow camera so celestial background remains at infinite optical distance
  useFrame(({ camera }) => {
    if (skyboxRef.current) {
      skyboxRef.current.position.copy(camera.position);
    }
  });

  return (
    <group ref={skyboxRef}>
      {/* 1. Deep Micro-Stars — 22,000 tiny crisp pinpoints across deep black space */}
      <points geometry={microStarsGeometry}>
        <pointsMaterial
          map={starTexture}
          size={1.1}
          color="#ffffff"
          transparent
          opacity={0.82}
          depthWrite={false}
          sizeAttenuation
        />
      </points>

      {/* 2. Mid-Range Stars — 8,000 stars with authentic spectral temperatures */}
      <points geometry={midStarsGeometry}>
        <pointsMaterial
          map={starTexture}
          size={1.8}
          vertexColors
          transparent
          opacity={0.92}
          depthWrite={false}
          sizeAttenuation
        />
      </points>

      {/* 3. Bright Celestial Guide Stars — 1,200 prominent beacons */}
      <points geometry={brightStarsGeometry}>
        <pointsMaterial
          map={starTexture}
          size={2.8}
          vertexColors
          transparent
          opacity={0.96}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
    </group>
  );
};
