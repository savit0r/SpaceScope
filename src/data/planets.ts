import type { CelestialBody, CelestialBodyType } from '../types/planet';

/**
 * Primary astronomical dataset for SpaceScope.
 * Accurate physical characteristics, rotational properties, orbital metrics,
 * mission history, atmospheric profiles, axial tilts, and visual rendering attributes
 * for the Sun and eight planets per design.md §9, §29, and NASA Eyes.
 */
export const PLANETS: CelestialBody[] = [
  {
    id: 'sun',
    name: 'Sun',
    subtitle: 'THE YELLOW DWARF STAR',
    type: 'star',
    radius: 696340,
    distanceFromSun: 0,
    orbitalPeriod: 0,
    rotationPeriod: 600, // ~25 Earth days at equator
    moons: 0,
    temperature: 5507,
    axialTilt: 7.25,
    description: 'The yellow dwarf star at the center of our solar system, containing 99.86% of the solar system\'s total mass. Its gravitational pull binds the planets, asteroids, and comets in orbit.',
    visualProperties: {
      color: '#ffcc00',
      emissive: '#ff9900',
      emissiveIntensity: 1.6,
      roughness: 0.1,
      metalness: 0.0,
      atmosphereColor: '#ffaa00',
    },
    atmosphere: {
      composition: '73.4% Hydrogen, 25.0% Helium, 0.9% Oxygen, 0.3% Carbon',
      surfacePressure: 'Photosphere: ~0.868 kPa',
      notes: 'Nuclear fusion in the core produces ~3.846 × 10²⁶ Watts of radiant energy.',
    },
    orbitGeometry: {
      aphelionMillionKm: 0,
      perihelionMillionKm: 0,
      orbitalSpeedKmS: 220, // Galactic orbital speed
      eccentricity: 0.0,
      inclinationDeg: 7.25,
    },
    missions: [
      { name: 'Parker Solar Probe', year: '2018', agency: 'NASA', type: 'Solar Orbiter' },
      { name: 'SOHO', year: '1995', agency: 'ESA / NASA', type: 'Heliospheric Observatory' },
      { name: 'Solar Orbiter', year: '2020', agency: 'ESA', type: 'Heliophysics Probe' },
    ],
  },
  {
    id: 'mercury',
    name: 'Mercury',
    subtitle: 'THE SWIFT PLANET',
    type: 'terrestrial',
    radius: 2439.7,
    distanceFromSun: 57.9,
    orbitalPeriod: 87.97,
    rotationPeriod: 1407.6, // 58.6 Earth days
    moons: 0,
    temperature: 167,
    axialTilt: 0.034,
    description: 'The smallest planet in the Solar System and closest to the Sun, featuring a heavily cratered surface and extreme temperature swings between scorching day and freezing night.',
    visualProperties: {
      color: '#a5a5a5',
      roughness: 0.9,
      metalness: 0.1,
    },
    atmosphere: {
      composition: '42% Oxygen, 29% Sodium, 22% Hydrogen, 6% Helium',
      surfacePressure: 'Surface exosphere: ~10⁻¹⁴ bar (near-vacuum)',
      notes: 'Extremely thin exosphere incapable of retaining heat, leading to 600°C diurnal swings.',
    },
    orbitGeometry: {
      aphelionMillionKm: 69.8,
      perihelionMillionKm: 46.0,
      orbitalSpeedKmS: 47.36,
      eccentricity: 0.2056,
      inclinationDeg: 7.00,
    },
    missions: [
      { name: 'MESSENGER', year: '2004', agency: 'NASA', type: 'Orbiter' },
      { name: 'BepiColombo', year: '2018', agency: 'ESA / JAXA', type: 'Dual Orbiter' },
      { name: 'Mariner 10', year: '1973', agency: 'NASA', type: 'Flyby' },
    ],
  },
  {
    id: 'venus',
    name: 'Venus',
    subtitle: 'THE MORNING STAR',
    type: 'terrestrial',
    radius: 6051.8,
    distanceFromSun: 108.2,
    orbitalPeriod: 224.7,
    rotationPeriod: -5832.5, // Retrograde rotation
    moons: 0,
    temperature: 464,
    axialTilt: 177.36,
    description: 'Often called Earth\'s twin in size, Venus has a dense, toxic atmosphere of carbon dioxide and sulfuric acid clouds causing runaway greenhouse heating that makes it the hottest planet.',
    visualProperties: {
      color: '#e3bb76',
      roughness: 0.7,
      metalness: 0.1,
      atmosphereColor: '#f4d068',
    },
    atmosphere: {
      composition: '96.5% Carbon Dioxide, 3.5% Nitrogen, 0.015% Sulfur Dioxide',
      surfacePressure: '92 bar (~92 times Earth sea level)',
      notes: 'Super-rotating upper atmosphere circles the planet in only 4 Earth days.',
    },
    orbitGeometry: {
      aphelionMillionKm: 108.9,
      perihelionMillionKm: 107.5,
      orbitalSpeedKmS: 35.02,
      eccentricity: 0.0067,
      inclinationDeg: 3.39,
    },
    missions: [
      { name: 'Venera 13', year: '1981', agency: 'Soviet Union', type: 'Lander' },
      { name: 'Magellan', year: '1989', agency: 'NASA', type: 'Radar Mapper' },
      { name: 'Akatsuki', year: '2010', agency: 'JAXA', type: 'Climate Orbiter' },
    ],
  },
  {
    id: 'earth',
    name: 'Earth',
    subtitle: 'THE BLUE PLANET',
    type: 'terrestrial',
    radius: 6371,
    distanceFromSun: 149.6,
    orbitalPeriod: 365.25,
    rotationPeriod: 23.93,
    moons: 1,
    temperature: 15,
    axialTilt: 23.44,
    description: 'Our home planet, the only known celestial body to support life, featuring vast liquid oceans, an active geological mantle, and a protective nitrogen-oxygen atmosphere.',
    visualProperties: {
      color: '#4a90e2',
      roughness: 0.6,
      metalness: 0.2,
      atmosphereColor: '#00d2ff',
    },
    atmosphere: {
      composition: '78.08% Nitrogen, 20.95% Oxygen, 0.93% Argon, 0.04% CO₂',
      surfacePressure: '1.013 bar (101.3 kPa at sea level)',
      notes: 'Possesses a strong magnetosphere generated by liquid outer core convection.',
    },
    orbitGeometry: {
      aphelionMillionKm: 152.1,
      perihelionMillionKm: 147.1,
      orbitalSpeedKmS: 29.78,
      eccentricity: 0.0167,
      inclinationDeg: 0.00,
    },
    missions: [
      { name: 'Apollo 11', year: '1969', agency: 'NASA', type: 'Lunar Landing' },
      { name: 'ISS', year: '1998', agency: 'International', type: 'Space Station' },
      { name: 'James Webb (JWST)', year: '2021', agency: 'NASA / ESA / CSA', type: 'Space Telescope (L2)' },
    ],
  },
  {
    id: 'mars',
    name: 'Mars',
    subtitle: 'THE RED PLANET',
    type: 'terrestrial',
    radius: 3389.5,
    distanceFromSun: 227.9,
    orbitalPeriod: 686.98,
    rotationPeriod: 24.62,
    moons: 2,
    temperature: -65,
    axialTilt: 25.19,
    description: 'The Red Planet, named for its iron-oxide surface dust. Home to Olympus Mons, the largest volcano in the Solar System, and Valles Marineris, an immense canyon network.',
    visualProperties: {
      color: '#d1492d',
      roughness: 0.8,
      metalness: 0.1,
      atmosphereColor: '#e2725b',
    },
    atmosphere: {
      composition: '95.3% Carbon Dioxide, 2.6% Nitrogen, 1.9% Argon, 0.16% Oxygen',
      surfacePressure: '0.006 bar (0.6 kPa average)',
      notes: 'Global dust storms can envelop the entire planet for months during perihelion.',
    },
    orbitGeometry: {
      aphelionMillionKm: 249.2,
      perihelionMillionKm: 206.7,
      orbitalSpeedKmS: 24.07,
      eccentricity: 0.0934,
      inclinationDeg: 1.85,
    },
    missions: [
      { name: 'Perseverance & Ingenuity', year: '2020', agency: 'NASA', type: 'Rover & Rotorcraft' },
      { name: 'Curiosity', year: '2011', agency: 'NASA', type: 'Mobile Laboratory' },
      { name: 'Viking 1 & 2', year: '1975', agency: 'NASA', type: 'Orbiter & Lander' },
    ],
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    subtitle: 'THE GAS GIANT',
    type: 'gas-giant',
    radius: 69911,
    distanceFromSun: 778.5,
    orbitalPeriod: 4332.59,
    rotationPeriod: 9.93,
    moons: 95,
    temperature: -110,
    axialTilt: 3.13,
    description: 'The largest planet in the Solar System, a massive gas giant primarily composed of hydrogen and helium with alternating atmospheric bands and an iconic Great Red Spot anticyclonic storm.',
    visualProperties: {
      color: '#c8963e',
      roughness: 0.5,
      metalness: 0.0,
    },
    atmosphere: {
      composition: '89.8% Hydrogen, 10.2% Helium, trace Methane & Ammonia',
      surfacePressure: 'Gas giant (exceeds 1,000 bar at deep mantle boundary)',
      notes: 'Possesses the strongest planetary magnetic field, 20,000× stronger than Earth.',
    },
    orbitGeometry: {
      aphelionMillionKm: 816.6,
      perihelionMillionKm: 740.5,
      orbitalSpeedKmS: 13.07,
      eccentricity: 0.0489,
      inclinationDeg: 1.30,
    },
    missions: [
      { name: 'Juno', year: '2011', agency: 'NASA', type: 'Polar Orbiter' },
      { name: 'Galileo', year: '1989', agency: 'NASA', type: 'Orbiter & Atmospheric Probe' },
      { name: 'JUICE', year: '2023', agency: 'ESA', type: 'Icy Moons Explorer' },
    ],
  },
  {
    id: 'saturn',
    name: 'Saturn',
    subtitle: 'THE RINGED PLANET',
    type: 'gas-giant',
    radius: 58232,
    distanceFromSun: 1433.5,
    orbitalPeriod: 10759.22,
    rotationPeriod: 10.7,
    moons: 146,
    temperature: -140,
    axialTilt: 26.73,
    description: 'Famous for its magnificent, extensive planetary ring system composed of billions of water ice chunks, rocky debris, and interstellar dust particles spanning over 282,000 kilometers.',
    visualProperties: {
      color: '#e0c080',
      roughness: 0.5,
      metalness: 0.0,
      ring: {
        innerRadius: 1.3,
        outerRadius: 2.3,
        color: '#c5a367',
        opacity: 0.8,
      },
    },
    atmosphere: {
      composition: '96.3% Hydrogen, 3.25% Helium, 0.45% Methane, 0.01% Ammonia',
      surfacePressure: 'Gas giant (reaches high pressure in deep fluid interior)',
      notes: 'Lowest mean density of any planet (0.687 g/cm³)—it would float in water.',
    },
    orbitGeometry: {
      aphelionMillionKm: 1514.5,
      perihelionMillionKm: 1352.6,
      orbitalSpeedKmS: 9.68,
      eccentricity: 0.0565,
      inclinationDeg: 2.49,
    },
    missions: [
      { name: 'Cassini-Huygens', year: '1997', agency: 'NASA / ESA / ASI', type: 'Orbiter & Titan Lander' },
      { name: 'Voyager 1 & 2', year: '1977', agency: 'NASA', type: 'Outer System Flybys' },
      { name: 'Pioneer 11', year: '1973', agency: 'NASA', type: 'First Saturn Flyby' },
    ],
  },
  {
    id: 'uranus',
    name: 'Uranus',
    subtitle: 'THE ICE GIANT',
    type: 'ice-giant',
    radius: 25362,
    distanceFromSun: 2872.5,
    orbitalPeriod: 30685.4,
    rotationPeriod: -17.24, // Retrograde rotation
    moons: 28,
    temperature: -195,
    axialTilt: 97.77,
    description: 'An ice giant with a pale cyan hue caused by atmospheric methane, orbiting the Sun tipped completely on its side with an axial tilt of nearly 98 degrees.',
    visualProperties: {
      color: '#70d6ff',
      roughness: 0.4,
      metalness: 0.1,
      ring: {
        innerRadius: 1.2,
        outerRadius: 1.5,
        color: '#88e0ff',
        opacity: 0.3,
      },
    },
    atmosphere: {
      composition: '82.5% Hydrogen, 15.2% Helium, 2.3% Methane',
      surfacePressure: 'Ice giant (mantle composed of water, ammonia, and methane ices)',
      notes: 'Coldest planetary atmosphere in the Solar System, dropping to -224°C in tropopause.',
    },
    orbitGeometry: {
      aphelionMillionKm: 3003.6,
      perihelionMillionKm: 2741.3,
      orbitalSpeedKmS: 6.80,
      eccentricity: 0.0457,
      inclinationDeg: 0.77,
    },
    missions: [
      { name: 'Voyager 2', year: '1977', agency: 'NASA', type: 'Flyby (Encountered Jan 1986)' },
    ],
  },
  {
    id: 'neptune',
    name: 'Neptune',
    subtitle: 'THE WINDSWEPT WORLD',
    type: 'ice-giant',
    radius: 24622,
    distanceFromSun: 4495.1,
    orbitalPeriod: 60189.0,
    rotationPeriod: 16.11,
    moons: 16,
    temperature: -200,
    axialTilt: 28.32,
    description: 'The outermost major planet in the Solar System, an ice giant known for vivid deep blue methane clouds and supersonic planetary winds reaching over 2,100 km/h.',
    visualProperties: {
      color: '#2a4494',
      roughness: 0.4,
      metalness: 0.1,
      atmosphereColor: '#415a77',
    },
    atmosphere: {
      composition: '80.0% Hydrogen, 19.0% Helium, 1.5% Methane',
      surfacePressure: 'Ice giant (dense supercritical fluid mantle)',
      notes: 'Generates 2.61× more internal thermal energy than it receives from the distant Sun.',
    },
    orbitGeometry: {
      aphelionMillionKm: 4545.7,
      perihelionMillionKm: 4444.5,
      orbitalSpeedKmS: 5.43,
      eccentricity: 0.0113,
      inclinationDeg: 1.77,
    },
    missions: [
      { name: 'Voyager 2', year: '1977', agency: 'NASA', type: 'Flyby (Encountered Aug 1989)' },
    ],
  },
];

/**
 * Major Asteroids & Dwarf Planets (NASA Eyes on Asteroids signature collection)
 */
export const MAJOR_ASTEROIDS: CelestialBody[] = [
  {
    id: 'ceres',
    name: '1 Ceres',
    subtitle: 'QUEEN OF THE ASTEROID BELT',
    type: 'dwarf-planet',
    radius: 473,
    distanceFromSun: 413.7, // ~2.77 AU
    orbitalPeriod: 1682, // 4.6 Earth years
    rotationPeriod: 9.07,
    moons: 0,
    temperature: -106,
    axialTilt: 4.0,
    description: 'The largest object in the asteroid belt between Mars and Jupiter and the only dwarf planet in the inner solar system, containing one-third of the belt\'s total mass and water-ice deposits.',
    visualProperties: {
      color: '#9c9891',
      roughness: 0.85,
      metalness: 0.1,
    },
    atmosphere: {
      composition: 'Water vapor exosphere (transient outgassing)',
      surfacePressure: 'Extremely tenuous transient exosphere',
      notes: 'Features bright sodium carbonate deposits inside Occator Crater (Cerealia Facula).',
    },
    orbitGeometry: {
      aphelionMillionKm: 446.4,
      perihelionMillionKm: 382.6,
      orbitalSpeedKmS: 17.88,
      eccentricity: 0.0758,
      inclinationDeg: 10.59,
    },
    missions: [
      { name: 'Dawn', year: '2007', agency: 'NASA', type: 'Orbiter (Arrived 2015)' },
    ],
  },
  {
    id: 'vesta',
    name: '4 Vesta',
    subtitle: 'THE PROTOPLANET ASTEROID',
    type: 'asteroid',
    radius: 262.7,
    distanceFromSun: 353.4, // ~2.36 AU
    orbitalPeriod: 1325, // 3.63 Earth years
    rotationPeriod: 5.34,
    moons: 0,
    temperature: -130,
    axialTilt: 29.0,
    description: 'The second most massive body in the asteroid belt, a surviving differentiated protoplanet with an iron core, rocky mantle, and basaltic crust resembling the terrestrial planets.',
    visualProperties: {
      color: '#b8ab96',
      roughness: 0.9,
      metalness: 0.15,
    },
    orbitGeometry: {
      aphelionMillionKm: 384.6,
      perihelionMillionKm: 322.2,
      orbitalSpeedKmS: 19.34,
      eccentricity: 0.0887,
      inclinationDeg: 7.14,
    },
    missions: [
      { name: 'Dawn', year: '2007', agency: 'NASA', type: 'Orbiter (Surveyed 2011–2012)' },
    ],
  },
  {
    id: 'psyche',
    name: '16 Psyche',
    subtitle: 'THE METAL WORLD',
    type: 'asteroid',
    radius: 111,
    distanceFromSun: 437.5, // ~2.92 AU
    orbitalPeriod: 1823, // 5.0 Earth years
    rotationPeriod: 4.20,
    moons: 0,
    temperature: -140,
    axialTilt: 95.0,
    description: 'An enormous M-type asteroid likely consisting of exposed metallic iron and nickel from the core of an early planetesimal that was stripped of its rocky mantle by violent collisions.',
    visualProperties: {
      color: '#8a8885',
      roughness: 0.45,
      metalness: 0.75,
    },
    orbitGeometry: {
      aphelionMillionKm: 497.8,
      perihelionMillionKm: 377.2,
      orbitalSpeedKmS: 17.34,
      eccentricity: 0.138,
      inclinationDeg: 3.10,
    },
    missions: [
      { name: 'Psyche', year: '2023', agency: 'NASA', type: 'Orbiter (Encounter in 2029)' },
    ],
  },
  {
    id: 'bennu',
    name: '101955 Bennu',
    subtitle: 'PRIMITIVE CARBONACEOUS NEO',
    type: 'asteroid',
    radius: 0.245,
    distanceFromSun: 168.5, // ~1.126 AU
    orbitalPeriod: 436.6, // 1.2 Earth years
    rotationPeriod: 4.30,
    moons: 0,
    temperature: -30,
    axialTilt: 178.0,
    description: 'A spinning-top-shaped rubble pile asteroid rich in organic compounds and hydrated minerals, successfully sampled and returned to Earth by NASA in September 2023.',
    visualProperties: {
      color: '#424245',
      roughness: 0.95,
      metalness: 0.05,
    },
    orbitGeometry: {
      aphelionMillionKm: 202.9,
      perihelionMillionKm: 134.1,
      orbitalSpeedKmS: 27.76,
      eccentricity: 0.2037,
      inclinationDeg: 6.03,
    },
    missions: [
      { name: 'OSIRIS-REx', year: '2016', agency: 'NASA', type: 'Sample Return (Returned 2023)' },
    ],
  },
];

/**
 * Combined list of all celestial bodies (Sun, planets, and major asteroids)
 */
export const ALL_CELESTIAL_BODIES: CelestialBody[] = [...PLANETS, ...MAJOR_ASTEROIDS];

/**
 * Retrieves a celestial body by its unique identifier.
 */
export function getPlanetById(id: string): CelestialBody | undefined {
  return ALL_CELESTIAL_BODIES.find((planet) => planet.id.toLowerCase() === id.toLowerCase());
}

/**
 * Filters celestial bodies by type (star, terrestrial, gas-giant, ice-giant, dwarf-planet, asteroid).
 */
export function getPlanetsByType(type: CelestialBodyType): CelestialBody[] {
  return ALL_CELESTIAL_BODIES.filter((planet) => planet.type === type);
}
