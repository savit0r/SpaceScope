import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSimulation } from '../../context/SimulationContext';
import { calculateSceneDistance } from '../../utils/astronomy';

interface AsteroidData {
  radiusAU: number; // Semi-major axis in AU (2.1 to 3.3 AU)
  baseAngle: number;
  speedMultiplier: number;
  verticalDispersion: number;
  scale: number;
  color: THREE.Color;
}

/**
 * Asteroid Belt Component (Signature NASA Eyes on Asteroids Feature)
 * 
 * Renders 2,000 procedural Keplerian asteroids orbiting in the Main Asteroid Belt
 * between Mars and Jupiter using a single InstancedMesh draw call.
 */
export const AsteroidBelt: React.FC = () => {
  const { simulatedDaysRef, scaleMode, showAsteroids } = useSimulation();
  const instancedMeshRef = useRef<THREE.InstancedMesh>(null!);
  const count = 1800;

  // Pre-generate asteroid orbital properties
  const asteroids = useMemo<AsteroidData[]>(() => {
    const list: AsteroidData[] = [];
    const colors = [
      new THREE.Color('#5c5a56'), // Carbonaceous C-type (75% of belt)
      new THREE.Color('#78756e'),
      new THREE.Color('#948c7c'), // Silicate S-type (17% of belt)
      new THREE.Color('#827b72'),
      new THREE.Color('#a8a49e'), // Metallic M-type
    ];

    for (let i = 0; i < count; i++) {
      // Main Belt semi-major axis: 2.1 to 3.3 AU
      const radiusAU = 2.1 + Math.random() * 1.2;
      const baseAngle = Math.random() * Math.PI * 2;
      // Kepler's Third Law: Period T = a^1.5, angular speed inversely proportional
      const speedMultiplier = 1 / Math.pow(radiusAU, 1.5);
      // Realistic vertical inclination dispersion (toroidal belt)
      const verticalDispersion = (Math.random() - 0.5) * 1.2;
      const scale = 0.5 + Math.random() * 0.9;
      const color = colors[Math.floor(Math.random() * colors.length)];

      list.push({
        radiusAU,
        baseAngle,
        speedMultiplier,
        verticalDispersion,
        scale,
        color,
      });
    }
    return list;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Initialize instance colors
  useEffect(() => {
    if (!instancedMeshRef.current) return;
    for (let i = 0; i < count; i++) {
      instancedMeshRef.current.setColorAt(i, asteroids[i].color);
    }
    instancedMeshRef.current.instanceColor!.needsUpdate = true;
  }, [asteroids, count]);

  // Frame Loop: Propagate each asteroid along its Keplerian orbit
  useFrame(() => {
    if (!instancedMeshRef.current || !showAsteroids) return;

    const days = simulatedDaysRef.current;
    // Base Mars distance ~228M km, Jupiter ~778M km
    const marsDist = calculateSceneDistance(227.9, { scaleMode });
    const jupDist = calculateSceneDistance(778.5, { scaleMode });
    const beltInner = marsDist + (jupDist - marsDist) * 0.15;
    const beltWidth = (jupDist - marsDist) * 0.65;

    for (let i = 0; i < count; i++) {
      const ast = asteroids[i];
      // Map 2.1 - 3.3 AU fraction to scene radius between Mars and Jupiter
      const t = (ast.radiusAU - 2.1) / 1.2;
      const sceneR = beltInner + t * beltWidth;

      // Keplerian mean anomaly propagation
      const currentAngle = ast.baseAngle + days * 0.003 * ast.speedMultiplier;
      const posX = sceneR * Math.cos(currentAngle);
      const posZ = sceneR * Math.sin(currentAngle);
      const posY = ast.verticalDispersion * (scaleMode === 'real' ? 2.5 : 1.2);

      dummy.position.set(posX, posY, posZ);
      dummy.scale.setScalar(ast.scale);
      dummy.rotation.set(currentAngle * 2, currentAngle, 0);
      dummy.updateMatrix();

      instancedMeshRef.current.setMatrixAt(i, dummy.matrix);
    }

    instancedMeshRef.current.instanceMatrix.needsUpdate = true;
  });

  if (!showAsteroids) return null;

  return (
    <instancedMesh
      ref={instancedMeshRef}
      args={[undefined, undefined, count]}
      frustumCulled={false}
    >
      {/* Low-poly faceted rock geometry */}
      <dodecahedronGeometry args={[0.07, 0]} />
      <meshStandardMaterial
        roughness={0.9}
        metalness={0.1}
        color="#888888"
      />
    </instancedMesh>
  );
};
