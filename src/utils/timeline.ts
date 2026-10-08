/**
 * SpaceScope Phase 7: Dedicated Timeline & Orbital Calculation Module
 * Educational Visualization Model — Positions derived using circular Keplerian mean anomaly approximation.
 */

export const BASE_SIMULATION_DATE = new Date('2026-01-01T00:00:00Z');

/**
 * Calculates deterministic 3D orbital angle (in radians) from simulated elapsed days.
 */
export function calculateOrbitalAngle(
  orbitalPeriodDays: number,
  elapsedDays: number,
  initialAngle = 0
): number {
  if (orbitalPeriodDays <= 0) return 0;
  // Angular velocity omega = (2 * PI) / T
  const omega = (2 * Math.PI) / orbitalPeriodDays;
  const angle = initialAngle + omega * elapsedDays;
  // Normalize angle to [0, 2*PI)
  return ((angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
}

/**
 * Calculates 3D spatial position [X, Y, Z] on the orbital plane for a given simulated day count.
 */
export function calculatePositionFromDays(
  sceneDistance: number,
  orbitalPeriodDays: number,
  elapsedDays: number,
  initialAngle = 0
): [number, number, number] {
  if (sceneDistance <= 0) return [0, 0, 0];
  const angle = calculateOrbitalAngle(orbitalPeriodDays, elapsedDays, initialAngle);
  return [
    parseFloat((sceneDistance * Math.cos(angle)).toFixed(3)),
    0,
    parseFloat((sceneDistance * Math.sin(angle)).toFixed(3)),
  ];
}

/**
 * Converts simulated elapsed days count to a JavaScript Date object.
 */
export function simulatedDaysToDate(
  elapsedDays: number,
  baseDate: Date = BASE_SIMULATION_DATE
): Date {
  const timeMs = baseDate.getTime() + elapsedDays * 86400 * 1000;
  return new Date(timeMs);
}

/**
 * Converts a target Date object back to simulated elapsed days count.
 */
export function dateToSimulatedDays(
  targetDate: Date,
  baseDate: Date = BASE_SIMULATION_DATE
): number {
  const diffMs = targetDate.getTime() - baseDate.getTime();
  return diffMs / (86400 * 1000);
}

/**
 * Formats a Date object into a readable UTC date string for the UI HUD.
 */
export function formatSimulatedDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}
