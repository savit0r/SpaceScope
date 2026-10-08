import React, { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { useSelection } from '../../context/SelectionContext';
import { useSimulation } from '../../context/SimulationContext';
import { calculateSceneDistance, calculateSceneRadius } from '../../utils/astronomy';

const DEFAULT_CAMERA_POS = new THREE.Vector3(0, 25, 42);
const DEFAULT_TARGET_POS = new THREE.Vector3(0, 0, 0);

/**
 * CameraController Component
 * Uses GSAP Timelines for smooth camera transitions to revolving planets,
 * and continuously tracks the revolving planet in real time so the camera rides along.
 */
export const CameraController: React.FC = () => {
  const { scene, camera, controls } = useThree();
  const { selectedPlanet, isCameraFocused } = useSelection();
  const { scaleMode } = useSimulation();

  const orbitControls = controls as unknown as OrbitControlsImpl;
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // Safely interrupt active GSAP camera transition if user manually drags OrbitControls
  useEffect(() => {
    if (!orbitControls) return;

    const handleUserInteraction = () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }
    };

    orbitControls.addEventListener('start', handleUserInteraction);
    return () => {
      orbitControls.removeEventListener('start', handleUserInteraction);
    };
  }, [orbitControls]);

  // Handle camera transition when selectedPlanet or isCameraFocused changes
  useEffect(() => {
    if (!orbitControls) return;

    // 1. Kill existing running timeline
    if (timelineRef.current) {
      timelineRef.current.kill();
      timelineRef.current = null;
    }

    if (selectedPlanet && isCameraFocused) {
      // Find the actual 3D planet object in the scene
      const targetObj = scene.getObjectByName(`planet-${selectedPlanet.id}`);
      const initialPlanetPos = new THREE.Vector3();

      if (targetObj) {
        targetObj.getWorldPosition(initialPlanetPos);
      } else {
        const sceneDistance = calculateSceneDistance(selectedPlanet.distanceFromSun, { scaleMode });
        initialPlanetPos.set(sceneDistance, 0, 0);
      }

      // Calculate appropriate framing distance based on celestial body size
      const isStar = selectedPlanet.type === 'star';
      const sceneRadius = calculateSceneRadius(selectedPlanet.radius, { isStar });
      const viewDistance = isStar
        ? 16
        : selectedPlanet.id === 'saturn'
        ? Math.max(9.0, sceneRadius * 5.2)
        : Math.max(4.8, sceneRadius * 4.2);

      // Desired camera offset relative to the planet:
      // Positions camera so the sunlit hemisphere is clearly visible with dramatic 3/4 lighting
      const offsetVec = new THREE.Vector3();
      const sunDir = initialPlanetPos.clone().normalize();
      if (sunDir.lengthSq() > 0.01) {
        // Tangent perpendicular to the radial vector from the Sun
        const tangent = new THREE.Vector3(-sunDir.z, 0, sunDir.x);
        offsetVec.copy(tangent).multiplyScalar(viewDistance * 0.75);
        offsetVec.sub(sunDir.clone().multiplyScalar(viewDistance * 0.5)); // Position toward sunlit hemisphere
        offsetVec.y += viewDistance * 0.35; // Elevated above orbital plane
      } else {
        offsetVec.set(0, viewDistance * 0.35, viewDistance);
      }

      const startCamPos = camera.position.clone();
      const startTargetPos = orbitControls.target.clone();
      const animObj = { progress: 0 };

      /*
        GSAP Timeline:
        Dynamically chases the revolving planet's live position so it arrives exactly
        at where the planet is (even at high simulation speeds), with smooth power2.inOut easing.
      */
      const tl = gsap.timeline({
        onUpdate: () => {
          const currentPlanetPos = new THREE.Vector3();
          if (targetObj) {
            targetObj.getWorldPosition(currentPlanetPos);
          } else {
            currentPlanetPos.copy(initialPlanetPos);
          }

          const targetCamPos = currentPlanetPos.clone().add(offsetVec);

          orbitControls.target.lerpVectors(startTargetPos, currentPlanetPos, animObj.progress);
          camera.position.lerpVectors(startCamPos, targetCamPos, animObj.progress);
          orbitControls.update();
        },
        onComplete: () => {
          timelineRef.current = null;
        },
      });

      tl.to(animObj, {
        progress: 1,
        duration: 1.3,
        ease: 'power2.inOut',
      });

      timelineRef.current = tl;
    } else {
      // Reset Camera Transition back to solar system overview
      const startCamPos = camera.position.clone();
      const startTargetPos = orbitControls.target.clone();
      const animObj = { progress: 0 };

      const tl = gsap.timeline({
        onUpdate: () => {
          orbitControls.target.lerpVectors(startTargetPos, DEFAULT_TARGET_POS, animObj.progress);
          camera.position.lerpVectors(startCamPos, DEFAULT_CAMERA_POS, animObj.progress);
          orbitControls.update();
        },
        onComplete: () => {
          timelineRef.current = null;
        },
      });

      tl.to(animObj, {
        progress: 1,
        duration: 1.2,
        ease: 'power2.inOut',
      });

      timelineRef.current = tl;
    }

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }
    };
  }, [selectedPlanet, isCameraFocused, scene, camera, orbitControls, scaleMode]);

  // Continuous tracking: lock onto and ride along with the revolving planet in real time
  useFrame(() => {
    if (!orbitControls || !selectedPlanet || !isCameraFocused) return;

    // Only apply continuous tracking if GSAP timeline is not actively interpolating
    if (timelineRef.current && timelineRef.current.isActive()) return;

    const targetObj = scene.getObjectByName(`planet-${selectedPlanet.id}`);
    if (targetObj) {
      const livePos = new THREE.Vector3();
      targetObj.getWorldPosition(livePos);

      // Delta of planet movement since last frame
      const delta = livePos.clone().sub(orbitControls.target);

      // Move controls target and camera along with the revolving planet
      orbitControls.target.copy(livePos);
      camera.position.add(delta);
      orbitControls.update();
    }
  });

  return null;
};
