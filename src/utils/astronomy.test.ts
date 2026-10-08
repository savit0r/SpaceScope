import { describe, it, expect } from 'vitest';
import {
  calculateSceneRadius,
  calculateSceneDistance,
  formatDistance,
  formatTemperature,
  formatOrbitalPeriod,
  formatRotationPeriod,
} from './astronomy';

describe('Astronomy Utilities', () => {
  describe('calculateSceneRadius', () => {
    it('should scale Earth (6371 km) close to 1.0 scene units', () => {
      const earthRadius = calculateSceneRadius(6371);
      expect(earthRadius).toBeGreaterThan(0.9);
      expect(earthRadius).toBeLessThan(1.2);
    });

    it('should scale Mercury smaller than Earth', () => {
      const mercury = calculateSceneRadius(2439.7);
      const earth = calculateSceneRadius(6371);
      expect(mercury).toBeLessThan(earth);
      expect(mercury).toBeGreaterThanOrEqual(0.4); // respects min radius
    });

    it('should scale Jupiter larger than Earth', () => {
      const jupiter = calculateSceneRadius(69911);
      const earth = calculateSceneRadius(6371);
      expect(jupiter).toBeGreaterThan(earth);
    });

    it('should handle star option correctly', () => {
      const sun = calculateSceneRadius(696340, { isStar: true });
      expect(sun).toBe(4.5);
    });
  });

  describe('calculateSceneDistance', () => {
    it('should return 0 for Sun (0 km distance)', () => {
      expect(calculateSceneDistance(0)).toBe(0);
    });

    it('should increase distance monotonically with astronomical distance', () => {
      const mercuryDist = calculateSceneDistance(57.9);
      const earthDist = calculateSceneDistance(149.6);
      const jupiterDist = calculateSceneDistance(778.5);

      expect(mercuryDist).toBeGreaterThan(0);
      expect(earthDist).toBeGreaterThan(mercuryDist);
      expect(jupiterDist).toBeGreaterThan(earthDist);
    });

    it('should calculate proportional AU distance in real scale mode', () => {
      const sunReal = calculateSceneDistance(0, { scaleMode: 'real' });
      const earthReal = calculateSceneDistance(149.6, { scaleMode: 'real' }); // ~1 AU
      const marsReal = calculateSceneDistance(227.9, { scaleMode: 'real' });  // ~1.52 AU

      expect(sunReal).toBe(0);
      expect(earthReal).toBeCloseTo(17.0, 0);
      expect(marsReal).toBeGreaterThan(earthReal);
    });
  });

  describe('Formatting Utilities', () => {
    it('should format distance correctly', () => {
      expect(formatDistance(0)).toBe('0 km (Center)');
      expect(formatDistance(149.6)).toContain('149.6M km (1.00 AU)');
      expect(formatDistance(4495.1)).toContain('4.50B km (30.05 AU)');
    });

    it('should format temperature correctly', () => {
      expect(formatTemperature(15)).toBe('+15°C');
      expect(formatTemperature(-65)).toBe('-65°C');
      expect(formatTemperature(0)).toBe('0°C');
    });

    it('should format orbital period correctly', () => {
      expect(formatOrbitalPeriod(0)).toBe('N/A (Central Star)');
      expect(formatOrbitalPeriod(87.97)).toBe('87.97 Earth days');
      expect(formatOrbitalPeriod(365.25)).toContain('1.0 Earth years');
    });

    it('should format rotation period correctly', () => {
      expect(formatRotationPeriod(23.93)).toBe('23.9 hours');
      expect(formatRotationPeriod(1407.6)).toContain('Earth days');
      expect(formatRotationPeriod(-5832.5)).toContain('(Retrograde)');
    });
  });
});
