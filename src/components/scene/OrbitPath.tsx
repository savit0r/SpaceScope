import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useSelection } from '../../context/SelectionContext';
import type { CelestialBody } from '../../types/planet';

interface OrbitPathProps {
  radius: number;
  planet?: CelestialBody;
}

/**
 * Orbital Trajectory Path (NASA Eyes Inspired)
 * 
 * - Rendered as crisp 3D line loop (visible from all camera angles)
 * - Selected planet's trajectory highlights with its signature color
 * - Unselected orbits remain delicate, supporting information (§18)
 * - Orbit plane tilts to match astronomical inclination if available
 */
export const OrbitPath: React.FC<OrbitPathProps> = ({
  radius,
  planet,
}) => {
  const { selectedPlanet } = useSelection();

  if (radius <= 0) return null;

  const isSelected = planet && selectedPlanet?.id === planet.id;

  // Calculate 192 smooth Keplerian orbital ellipse points
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const segments = 192;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      pts.push(new THREE.Vector3(radius * Math.cos(theta), 0, radius * Math.sin(theta)));
    }
    return pts;
  }, [radius]);

  const geometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [points]);

  // Planet signature color for selected orbit
  const orbitColor = isSelected && planet?.visualProperties.color
    ? planet.visualProperties.color
    : '#ffffff';

  // Opacity: subtle baseline, bright when selected
  const opacity = isSelected ? 0.55 : 0.10;

  // Real orbital inclination angle in radians
  const inclinationRad = planet?.orbitGeometry?.inclinationDeg
    ? THREE.MathUtils.degToRad(planet.orbitGeometry.inclinationDeg * 0.4) // Subtle visual inclination
    : 0;

  return (
    <group rotation={[inclinationRad, 0, 0]}>
      {/* Primary sharp orbital line loop */}
      <lineLoop geometry={geometry}>
        <lineBasicMaterial
          color={orbitColor}
          transparent
          opacity={opacity}
          depthWrite={false}
        />
      </lineLoop>

      {/* Selected orbit soft glow ring */}
      {isSelected && (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius - 0.04, radius + 0.04, 128]} />
          <meshBasicMaterial
            color={orbitColor}
            transparent
            opacity={0.18}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
};
