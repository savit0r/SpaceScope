export type CelestialBodyType = 'star' | 'terrestrial' | 'gas-giant' | 'ice-giant' | 'dwarf-planet' | 'asteroid';

export interface RingProperties {
  innerRadius: number;
  outerRadius: number;
  color: string;
  opacity: number;
}

export interface VisualProperties {
  color: string;
  emissive?: string;
  emissiveIntensity?: number;
  roughness: number;
  metalness: number;
  atmosphereColor?: string;
  ring?: RingProperties;
}

export interface AtmosphereData {
  composition: string;
  surfacePressure: string;
  notes?: string;
}

export interface OrbitGeometry {
  aphelionMillionKm: number;
  perihelionMillionKm: number;
  orbitalSpeedKmS: number;
  eccentricity: number;
  inclinationDeg: number;
}

export interface SpacecraftMission {
  name: string;
  year: string;
  agency: string;
  type: string;
  outcome?: string;
}

export interface CelestialBody {
  id: string;
  name: string;
  subtitle?: string; // e.g. "THE RED PLANET", "THE BLUE PLANET" (design.md §6, §9)
  type: CelestialBodyType;
  radius: number; // Mean radius in kilometers (km)
  distanceFromSun: number; // Distance from Sun in million kilometers (10^6 km)
  orbitalPeriod: number; // Orbital period in Earth days (0 for Sun)
  rotationPeriod: number; // Rotation period in hours
  moons: number; // Number of confirmed natural satellites
  temperature: number; // Mean surface/effective temperature in Celsius (°C)
  description: string; // Educational overview
  visualProperties: VisualProperties; // Rendering visual parameters
  axialTilt?: number; // Obliquity to orbit in degrees (e.g. 23.44° for Earth)
  atmosphere?: AtmosphereData; // Progressive disclosure level 2 (§29)
  orbitGeometry?: OrbitGeometry; // Progressive disclosure level 2 (§29)
  missions?: SpacecraftMission[]; // Progressive disclosure level 2 (§29)
}
