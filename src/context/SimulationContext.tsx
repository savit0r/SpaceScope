import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import type { SimulationState, ScaleMode, QualityMode } from '../types/simulation';

interface SimulationContextValue extends SimulationState {
  isPlayingRef: React.RefObject<boolean>;
  speedRef: React.RefObject<number>;
  simulatedDaysRef: React.RefObject<number>;
  updateSimulatedDaysFromFrame: (daysDelta: number) => void;
}

const SimulationContext = createContext<SimulationContextValue | null>(null);

export const SimulationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speed, setSpeedState] = useState<number>(1); // Default 1 simulated day per second (1x)
  const [simulatedDays, setSimulatedDaysState] = useState<number>(0);
  const [resetSignal, setResetSignal] = useState<number>(0);
  const [scaleMode, setScaleMode] = useState<ScaleMode>('visual'); // Visual vs Real scale (§24)
  const [showOrbits, setShowOrbits] = useState<boolean>(true); // Orbit line visibility (§23)
  const [showAsteroids, setShowAsteroids] = useState<boolean>(true); // Asteroid belt visibility (NASA Eyes)
  const [quality, setQuality] = useState<QualityMode>('auto'); // Quality levels (§35)

  // Mutable refs held for direct, zero-overhead access inside 60 FPS R3F useFrame loops
  const isPlayingRef = useRef<boolean>(isPlaying);
  const speedRef = useRef<number>(speed);
  const simulatedDaysRef = useRef<number>(simulatedDays);
  const lastThrottleUpdateRef = useRef<number>(0);

  // Sync refs when React state changes (e.g. user toggles play/pause or scrubs timeline slider)
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    simulatedDaysRef.current = simulatedDays;
  }, [simulatedDays]);

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const setSpeed = (newSpeed: number) => {
    setSpeedState(newSpeed);
  };

  const setSimulatedDays = (days: number) => {
    simulatedDaysRef.current = days;
    setSimulatedDaysState(days);
  };

  const resetSimulation = () => {
    simulatedDaysRef.current = 0;
    setSimulatedDaysState(0);
    setResetSignal((prev) => prev + 1);
  };

  /**
   * Called inside useFrame to accumulate time continuously on GPU/ref level.
   * Throttles updates to React UI state to ~10 FPS (every 100ms) to avoid 60 FPS DOM re-renders.
   */
  const updateSimulatedDaysFromFrame = (daysDelta: number) => {
    simulatedDaysRef.current += daysDelta;

    const now = performance.now();
    if (now - lastThrottleUpdateRef.current > 100) {
      lastThrottleUpdateRef.current = now;
      setSimulatedDaysState(simulatedDaysRef.current);
    }
  };

  return (
    <SimulationContext.Provider
      value={{
        isPlaying,
        speed,
        simulatedDays,
        resetSignal,
        scaleMode,
        showOrbits,
        showAsteroids,
        quality,
        togglePlay,
        setSpeed,
        setSimulatedDays,
        resetSimulation,
        setScaleMode,
        setShowOrbits,
        setShowAsteroids,
        setQuality,
        isPlayingRef,
        speedRef,
        simulatedDaysRef,
        updateSimulatedDaysFromFrame,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = (): SimulationContextValue => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
};
