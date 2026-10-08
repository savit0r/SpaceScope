import React, { useState } from 'react';
import { X, Crosshair, RotateCcw, Info, Wind, Compass, Rocket } from 'lucide-react';
import { useSelection } from '../../context/SelectionContext';
import {
  formatDistance,
  formatTemperature,
  formatOrbitalPeriod,
  formatRotationPeriod,
} from '../../utils/astronomy';

/**
 * Planet accent colors — subtle, derived from planet identity.
 * Used only for small indicators, not to recolor the entire UI (§5).
 */
const planetAccent: Record<string, string> = {
  mercury: '#B7A58A',
  venus: '#D8B477',
  earth: '#55B9E8',
  mars: '#D76A4A',
  jupiter: '#D9A66A',
  saturn: '#D9C38A',
  uranus: '#78C9CE',
  neptune: '#5A79D8',
  sun: '#E8C448',
};

type PanelTab = 'overview' | 'atmosphere' | 'orbit' | 'missions';

/**
 * PlanetDetailPanel Component
 * 
 * Museum placard / mission briefing architecture per design.md §9, §29, §42:
 * - Level 1: Planet name, subtitle, key metrics (Distance, Day, Moons)
 * - Level 2: Progressive disclosure tabs (Overview, Atmosphere, Orbit, Missions)
 * - Level 3: Deep scientific measurements
 * - Clean typographic alignment without SaaS card boxes
 */
export const PlanetDetailPanel: React.FC = () => {
  const { selectedPlanet, deselectPlanet, focusPlanet, resetCamera, isCameraFocused } = useSelection();
  const [activeTab, setActiveTab] = useState<PanelTab>('overview');

  if (!selectedPlanet) return null;

  const accent = planetAccent[selectedPlanet.id] || '#8FD8FF';
  const subtitle = selectedPlanet.subtitle || selectedPlanet.type.toUpperCase();

  return (
    <div className="planet-detail-panel ui-interactive">
      {/* Header — Museum placard identity (§9) */}
      <div className="panel-header">
        <div className="panel-identity">
          <h2 className="panel-planet-name">{selectedPlanet.name}</h2>
          <span className="panel-planet-subtitle" style={{ color: accent }}>
            {subtitle}
          </span>
        </div>
        <button
          className="close-btn"
          onClick={deselectPlanet}
          title="Close"
          aria-label="Close detail panel"
        >
          <X />
        </button>
      </div>

      {/* Level 1: Primary Key Stats row (§9, §29) */}
      <div className="panel-stats">
        <div className="stat-item">
          <span className="stat-value">{formatDistance(selectedPlanet.distanceFromSun)}</span>
          <span className="stat-label">Distance</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{formatRotationPeriod(selectedPlanet.rotationPeriod)}</span>
          <span className="stat-label">Day Length</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{selectedPlanet.moons}</span>
          <span className="stat-label">Moons</span>
        </div>
      </div>

      {/* Level 2: Progressive Disclosure Navigation (§29) */}
      <div className="panel-tabs">
        <button
          className={`panel-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <Info /> Overview
        </button>
        {selectedPlanet.atmosphere && (
          <button
            className={`panel-tab ${activeTab === 'atmosphere' ? 'active' : ''}`}
            onClick={() => setActiveTab('atmosphere')}
          >
            <Wind /> Atmosphere
          </button>
        )}
        {selectedPlanet.orbitGeometry && (
          <button
            className={`panel-tab ${activeTab === 'orbit' ? 'active' : ''}`}
            onClick={() => setActiveTab('orbit')}
          >
            <Compass /> Orbit
          </button>
        )}
        {selectedPlanet.missions && selectedPlanet.missions.length > 0 && (
          <button
            className={`panel-tab ${activeTab === 'missions' ? 'active' : ''}`}
            onClick={() => setActiveTab('missions')}
          >
            <Rocket /> Missions
          </button>
        )}
      </div>

      {/* Level 2 & 3 Content */}
      <div className="panel-tab-content">
        {activeTab === 'overview' && (
          <div className="tab-pane">
            <p className="planet-description">{selectedPlanet.description}</p>
            <div className="planet-metrics">
              <div className="metric-row">
                <span className="metric-label">Mean Radius</span>
                <span className="metric-value">{selectedPlanet.radius.toLocaleString()} km</span>
              </div>
              <div className="metric-row">
                <span className="metric-label">Orbital Period</span>
                <span className="metric-value">{formatOrbitalPeriod(selectedPlanet.orbitalPeriod)}</span>
              </div>
              <div className="metric-row">
                <span className="metric-label">Mean Temperature</span>
                <span className="metric-value">{formatTemperature(selectedPlanet.temperature)}</span>
              </div>
              <div className="metric-row">
                <span className="metric-label">Classification</span>
                <span className="metric-value" style={{ textTransform: 'capitalize' }}>
                  {selectedPlanet.type.replace('-', ' ')}
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'atmosphere' && selectedPlanet.atmosphere && (
          <div className="tab-pane">
            <div className="planet-metrics">
              <div className="metric-row">
                <span className="metric-label">Composition</span>
                <span className="metric-value text-right-wrap">
                  {selectedPlanet.atmosphere.composition}
                </span>
              </div>
              <div className="metric-row">
                <span className="metric-label">Pressure</span>
                <span className="metric-value">{selectedPlanet.atmosphere.surfacePressure}</span>
              </div>
            </div>
            {selectedPlanet.atmosphere.notes && (
              <p className="planet-notes">{selectedPlanet.atmosphere.notes}</p>
            )}
          </div>
        )}

        {activeTab === 'orbit' && selectedPlanet.orbitGeometry && (
          <div className="tab-pane">
            <div className="planet-metrics">
              <div className="metric-row">
                <span className="metric-label">Perihelion (Closest)</span>
                <span className="metric-value">
                  {selectedPlanet.orbitGeometry.perihelionMillionKm > 0
                    ? `${selectedPlanet.orbitGeometry.perihelionMillionKm}M km`
                    : 'Center of mass'}
                </span>
              </div>
              <div className="metric-row">
                <span className="metric-label">Aphelion (Farthest)</span>
                <span className="metric-value">
                  {selectedPlanet.orbitGeometry.aphelionMillionKm > 0
                    ? `${selectedPlanet.orbitGeometry.aphelionMillionKm}M km`
                    : 'Center of mass'}
                </span>
              </div>
              <div className="metric-row">
                <span className="metric-label">Orbital Velocity</span>
                <span className="metric-value">
                  {selectedPlanet.orbitGeometry.orbitalSpeedKmS} km/s
                </span>
              </div>
              <div className="metric-row">
                <span className="metric-label">Eccentricity</span>
                <span className="metric-value">{selectedPlanet.orbitGeometry.eccentricity}</span>
              </div>
              <div className="metric-row">
                <span className="metric-label">Inclination</span>
                <span className="metric-value">{selectedPlanet.orbitGeometry.inclinationDeg}°</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'missions' && selectedPlanet.missions && (
          <div className="tab-pane missions-list">
            {selectedPlanet.missions.map((mission) => (
              <div key={mission.name} className="mission-item">
                <div className="mission-header">
                  <span className="mission-name">{mission.name}</span>
                  <span className="mission-year">{mission.year}</span>
                </div>
                <div className="mission-details">
                  <span className="mission-agency">{mission.agency}</span>
                  <span className="mission-separator">•</span>
                  <span className="mission-type">{mission.type}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="panel-actions">
        <button
          className={`ctrl-btn ${isCameraFocused ? 'active' : ''}`}
          onClick={() => focusPlanet(selectedPlanet)}
          style={isCameraFocused ? { borderColor: accent + '60', color: accent } : undefined}
        >
          <Crosshair />
          Focus Target
        </button>
        <button className="ctrl-btn" onClick={resetCamera}>
          <RotateCcw />
          Reset View
        </button>
      </div>
    </div>
  );
};
