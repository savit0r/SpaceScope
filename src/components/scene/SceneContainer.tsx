import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { SolarSystem } from './SolarSystem';
import { CameraController } from './CameraController';
import { useSelection } from '../../context/SelectionContext';

/**
 * SceneContainer
 * 
 * The 3D scene is the hero (§7). Canvas occupies 100% of viewport.
 * Ambient light is kept very low — the Sun's pointLight is the primary source (§14).
 * This creates proper day/night terminator on planets.
 */
export const SceneContainer: React.FC = () => {
  const { deselectPlanet } = useSelection();

  return (
    <div className="canvas-container">
      <Canvas
        camera={{ position: [0, 25, 42], fov: 50, near: 0.1, far: 2500 }}
        gl={{ antialias: true, toneMapping: 4 /* ACESFilmicToneMapping */ }}
        onPointerMissed={() => deselectPlanet()}
      >
        {/* Pure deep black space background (NASA Eyes style) */}
        <color attach="background" args={['#000000']} />

        {/* Very low ambient — let the Sun create the terminator (§14) */}
        <ambientLight intensity={0.08} />

        {/* Camera transitions (§16) */}
        <CameraController />

        {/* Complete Solar System scene graph */}
        <SolarSystem />

        {/* OrbitControls for user camera interaction */}
        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.05}
          minDistance={2}
          maxDistance={450}
        />
      </Canvas>
    </div>
  );
};
