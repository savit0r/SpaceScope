import { describe, it, expect } from 'vitest';
import { PLANETS, getPlanetById, getPlanetsByType } from './planets';

describe('Celestial Data Model (PLANETS)', () => {
  it('should contain data for the Sun and all 8 major planets', () => {
    expect(PLANETS).toHaveLength(9);
    const names = PLANETS.map((p) => p.name);
    expect(names).toEqual([
      'Sun',
      'Mercury',
      'Venus',
      'Earth',
      'Mars',
      'Jupiter',
      'Saturn',
      'Uranus',
      'Neptune',
    ]);
  });

  it('should contain valid required properties for every celestial body', () => {
    PLANETS.forEach((planet) => {
      expect(planet.id).toBeDefined();
      expect(typeof planet.id).toBe('string');
      expect(planet.name).toBeDefined();
      expect(planet.type).toMatch(/^(star|terrestrial|gas-giant|ice-giant)$/);
      expect(planet.radius).toBeGreaterThan(0);
      expect(planet.distanceFromSun).toBeGreaterThanOrEqual(0);
      expect(planet.orbitalPeriod).toBeGreaterThanOrEqual(0);
      expect(typeof planet.rotationPeriod).toBe('number');
      expect(planet.moons).toBeGreaterThanOrEqual(0);
      expect(typeof planet.temperature).toBe('number');
      expect(planet.description.length).toBeGreaterThan(10);
      expect(planet.visualProperties).toBeDefined();
      expect(planet.visualProperties.color).toMatch(/^#[0-9a-fA-F]{6}$/);
    });
  });

  it('should retrieve planets correctly by ID', () => {
    const earth = getPlanetById('earth');
    expect(earth).toBeDefined();
    expect(earth?.name).toBe('Earth');
    expect(earth?.moons).toBe(1);

    const sun = getPlanetById('sun');
    expect(sun?.type).toBe('star');

    const unknown = getPlanetById('pluto');
    expect(unknown).toBeUndefined();
  });

  it('should filter planets correctly by type', () => {

    const terrestrials = getPlanetsByType('terrestrial');
    expect(terrestrials).toHaveLength(4);
    expect(terrestrials.map((p) => p.name)).toEqual(['Mercury', 'Venus', 'Earth', 'Mars']);

    const gasGiants = getPlanetsByType('gas-giant');
    expect(gasGiants).toHaveLength(2);
    expect(gasGiants.map((p) => p.name)).toEqual(['Jupiter', 'Saturn']);

    const iceGiants = getPlanetsByType('ice-giant');
    expect(iceGiants).toHaveLength(2);
    expect(iceGiants.map((p) => p.name)).toEqual(['Uranus', 'Neptune']);
  });
});
