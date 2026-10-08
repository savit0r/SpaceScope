import React from 'react';
import { X } from 'lucide-react';
import { useComparison } from '../../context/ComparisonContext';
import { PLANETS, ALL_CELESTIAL_BODIES, getPlanetById } from '../../data/planets';
import {
  formatDistance,
  formatTemperature,
  formatOrbitalPeriod,
  formatRotationPeriod,
} from '../../utils/astronomy';

export const PlanetComparisonModal: React.FC = () => {
  const {
    isOpen,
    planetAId,
    planetBId,
    setPlanetAId,
    setPlanetBId,
    closeComparison,
  } = useComparison();

  if (!isOpen) return null;

  const planetA = getPlanetById(planetAId) || PLANETS[3];
  const planetB = getPlanetById(planetBId) || PLANETS[4];

  const maxRadius = Math.max(planetA.radius, planetB.radius);
  const ratioA = Math.round((planetA.radius / maxRadius) * 100);
  const ratioB = Math.round((planetB.radius / maxRadius) * 100);

  return (
    <div
      className="comparison-overlay ui-interactive"
      role="dialog"
      aria-label="Planet Comparison"
      aria-modal="true"
    >
      <div className="comparison-modal">
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <h2 className="modal-title">Celestial Body Comparison</h2>
            <p className="modal-subtitle">Side-by-side comparative data</p>
          </div>
          <button
            className="close-btn"
            onClick={closeComparison}
            aria-label="Close comparison"
            title="Close"
          >
            <X />
          </button>
        </div>

        {/* Planet Selectors */}
        <div className="selector-grid">
          <div className="selector-card">
            <label htmlFor="planet-a-select" className="select-label">
              Planet A
            </label>
            <select
              id="planet-a-select"
              value={planetAId}
              onChange={(e) => setPlanetAId(e.target.value)}
              className="planet-select"
              aria-label="Select first planet"
            >
              {ALL_CELESTIAL_BODIES.map((p) => (
                <option key={`a-${p.id}`} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <span className="vs-badge">VS</span>

          <div className="selector-card">
            <label htmlFor="planet-b-select" className="select-label">
              Planet B
            </label>
            <select
              id="planet-b-select"
              value={planetBId}
              onChange={(e) => setPlanetBId(e.target.value)}
              className="planet-select"
              aria-label="Select second planet"
            >
              {ALL_CELESTIAL_BODIES.map((p) => (
                <option key={`b-${p.id}`} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Data Grid */}
        <div className="comparison-table">
          {/* Header Row */}
          <div className="table-header-row">
            <div className="header-col planet-a-col">
              <span
                className="color-dot"
                style={{ backgroundColor: planetA.visualProperties.color }}
              />
              <span>{planetA.name}</span>
            </div>
            <div className="header-col metric-col">Metric</div>
            <div className="header-col planet-b-col">
              <span>{planetB.name}</span>
              <span
                className="color-dot"
                style={{ backgroundColor: planetB.visualProperties.color }}
              />
            </div>
          </div>

          {/* Radius */}
          <div className="table-row">
            <div className="val-col planet-a-val">
              {planetA.radius.toLocaleString()} km
              <div className="bar-container">
                <div
                  className="size-bar"
                  style={{
                    width: `${ratioA}%`,
                    backgroundColor: planetA.visualProperties.color,
                  }}
                />
              </div>
            </div>
            <div className="label-col">Mean Radius</div>
            <div className="val-col planet-b-val">
              {planetB.radius.toLocaleString()} km
              <div className="bar-container" style={{ marginLeft: 'auto' }}>
                <div
                  className="size-bar"
                  style={{
                    width: `${ratioB}%`,
                    backgroundColor: planetB.visualProperties.color,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Distance */}
          <div className="table-row">
            <div className="val-col planet-a-val">
              {formatDistance(planetA.distanceFromSun)}
            </div>
            <div className="label-col">Distance</div>
            <div className="val-col planet-b-val">
              {formatDistance(planetB.distanceFromSun)}
            </div>
          </div>

          {/* Orbital Period */}
          <div className="table-row">
            <div className="val-col planet-a-val">
              {formatOrbitalPeriod(planetA.orbitalPeriod)}
            </div>
            <div className="label-col">Orbital Period</div>
            <div className="val-col planet-b-val">
              {formatOrbitalPeriod(planetB.orbitalPeriod)}
            </div>
          </div>

          {/* Rotation */}
          <div className="table-row">
            <div className="val-col planet-a-val">
              {formatRotationPeriod(planetA.rotationPeriod)}
            </div>
            <div className="label-col">Rotation</div>
            <div className="val-col planet-b-val">
              {formatRotationPeriod(planetB.rotationPeriod)}
            </div>
          </div>

          {/* Moons */}
          <div className="table-row">
            <div className="val-col planet-a-val">{planetA.moons}</div>
            <div className="label-col">Moons</div>
            <div className="val-col planet-b-val">{planetB.moons}</div>
          </div>

          {/* Temperature */}
          <div className="table-row">
            <div className="val-col planet-a-val">
              {formatTemperature(planetA.temperature)}
            </div>
            <div className="label-col">Temperature</div>
            <div className="val-col planet-b-val">
              {formatTemperature(planetB.temperature)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
