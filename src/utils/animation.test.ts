import { describe, it, expect } from 'vitest';
import { calculateOrbitalSpeed, calculateRotationSpeed } from './animation';

describe('Animation Utilities', () => {
  describe('calculateOrbitalSpeed', () => {
    it('should return 0 for celestial bodies with no orbit (Sun)', () => {
      expect(calculateOrbitalSpeed(0)).toBe(0);
    });

    it('should return base rate for Earth (365.25 days)', () => {
      const earthSpeed = calculateOrbitalSpeed(365.25, 0.2);
      expect(earthSpeed).toBeCloseTo(0.2);
    });

    it('should calculate Mercury faster than Earth', () => {
      const mercury = calculateOrbitalSpeed(87.97);
      const earth = calculateOrbitalSpeed(365.25);
      expect(mercury).toBeGreaterThan(earth);
    });

    it('should calculate Neptune slower than Earth', () => {
      const neptune = calculateOrbitalSpeed(60189.0);
      const earth = calculateOrbitalSpeed(365.25);
      expect(neptune).toBeLessThan(earth);
    });
  });

  describe('calculateRotationSpeed', () => {
    it('should return 0 when rotation period is 0', () => {
      expect(calculateRotationSpeed(0)).toBe(0);
    });

    it('should return base rate for Earth (~24 hrs)', () => {
      const earthRotation = calculateRotationSpeed(24.0, 0.5);
      expect(earthRotation).toBeCloseTo(0.5);
    });

    it('should preserve negative sign for Venus retrograde rotation', () => {
      const venusRotation = calculateRotationSpeed(-5832.5);
      expect(venusRotation).toBeLessThan(0);
    });
  });
});
