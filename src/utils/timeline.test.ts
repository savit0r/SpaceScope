import { describe, it, expect } from 'vitest';
import {
  calculateOrbitalAngle,
  calculatePositionFromDays,
  simulatedDaysToDate,
  dateToSimulatedDays,
  formatSimulatedDate,
} from './timeline';

describe('Timeline & Pure Orbital Math Engine', () => {
  describe('calculateOrbitalAngle', () => {
    it('should return 0 for non-orbiting bodies (Sun)', () => {
      expect(calculateOrbitalAngle(0, 100)).toBe(0);
    });

    it('should return initial angle at elapsed day 0', () => {
      expect(calculateOrbitalAngle(365.25, 0, 1.5)).toBe(1.5);
    });

    it('should calculate half orbit (PI radians) at half orbital period', () => {
      const angle = calculateOrbitalAngle(365.25, 365.25 / 2, 0);
      expect(angle).toBeCloseTo(Math.PI, 4);
    });

    it('should complete a full 2*PI circle and wrap to 0 at full period', () => {
      const angle = calculateOrbitalAngle(365.25, 365.25, 0);
      expect(angle).toBeCloseTo(0, 4);
    });
  });

  describe('calculatePositionFromDays', () => {
    it('should return origin [0,0,0] if distance is 0', () => {
      expect(calculatePositionFromDays(0, 365.25, 100)).toEqual([0, 0, 0]);
    });

    it('should position at [distance, 0, 0] at initial angle 0', () => {
      const pos = calculatePositionFromDays(10, 365.25, 0, 0);
      expect(pos[0]).toBeCloseTo(10, 2);
      expect(pos[1]).toBe(0);
      expect(pos[2]).toBeCloseTo(0, 2);
    });

    it('should position at [0, 0, distance] at 90 degrees (quarter period)', () => {
      const pos = calculatePositionFromDays(10, 365.25, 365.25 / 4, 0);
      expect(pos[0]).toBeCloseTo(0, 2);
      expect(pos[2]).toBeCloseTo(10, 2);
    });
  });

  describe('Date Conversion & Formatting', () => {
    it('should map day 0 to base simulation date (Jan 1, 2026)', () => {
      const date = simulatedDaysToDate(0);
      expect(date.toISOString()).toContain('2026-01-01');
      expect(formatSimulatedDate(date)).toContain('Jan 1, 2026');
    });

    it('should convert target date back to simulated days accurately', () => {
      const targetDate = new Date('2026-07-01T00:00:00Z');
      const days = dateToSimulatedDays(targetDate);
      expect(days).toBe(181); // Jan 1 to July 1 = 181 days

      const roundTripDate = simulatedDaysToDate(days);
      expect(roundTripDate.toISOString()).toBe(targetDate.toISOString());
    });
  });
});
