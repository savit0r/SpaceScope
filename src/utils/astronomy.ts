/**
 * Astronomy Utilities for SpaceScope
 * Scaling mathematical formulas and formatting utilities for celestial data.
 */

export interface RadiusScaleOptions {
  minSceneRadius?: number; // Minimum rendering radius in 3D scene units
  maxSceneRadius?: number; // Maximum rendering radius in 3D scene units
  isStar?: boolean;
}

export interface DistanceScaleOptions {
  baseOffset?: number; // Distance offset from the origin (Sun center)
  scaleFactor?: number;
  scaleMode?: 'visual' | 'real';
}

/**
 * Calculates a scaled 3D scene radius (in viewport units) from real astronomical radius in km.
 * Uses a logarithmic scale so smaller planets (Mercury) remain clearly visible
 * while gas giants and the Sun do not overwhelm the view.
 */
export function calculateSceneRadius(
  radiusKm: number,
  options: RadiusScaleOptions = {}
): number {
  const { minSceneRadius = 0.4, maxSceneRadius = 4.0, isStar = false } = options;

  if (radiusKm <= 0) return minSceneRadius;

  if (isStar) {
    // Sun is capped to prevent obscuring inner planets while retaining impressive size
    return 4.5;
  }

  // Logarithmic scaling between Earth (6371 km) as reference (~1.0 unit)
  const logRef = Math.log10(6371);
  const logValue = Math.log10(radiusKm);

  // Scaled relative to Earth = 1.0 unit
  const relativeScale = Math.pow(10, (logValue - logRef) * 0.45);
  const clamped = Math.max(minSceneRadius, Math.min(maxSceneRadius, relativeScale));

  return parseFloat(clamped.toFixed(2));
}

/**
 * Calculates scaled 3D scene orbital distance (in viewport units) from real distance in million km.
 * - 'visual' (default): compressed power-law scaling so all planets are immediately visible (§24).
 * - 'real': scientifically proportional Astronomical Units (AU) scaling (§24).
 */
export function calculateSceneDistance(
  distanceMillionKm: number,
  options: DistanceScaleOptions = {}
): number {
  const { baseOffset = 6.0, scaleFactor = 1.8, scaleMode = 'visual' } = options;

  if (distanceMillionKm <= 0) return 0; // Sun at center

  if (scaleMode === 'real') {
    // Scientifically proportional Astronomical Unit (AU) scale
    const au = distanceMillionKm / 149.5978707;
    const scaledDistance = 5.0 + au * 12.0;
    return parseFloat(scaledDistance.toFixed(2));
  }

  // Visual compressed scale (power law)
  const scaledDistance = baseOffset + Math.pow(distanceMillionKm, 0.48) * scaleFactor;
  return parseFloat(scaledDistance.toFixed(2));
}

/**
 * Formats distance in million kilometers to human-readable string with Astronomical Units (AU).
 */
export function formatDistance(distanceMillionKm: number): string {
  if (distanceMillionKm === 0) return '0 km (Center)';
  const au = distanceMillionKm / 149.5978707;
  if (distanceMillionKm >= 1000) {
    return `${(distanceMillionKm / 1000).toFixed(2)}B km (${au.toFixed(2)} AU)`;
  }
  return `${distanceMillionKm.toLocaleString()}M km (${au.toFixed(2)} AU)`;
}

/**
 * Formats temperature in Celsius with sign.
 */
export function formatTemperature(tempC: number): string {
  const prefix = tempC > 0 ? '+' : '';
  return `${prefix}${tempC}°C`;
}

/**
 * Formats orbital period in Earth days/years.
 */
export function formatOrbitalPeriod(days: number): string {
  if (days === 0) return 'N/A (Central Star)';
  if (days >= 365.25) {
    const years = days / 365.25;
    return `${years.toFixed(1)} Earth years (${days.toLocaleString()} days)`;
  }
  return `${days.toLocaleString()} Earth days`;
}

/**
 * Formats rotation period in hours/days.
 */
export function formatRotationPeriod(hours: number): string {
  const absHours = Math.abs(hours);
  const retrogradeNotice = hours < 0 ? ' (Retrograde)' : '';

  if (absHours >= 24) {
    const days = absHours / 24;
    return `${days.toFixed(1)} Earth days (${absHours.toFixed(1)} hrs)${retrogradeNotice}`;
  }
  return `${absHours.toFixed(1)} hours${retrogradeNotice}`;
}
