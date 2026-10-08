import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import type { CelestialBody } from '../../types/planet';
import { calculateSceneRadius, calculateSceneDistance } from '../../utils/astronomy';
import { calculatePositionFromDays } from '../../utils/timeline';
import { getPlanetTexture, getSaturnRingTexture, getEarthCloudsTexture } from '../../utils/textures';
import { useSimulation } from '../../context/SimulationContext';
import { useSelection } from '../../context/SelectionContext';

export interface PlanetProps {
  planet: CelestialBody;
  initialAngle?: number;
}

/**
 * Planet Component (Enhanced with NASA Eyes Design Principles)
 * 
 * - Multi-layer rendering: Surface mesh, Fresnel atmospheric rim, and clouds layer (Earth)
 * - Astronomical axial tilt applied to body and rings
 * - Saturn rings with Cassini division gap tilted with planet
 * - NASA Eyes 3D HUD marker pins for instant object discovery across the solar system
 * - Deterministic Keplerian orbit propagation
 */
export const Planet: React.FC<PlanetProps> = ({
  planet,
  initialAngle = 0,
}) => {
  const { visualProperties, type, radius, distanceFromSun, orbitalPeriod, rotationPeriod, axialTilt } = planet;
  
  const { simulatedDaysRef, scaleMode } = useSimulation();
  const { selectedPlanet, selectPlanet } = useSelection();

  const [hovered, setHovered] = useState<boolean>(false);
  const isSelected = selectedPlanet?.id === planet.id;
  const isOtherSelected = selectedPlanet !== null && !isSelected;

  const groupRef = useRef<THREE.Group>(null!);
  const meshRef = useRef<THREE.Mesh>(null!);
  const cloudsMeshRef = useRef<THREE.Mesh>(null!);

  const sceneRadius = calculateSceneRadius(radius, { isStar: type === 'star' });
  const sceneDistance = calculateSceneDistance(distanceFromSun, { scaleMode });

  // Procedural planetary surface texture (§11, §13)
  const surfaceTexture = useMemo(() => getPlanetTexture(planet.id), [planet.id]);

  // Procedural ring texture with Cassini gap for Saturn (§13)
  const ringTexture = useMemo(() => {
    if (planet.id === 'saturn') return getSaturnRingTexture();
    return null;
  }, [planet.id]);

  // Earth clouds layer texture (NASA Eyes)
  const isEarth = planet.id === 'earth';
  const earthCloudsTexture = useMemo(() => (isEarth ? getEarthCloudsTexture() : null), [isEarth]);

  // Astronomical axial tilt in radians (NASA Eyes)
  const axialTiltRad = useMemo(() => {
    return THREE.MathUtils.degToRad(axialTilt || 0);
  }, [axialTilt]);

  /**
   * Time-based rotation speed (§17)
   */
  const rotationSpeed = useMemo(() => {
    if (rotationPeriod === 0) return 0;
    const daysPerRotation = Math.abs(rotationPeriod) / 24;
    const radiansPerDay = (2 * Math.PI) / daysPerRotation;
    return rotationPeriod < 0 ? -radiansPerDay : radiansPerDay;
  }, [rotationPeriod]);

  // Atmosphere shader material for Fresnel rim lighting (§15)
  const atmosphereMaterial = useMemo(() => {
    if (!visualProperties.atmosphereColor) return null;

    return new THREE.ShaderMaterial({
      uniforms: {
        atmosphereColor: { value: new THREE.Color(visualProperties.atmosphereColor) },
        intensity: { value: 0.6 },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vViewPosition = -mvPosition.xyz;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 atmosphereColor;
        uniform float intensity;
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        void main() {
          vec3 viewDir = normalize(vViewPosition);
          float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 3.0);
          gl_FragColor = vec4(atmosphereColor, fresnel * intensity);
        }
      `,
      transparent: true,
      side: THREE.FrontSide,
      depthWrite: false,
    });
  }, [visualProperties.atmosphereColor]);

  useEffect(() => {
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, []);

  /*
    R3F Frame Loop:
    Orbital motion, planetary axial rotation, and Earth cloud drift
  */
  useFrame(() => {
    const days = simulatedDaysRef.current;

    // 1. Orbital Position
    if (groupRef.current && orbitalPeriod > 0) {
      const [posX, posY, posZ] = calculatePositionFromDays(
        sceneDistance,
        orbitalPeriod,
        days,
        initialAngle
      );
      groupRef.current.position.set(posX, posY, posZ);
    }

    // 2. Time-based axial rotation
    if (meshRef.current && rotationSpeed !== 0) {
      meshRef.current.rotation.y = (days * rotationSpeed) % (2 * Math.PI);
    }

    // 3. Independent cloud rotation for Earth (atmospheric weather movement)
    if (cloudsMeshRef.current && rotationSpeed !== 0) {
      cloudsMeshRef.current.rotation.y = (days * rotationSpeed * 1.14) % (2 * Math.PI);
    }
  });

  return (
    <group
      ref={groupRef}
      name={`planet-${planet.id}`}
      position={[sceneDistance * Math.cos(initialAngle), 0, sceneDistance * Math.sin(initialAngle)]}
    >
      {/* Tilted Axis Group — Real Astronomical Axial Tilt (NASA Eyes) */}
      <group rotation={[0, 0, axialTiltRad]}>
        {/* Primary Planet Mesh */}
        <mesh
          ref={meshRef}
          scale={hovered ? 1.05 : 1.0}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            setHovered(false);
            document.body.style.cursor = 'auto';
          }}
          onClick={(e) => {
            e.stopPropagation();
            selectPlanet(planet);
          }}
        >
          <sphereGeometry args={[sceneRadius, 64, 64]} />
          <meshStandardMaterial
            map={surfaceTexture || undefined}
            color={surfaceTexture ? '#ffffff' : visualProperties.color}
            emissive={visualProperties.emissive || '#000000'}
            emissiveIntensity={visualProperties.emissiveIntensity || 0}
            roughness={visualProperties.roughness}
            metalness={visualProperties.metalness}
            opacity={isOtherSelected ? 0.55 : 1.0}
            transparent={isOtherSelected}
          />
        </mesh>

        {/* Earth Clouds Layer — Independent Rotating Atmospheric Veil */}
        {isEarth && earthCloudsTexture && (
          <mesh ref={cloudsMeshRef}>
            <sphereGeometry args={[sceneRadius * 1.018, 64, 64]} />
            <meshStandardMaterial
              map={earthCloudsTexture}
              transparent
              opacity={0.80}
              roughness={1.0}
              depthWrite={false}
            />
          </mesh>
        )}

        {/* Fresnel Atmospheric Rim Lighting (§15) */}
        {atmosphereMaterial && (
          <mesh>
            <sphereGeometry args={[sceneRadius * 1.04, 64, 64]} />
            <primitive object={atmosphereMaterial} attach="material" />
          </mesh>
        )}

        {/* Planetary Ring System (Tilted with planet's axis) */}
        {visualProperties.ring && (
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry
              args={[
                sceneRadius * visualProperties.ring.innerRadius,
                sceneRadius * visualProperties.ring.outerRadius,
                128,
              ]}
            />
            <meshStandardMaterial
              map={ringTexture || undefined}
              color={ringTexture ? '#ffffff' : visualProperties.ring.color}
              opacity={visualProperties.ring.opacity}
              transparent
              side={THREE.DoubleSide}
              roughness={0.7}
              metalness={0.0}
            />
          </mesh>
        )}
      </group>

      {/* NASA Eyes 3D HUD Target Badge — Discoverable across space, hides when focused up close */}
      {!isSelected && (
        <Html
          position={[0, sceneRadius * 1.2 + 0.4, 0]}
          center
          distanceFactor={16}
          zIndexRange={[100, 0]}
        >
          <div
            className={`nasa-planet-badge ${hovered ? 'hovered' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              selectPlanet(planet);
            }}
            title={`Click to focus ${planet.name}`}
          >
            <span
              className="nasa-target-dot"
              style={{ backgroundColor: visualProperties.color }}
            />
            <span className="nasa-target-name">{planet.name}</span>
            {hovered && (
              <span className="nasa-target-distance">
                {Math.round(planet.distanceFromSun)}M km
              </span>
            )}
          </div>
        </Html>
      )}
    </group>
  );
};
