export type ScaleMode = 'visual' | 'real';
export type QualityMode = 'auto' | 'high' | 'medium' | 'low';

export interface SimulationState {
  isPlaying: boolean;
  speed: number; // Simulated days per real-time second
  simulatedDays: number; // Total simulated elapsed days from base date
  resetSignal: number;
  scaleMode: ScaleMode; // Scale mode: visual (compressed) vs real (proportional AU) per design.md §24
  showOrbits: boolean; // Toggle orbital trajectory rendering per design.md §23
  showAsteroids: boolean; // Toggle Asteroid Belt visualization per NASA Eyes on Asteroids
  quality: QualityMode; // Graphic quality level per design.md §35
  togglePlay: () => void;
  setSpeed: (speed: number) => void;
  setSimulatedDays: (days: number) => void;
  resetSimulation: () => void;
  setScaleMode: (mode: ScaleMode) => void;
  setShowOrbits: (show: boolean) => void;
  setShowAsteroids: (show: boolean) => void;
  setQuality: (quality: QualityMode) => void;
}
