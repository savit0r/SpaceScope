import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { CelestialBody } from '../../types/planet';
import { calculateSceneRadius } from '../../utils/astronomy';
import { useSimulation } from '../../context/SimulationContext';
import { useSelection } from '../../context/SelectionContext';

interface SunProps {
  planet: CelestialBody;
}

/**
 * Sun Component
 * 
 * The Sun should be the primary light source (§14).
 * Solar lighting creates the terminator effect on planets.
 * Corona glow uses a Fresnel shader for subtle atmospheric edge.
 */
export const Sun: React.FC<SunProps> = ({ planet }) => {
  const sceneRadius = calculateSceneRadius(planet.radius, { isStar: true });
  const { simulatedDaysRef } = useSimulation();
  const { selectPlanet } = useSelection();

  const [hovered, setHovered] = useState<boolean>(false);
  
  const meshRef = useRef<THREE.Mesh>(null!);

  // Solar corona Fresnel material
  const coronaMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        coronaColor: { value: new THREE.Color('#ffaa44') },
        intensity: { value: 0.5 },
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
        uniform vec3 coronaColor;
        uniform float intensity;
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        void main() {
          vec3 viewDir = normalize(vViewPosition);
          float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 2.5);
          gl_FragColor = vec4(coronaColor, fresnel * intensity);
        }
      `,
      transparent: true,
      side: THREE.FrontSide,
      depthWrite: false,
    });
  }, []);

  useEffect(() => {
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, []);

  // Sun rotation — slow, time-based
  useFrame(() => {
    if (meshRef.current) {
      const days = simulatedDaysRef.current;
      // Sun rotates roughly once every 25 days at equator
      const radiansPerDay = (2 * Math.PI) / 25;
      meshRef.current.rotation.y = (days * radiansPerDay * 0.02) % (2 * Math.PI);
    }
  });

  return (
    <group position={[0, 0, 0]} name={`planet-${planet.id}`}>
      {/* Primary PointLight — the solar light source (§14) */}
      <pointLight
        color="#fff5e0"
        intensity={4.0}
        distance={300}
        decay={0.4}
      />

      {/* Sun Mesh */}
      <mesh
        ref={meshRef}
        scale={hovered ? 1.04 : 1.0}
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
          color="#ffcc00"
          emissive="#ff9900"
          emissiveIntensity={planet.visualProperties.emissiveIntensity || 2.0}
          roughness={0.1}
          metalness={0.0}
        />
      </mesh>

      {/* Solar Corona — Fresnel rim glow */}
      <mesh>
        <sphereGeometry args={[sceneRadius * 1.08, 64, 64]} />
        <primitive object={coronaMaterial} attach="material" />
      </mesh>
    </group>
  );
};
