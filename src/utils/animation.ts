/**
 * Animation Utilities for SpaceScope
 * Pure mathematical formulas for calculating physical rotational and orbital angular velocities.
 */

/**
 * Calculates orbital angular speed (radians per second) relative to Earth's orbital period.
 * Earth (365.25 days) serves as the 1.0 baseline speed reference.
 */
export function calculateOrbitalSpeed(
  orbitalPeriodDays: number,
  baseRate = 0.2
): number {
  if (orbitalPeriodDays <= 0) return 0;
  return (365.25 / orbitalPeriodDays) * baseRate;
}

/**
 * Calculates axial rotation speed (radians per second) relative to Earth's rotation period.
 * Earth (24 hours) serves as the 1.0 baseline reference.
 * Negative values represent retrograde rotation (Venus, Uranus).
 */
export function calculateRotationSpeed(
  rotationPeriodHours: number,
  baseRate = 0.5
): number {
  if (rotationPeriodHours === 0) return 0;
  // Preserve sign for retrograde direction
  return (24.0 / rotationPeriodHours) * baseRate;
}
