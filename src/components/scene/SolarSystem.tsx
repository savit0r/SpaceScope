import React from 'react';
import { useFrame } from '@react-three/fiber';
import { PLANETS, MAJOR_ASTEROIDS } from '../../data/planets';
import { calculateSceneDistance } from '../../utils/astronomy';
import { useSimulation } from '../../context/SimulationContext';
import { Sun } from './Sun';
import { Planet } from './Planet';
import { OrbitPath } from './OrbitPath';
import { Starfield } from './Starfield';
import { AsteroidBelt } from './AsteroidBelt';

/**
 * SolarSystem Component (NASA Eyes Enhanced)
 * 
 * Orchestrates Sun, planets, orbit paths, asteroid belt, and starfield.
 * Master timeline accumulation drives all motion.
 * Respects scaleMode (§24), showOrbits (§23), and showAsteroids.
 */
export const SolarSystem: React.FC = () => {
  const {
    isPlayingRef,
    speedRef,
    updateSimulatedDaysFromFrame,
    scaleMode,
    showOrbits,
    showAsteroids,
  } = useSimulation();

  const sunData = PLANETS.find((p) => p.type === 'star') || PLANETS[0];
  const planetsData = PLANETS.filter((p) => p.type !== 'star');

  // Stagger planets across their orbit paths for initial visual distribution
  const orbitalAngles = [
    0.2,    // Mercury
    0.85,   // Venus
    1.65,   // Earth
    2.5,    // Mars
    3.4,    // Jupiter
    4.25,   // Saturn
    5.1,    // Uranus
    5.9,    // Neptune
  ];

  /*
    Master Timeline Frame Loop:
    Accumulates simulated elapsed days when unpaused.
  */
  useFrame((_, delta) => {
    if (isPlayingRef.current) {
      const daysDelta = delta * speedRef.current;
      updateSimulatedDaysFromFrame(daysDelta);
    }
  });

  return (
    <group>
      {/* Background Starfield (§19) */}
      <Starfield />

      {/* Central Sun (§14) */}
      <Sun planet={sunData} />

      {/* Primary Planets and Orbit Trajectories */}
      {planetsData.map((planet, index) => {
        const orbitRadius = calculateSceneDistance(planet.distanceFromSun, { scaleMode });
        const angle = orbitalAngles[index % orbitalAngles.length];

        return (
          <React.Fragment key={planet.id}>
            {/* 3D LineLoop Orbit trajectory (§18) */}
            {showOrbits && <OrbitPath radius={orbitRadius} planet={planet} />}

            {/* Planet with axial tilt, textures & NASA Eyes HUD badge */}
            <Planet planet={planet} initialAngle={angle} />
          </React.Fragment>
        );
      })}

      {/* NASA Eyes on Asteroids: 1,800-Body Main Asteroid Belt */}
      <AsteroidBelt />

      {/* Major Asteroids / Dwarf Planets (Ceres, Vesta, Psyche, Bennu) */}
      {showAsteroids &&
        MAJOR_ASTEROIDS.map((ast, idx) => {
          const orbitRadius = calculateSceneDistance(ast.distanceFromSun, { scaleMode });
          const angle = 1.1 + idx * 1.6;

          return (
            <React.Fragment key={ast.id}>
              {showOrbits && <OrbitPath radius={orbitRadius} planet={ast} />}
              <Planet planet={ast} initialAngle={angle} />
            </React.Fragment>
          );
        })}
    </group>
  );
};
